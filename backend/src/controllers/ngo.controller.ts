import { Request, Response } from 'express';
import Project from '../models/project.model';
import Volunteer from '../models/volunteer.model'
import NGO from '../models/ngo.model';
import dotenv from 'dotenv';
dotenv.config();

interface PopulatedVolunteer {
  _id: string;
  username: string;
  registeredProjects: {
    project: string;
    status: string;
  }[];
}

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { ngoId } = req.params;
    const ngo = await NGO.findById(ngoId).populate({
      path: 'projects',
      options: { sort: { date: -1 } }
    });
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }
    const filtered = [...ngo.projects]
      .filter(entry => (entry as any)?.status !== 'Completed')
    res.json(filtered);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const addProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, ngo, date, address, registrations, tags, VolunteersRegistered } = req.body
    const newProject = new Project({ name, ngo, date, address, registrations, tags, VolunteersRegistered });
    const savedProject = await newProject.save();
    const { ngoId } = req.params;
    const updatedNGO = await NGO.findByIdAndUpdate(
      ngoId,
      { $addToSet: { projects: savedProject._id } },
      { returnDocument: 'after' }
    )
    res.status(200).json(savedProject);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export const delProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ngoId, projId } = req.body;

    const deletedProject = await Project.findByIdAndDelete(projId);
    if (!deletedProject) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const updatedNGO = await NGO.findByIdAndUpdate(
      ngoId,
      { $pull: { projects: projId } },
      { returnDocument: 'after' }
    )

    await Volunteer.updateMany(
      { _id: { $in: deletedProject.VolunteersRegistered } },
      { $pull: { registeredProjects: { project: projId } } }
    )

    res.json({ message: "Project deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const getProjectVolunteers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id).populate<{ VolunteersRegistered: { _id: string; username: string; registeredProjects: { project: string; status: string }[] }[] }>({
      path: 'VolunteersRegistered',
      select: '_id username registeredProjects'
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const volunteers = project.VolunteersRegistered || [];

    const formattedVolunteers = volunteers.map(vol => {
      const projectEntry = vol.registeredProjects.find(
        (p) => p.project.toString() === id.toString()
      );

      return {
        id: vol._id,
        username: vol.username,
        status: projectEntry ? projectEntry.status : 'notStarted'
      };
    });

    res.json(formattedVolunteers);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export const completeEvent = async (req: Request, res: Response) => {
  try{
    const { projectId } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      { _id: projectId },
      { $set: { status: 'Completed' } },
      { returnDocument: 'after' }
    );
    if (!updatedProject) {
      return res.status(404).json({ message: 'Volunteer or project not found' });
    }
    res.status(200).json({
      message: 'Status updated'
    });
  } catch (err) {
    console.error('completeEvent volunteer controller', err);
    res.status(500).json({ message: 'Server error' });
  }
}
