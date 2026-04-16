import { Request, Response } from 'express';
import Project from '../models/project.model';
import Volunteer from '../models/volunteer.model'
import NGO from '../models/ngo.model';
import { sendEmail } from '../services/email.service';
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

    const matchingVolunteers = await Volunteer.find({
      preferences: { $in: tags },
      _id: { $nin: savedProject.VolunteersRegistered }
    });

    const emailPromises = matchingVolunteers.map(volunteer => {
      const emailHtml = `
        <h2>New Project Available!</h2>
        <p>Hi ${volunteer.name},</p>
        <p>A new project matching your preferences has been posted:</p>
        <ul>
          <li><strong>Project:</strong> ${name}</li>
          <li><strong>NGO:</strong> ${ngo}</li>
          <li><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</li>
          <li><strong>Tags:</strong> ${tags.join(', ')}</li>
        </ul>
        <p>Log in to volunteer and learn more!</p>
      `;
      return sendEmail(volunteer.email, `New Project: ${name}`, emailHtml);
    });

    Promise.all(emailPromises).catch(err => console.error('Error sending notification emails:', err));

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

export const updateVolunteerReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { report } = req.body;

    // 1. Validation: Ensure the report text isn't empty
    if (!report || report.trim() === "") {
      return res.status(400).json({ message: "Report content cannot be empty." });
    }

    // 2. Database Update: Use $push to add the new report to the existing array
    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      id,
      { $push: { reports: report } },
      { new: true, runValidators: true } // 'new' returns the updated document, 'runValidators' ensures schema rules apply
    );

    // 3. Handle case where volunteer doesn't exist
    if (!updatedVolunteer) {
      return res.status(404).json({ message: "Volunteer not found." });
    }

    // 4. Success response
    res.status(200).json({
      message: "Volunteer reported successfully",
      reportsCount: updatedVolunteer.reports.length
    });
    
  } catch (error: any) {
    console.error("Error in updateVolunteerReport:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
