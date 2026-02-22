import { Request, Response } from 'express';
import Volunteer from '../models/volunteer.model';
import Project from '../models/project.model';
import dotenv from 'dotenv';
dotenv.config();

export const registerProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { volunteerId, projectId } = req.body;
    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      volunteerId,
      { $addToSet: { registeredProjects: projectId } },
      { returnDocument: 'after' }
    );
    if (!updatedVolunteer) {
      res.status(400).json({ message: 'Volunteer not found' });
      return;
    }

    await Project.findByIdAndUpdate(
      projectId,
      { $inc: { registrations: 1 } }
    )

    res.status(200).json({
      message: 'Successfully registered',
      volunteer: updatedVolunteer
    })

  } catch (err) {
    res.status(500).json({
      message: 'Server error'
    });
  }
}

export const unregisterProject = async (req: Request, res: Response) => {
  try {
    const { volunteerId, projectId } = req.body;
    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      volunteerId,
      { $pull: { registeredProjects: projectId } },
      { returnDocument: 'after' }
    );
    if (!updatedVolunteer) {
      res.status(400).json({ message: 'Volunteer not found' });
      return;
    }

    await Project.findByIdAndUpdate(
      projectId,
      { $inc: { registrations: -1 } }
    )

    res.status(200).json({
      message: 'Successfully unregistered',
      volunteer: updatedVolunteer
    })

  } catch (err) {
    console.error('Backend error in unregister', err);
    res.status(500).json({
      message: 'Server error'
    });
  }
}

export const showRegisteredProj = async (req: Request, res: Response) => {
  try {
    const { volunteerId } = req.params;
    const volunteer = await Volunteer.findById(volunteerId).populate('registeredProjects').sort({ date: -1 });
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json(volunteer.registeredProjects);
  } catch (err) {
    console.error('volunteer controller showregproj', err);
    res.status(500).json({
      message: 'Server error'
    });
  }
}

export const showUpcomingProj = async (req: Request, res: Response) => {
  try {
    const { volunteerId } = req.params;
    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) {
      return res.status(400).json({ message: 'Volunteer not found' });
    }
    const availableProj = await Project.find({
      _id: { $nin: volunteer.registeredProjects }
    }).sort({ date: -1 });

    res.json(availableProj);
  } catch (err) {
    console.error('volunteer controller showregproj', err);
    res.status(500).json({
      message: 'Server error'
    });
  }
}
