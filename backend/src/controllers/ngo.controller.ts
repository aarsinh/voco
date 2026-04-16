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
      { 
        $pull: { projects: projId },
        $inc: { numProjTerminated: 1 }, 
      },
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


export const getNGOProfile = async (req: Request, res: Response) => {
  try {
    const { ngoId } = req.params;
    // Explicitly include username in the selection
    const ngo = await NGO.findById(ngoId)
      .select('name email phoneNumber website username reviews')
      .populate({
        path: 'reviews.projectId',
        select: 'name'
      });

    if (!ngo) return res.status(404).json({ message: 'NGO not found' });

    const totalReviews = ngo.reviews.length;
    const avgRating = totalReviews > 0 
      ? ngo.reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews 
      : 0;

    res.json({
      details: {
        username: ngo.username, // Now being sent to frontend
        name: ngo.name,
        email: ngo.email,
        phoneNumber: ngo.phoneNumber,
        website: ngo.website
      },
      avgRating: avgRating.toFixed(1),
      reviews: ngo.reviews
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNGODetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, name, email, phoneNumber, website, password } = req.body;

    // Use findOne and save to allow the pre-save hook in your model to handle the hashing
    const ngo = await NGO.findById(id);
    if (!ngo) return res.status(404).json({ message: "NGO not found" });

    ngo.username = username || ngo.username;
    ngo.name = name || ngo.name;
    ngo.email = email || ngo.email;
    ngo.phoneNumber = phoneNumber || ngo.phoneNumber;
    ngo.website = website || ngo.website;
    
    // Only update password if user actually typed something
    if (password && password.trim() !== "") {
      ngo.password = password;
    }

    await ngo.save();

    res.status(200).json({
      message: "Profile updated successfully",
      details: {
        username: ngo.username,
        name: ngo.name,
        email: ngo.email,
        phoneNumber: ngo.phoneNumber,
        website: ngo.website
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const projectStatusPie = async (req: Request, res: Response) => {
  const { id } = req.params;
  const ngo = await NGO.findById(id).populate({
    path: 'projects'
  });
  if(!ngo){
    return res.status(404).json({message: "Not found"});
  }
  const statusCounts = ngo.projects.reduce((acc: any, project: any) => {
    const status = project.status || 'Ongoing';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  statusCounts["Terminated"] = ngo.numProjTerminated || 0;

  return res.status(200).json(statusCounts);
};