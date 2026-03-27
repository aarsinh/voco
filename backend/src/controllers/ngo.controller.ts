import { Request, Response } from 'express';
import Project from '../models/project.model';
import Volunteer from '../models/volunteer.model'
import NGO from '../models/ngo.model';
import dotenv from 'dotenv';
dotenv.config();

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
    res.json(ngo.projects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const addProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const newProject = new Project(req.body);
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
      { $pull: { registeredProjects: {project: projId} } }
    )

    res.json({ message: "Project deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const updateEventStatus = async (req: Request, res: Response) => {
  try {
    const { projectId, status } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      { _id: projectId },
      { $set: { status: status } },
      { returnDocument: 'after' }
    );
    if (!updatedProject) {
      return res.status(404).json({ message: 'Volunteer or project not found' });
    }
    res.status(200).json({
      message: 'Status updated',
      project: updatedProject
    });
  } catch (err) {
    console.error('updateTaskStatus volunteer controller', err);
    res.status(500).json({ message: 'Server error' });
  }
}
