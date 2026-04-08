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
      { $push: { registeredProjects: { project: projectId, status: 'Ongoing' } } },
      { returnDocument: 'after' }
    );
    if (!updatedVolunteer) {
      res.status(400).json({ message: 'Volunteer not found' });
      console.error("RegisterProject error: Volunteer not found")
      return;
    }

    await Project.findByIdAndUpdate(
      projectId,
      {
        $inc: { registrations: 1 },
        $addToSet: { VolunteersRegistered: volunteerId }
      }
    )

    res.status(200).json({
      message: 'Successfully registered',
      volunteer: updatedVolunteer
    })

  } catch (err) {
    console.error(err)
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
      { $pull: { registeredProjects: { project: projectId } } },
      { returnDocument: 'after' }
    );
    if (!updatedVolunteer) {
      res.status(400).json({ message: 'Volunteer not found' });
      return;
    }

    await Project.findByIdAndUpdate(
      projectId,
      {
        $inc: { registrations: -1 },
        $pull: { VolunteersRegistered: volunteerId }
      }
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
    const volunteer = await Volunteer.findById(volunteerId).populate('registeredProjects.project');
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    const filtered = [...volunteer.registeredProjects]
      .filter( entry => (entry.project as any)?.status !== 'Completed' && entry.status !== 'Completed')
      .sort((a, b) => {
        const dateA = (a.project as any)?.date ?? 0;
        const dateB = (b.project as any)?.date ?? 0;
        return dateB - dateA;
      });
    res.status(200).json({
      message: 'Fetched Successfully',
      regProj: filtered
    });
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
    const { filterByPrefs } = req.query;
    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) {
      return res.status(400).json({ message: 'Volunteer not found' });
    }
    const regprojs = volunteer.registeredProjects.map((entry) => entry.project);
    
    const query: any = {
      _id: { $nin: regprojs },
      status: { $ne: 'Completed' }
    };

    if (filterByPrefs === 'true' && volunteer.preferences.length > 0) {
      query.tags = { $in: volunteer.preferences };
    }

    const availableProj = await Project.find(query).sort({ date: -1 });

    res.status(200).json({
      message: 'Fetched Successfully',
      upcomingProjects: availableProj
    });
  } catch (err) {
    console.error('volunteer controller showregproj', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export const UpdatePreferences = async (req: Request, res: Response) => {
  try {
    const { volunteerId, preferences } = req.body;

    if (!Array.isArray(preferences) || preferences.length === 0) {
      res.status(400).json({ message: 'At least one preference is required' });
      return;
    }

    const validPreferences = ['Education', 'Environment', 'Healthcare', 'Elderly Care', 'Animal Welfare'];
    const invalidPrefs = preferences.filter(p => !validPreferences.includes(p));
    if (invalidPrefs.length > 0) {
      res.status(400).json({ message: `Invalid preferences: ${invalidPrefs.join(', ')}` });
      return;
    }

    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      volunteerId,
      { preferences },
      { returnDocument: 'after' }
    );

    if (!updatedVolunteer) {
      res.status(404).json({ message: 'Volunteer not found' });
      return;
    }

    res.status(200).json({ message: 'Preferences updated', preferences: updatedVolunteer.preferences });
  } catch (err) {
    console.error('Error updating preferences:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export const GetPreferences = async (req: Request, res: Response) => {
  try {
    const { volunteerId } = req.params;
    const volunteer = await Volunteer.findById(volunteerId).select('preferences');

    if (!volunteer) {
      res.status(404).json({ message: 'Volunteer not found' });
      return;
    }

    res.json({ preferences: volunteer.preferences });
  } catch (err) {
    console.error('Error fetching preferences:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export const completeTask = async (req: Request, res: Response) => {
  try{
    const { volunteerId, projectId } = req.body;
    const updatedVolunteer = await Volunteer.findOneAndUpdate(
      { _id: volunteerId, 'registeredProjects.project': projectId },
      { $set: { 'registeredProjects.$.status': 'Completed' } },
      { returnDocument: 'after' }
    );
    if (!updatedVolunteer) {
      return res.status(404).json({ message: 'Volunteer or project not found' });
    }
    res.status(200).json({
      message: 'Status updated',
      volunteer: updatedVolunteer
    });
  } catch (err) {
    console.error('completeProject volunteer controller', err);
    res.status(500).json({ message: 'Server error' });
  }
}