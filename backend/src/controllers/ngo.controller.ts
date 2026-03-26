import { Request, Response } from 'express';
import Project from '../models/project.model';
import dotenv from 'dotenv';
import NGO from '../models/ngo.model';
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
    const ngo = await NGO.findById(ngoId).populate('projects').sort({ date: -1 });
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
    const updatedVolunteer = await NGO.findByIdAndUpdate(
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
    const updatedNGO = await NGO.findByIdAndUpdate(
      ngoId,
      { $pull: { projects: projId } },
      { returnDocument: 'after' }
    )
    const deletedProject = await Project.findByIdAndDelete(projId);
    if (!deletedProject) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.json({ message: "Project deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const getProjectVolunteers = async (req: Request, res: Response) => {
  try{
  const {id} = req.params;

  const rawProject = await Project.findById(id).lean();
  console.log("IDs in Database:", rawProject?.VolunteersRegistered); 

const populated = await Project.findById(id).populate('VolunteersRegistered');
console.log("Populated Data:", populated?.VolunteersRegistered);


  //fetch the username and registeredPorjects ( has project ID and status of that project) array for every volunteer
  const project = await Project.findById(id).populate<{VolunteersRegistered: PopulatedVolunteer[] }>({
    path: 'VolunteersRegistered',
    select: 'username registeredProjects'
  });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }


  //filter out the array by only including the ones that have project ID == main ID
  const formattedVolunteers = project.VolunteersRegistered.map( 
    vol => { const projectEntry = vol.registeredProjects.find(
      (p) => p.project.toString() === id.toString()
    );

    return {
      id: vol._id,
      username: vol.username,
      status: projectEntry ? projectEntry.status : 'Invalid'
    };
  });

  res.json(formattedVolunteers);
  }

  catch(err:any){
    res.status(500).json({ message: err.message });
  }
}

export const updateEventStatus = async (req: Request, res: Response) => {
  
}
