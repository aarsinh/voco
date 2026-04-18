import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Project from '../models/project.model';
import Volunteer from '../models/volunteer.model'
import NGO from '../models/ngo.model';
import { sendEmail } from '../services/email.service';
import dotenv from 'dotenv';
dotenv.config();

const ALL_TAGS = [
  "Education",
  "Environment",
  "Healthcare",
  "Elderly Care",
  "Animal Welfare"
];

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { ngoId } = req.params;
    const ngo = await NGO.findById(ngoId).populate({
      path: 'projects',
      options: { sort: { date: 1 } }
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
};

export const addProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ngoId } = req.params; 
    const { name, ngo, date, address, registrations, tags, VolunteersRegistered } = req.body;

    const newProject = new Project({ 
      name, 
      ngo, 
      ngoId, 
      date, 
      address, 
      registrations, 
      tags, 
      VolunteersRegistered 
    });

    const savedProject = await newProject.save();

    await NGO.findByIdAndUpdate(
      ngoId,
      { $addToSet: { projects: savedProject._id } },
      { returnDocument: 'after' }
    )

    const safeTags = Array.isArray(tags) ? tags.map(tag => String(tag)) : [];
    const safeRegIds = Array.isArray(savedProject.VolunteersRegistered) ? savedProject.VolunteersRegistered : [];

    const matchingVolunteers = await Volunteer.find({
      preferences: { $in: safeTags },
      _id: { $nin: safeRegIds }
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
};

export const delProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ngoId, projId } = req.body;

    const deletedProject = await Project.findByIdAndDelete(projId);
    if (!deletedProject) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    await NGO.findByIdAndUpdate(
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
};

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
};

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
};

export const updateVolunteerReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { report, ngoId, ngoName } = req.body;

    if (!report || report.trim() === "") {
      return res.status(400).json({ message: "Report content cannot be empty." });
    }

    const newReport = {
      ngoId: new mongoose.Types.ObjectId(ngoId),
      ngoName: ngoName || 'NGO',
      comment: report,
      createdAt: new Date()
    };

    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      id,
      { $push: { reports: newReport } },
      { new: true, runValidators: true }
    );

    if (!updatedVolunteer) {
      return res.status(404).json({ message: "Volunteer not found." });
    }

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
  const { ngoId } = req.params;
  const now = new Date();
  const ngo = await NGO.findById(ngoId).populate({
    path: 'projects'
  });
  if(!ngo){
    return res.status(404).json({message: "Not found"});
  }
  const statusCounts = ngo.projects.reduce((acc: any, project: any) => {
    const status = project.status || 'Ongoing';
    const ngoDate = new Date(project.date);
    if(status === 'Ongoing' && now < ngoDate) acc['Pending'] = (acc['Pending'] || 0) + 1;
    else acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  statusCounts["Terminated"] = ngo.numProjTerminated || 0;

  return res.status(200).json(statusCounts);
};

export const getProjectHistory = async (req: Request, res: Response) => {
  try {
    const { ngoId } = req.params;
    
    // Find NGO and only populate projects where status is 'Completed'
    const ngo = await NGO.findById(ngoId).populate({
      path: 'projects',
      match: { status: 'Completed' },
      options: { sort: { date: -1 } } 
    });

    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    res.json(ngo.projects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const volPerProject = async(req: Request, res: Response) => {
  const { ngoId } = req.params;
  const ngo = await NGO.findById(ngoId).populate({
    path: 'projects', 
    match: { status: { $ne: 'Ongoing' } },
    options: { sort: { date: 1 } }
  }).lean(); //lean makes query faster as it is just a read
  if(!ngo){
    return res.status(404).json({ message: 'NGO not found' });
  }
  
  const registrations = (ngo.projects as any[]).map(project => project.registrations || 0);
  res.json({
    numProj: ngo.projects.length,
    volNum: registrations
  })
};

export const ratingPerProject = async(req: Request, res: Response) => {
  try {
    const { ngoId } = req.params;

    const pipelineResult = await NGO.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(ngoId as string) } },
      { $unwind: "$reviews" },
      {
        $group: {
          _id: "$reviews.projectId",
          averageRating: { $avg: "$reviews.rating" }
        }
      },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "projectData"
        }
      },
      { $unwind: "$projectData" },
      { $sort: { "projectData.date": 1 } },
      {
        $project: {
          _id: 0,
          averageRating: 1
        }
      }
    ]);

    // pipelineResult looks like: [ { averageRating: 4.5 }, { averageRating: 3.2 } ]
    // Use .map() to flatten it into a simple array of numbers just like your volunteers array
    const flatAverages = pipelineResult.map(item => item.averageRating);

    // flatAverages is now exactly what you want: [4.5, 3.2, 5, 4.8]
    res.status(200).json(flatAverages);

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const getTagDistribution = async (req: Request, res: Response) => {
  try {
    const { ngoId } = req.params;

    const tagsData = await NGO.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(ngoId as string) } },
      {
        $lookup: {
          from: "projects",
          localField: "projects",
          foreignField: "_id",
          as: "projectData"
        }
      },
      { $unwind: "$projectData" },
      { $unwind: "$projectData.tags" },
      {
        $group: {
          _id: "$projectData.tags",
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedForRecharts = ALL_TAGS.map(tag => {
      const existingTag = tagsData.find(item => item._id === tag);
      return {
        subject: tag,
        count: existingTag ? existingTag.count : 0
      };
    });

    return res.status(200).json(formattedForRecharts);

  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTopProjects = async (req: Request, res: Response) => {
  try {
    const { ngoId } = req.params;

    const ngoData = await NGO.findById(ngoId)
      .populate({
        path: 'projects',
        options: {
          sort: { registrations: -1 }, 
          limit: 3 
        },
        select: 'name registrations date status'
      })
      .lean();

    if (!ngoData) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    res.status(200).json(ngoData.projects);

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};