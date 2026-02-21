import { Request, Response } from 'express';
import Volunteer from '../models/volunteer.model';
import Project from '../models/project.model';
import dotenv from 'dotenv';
import NGO from '../models/ngo.model';
dotenv.config();

export const getProjects = async(req: Request, res: Response): Promise<void> => {
    try {
        const { ngoId } = req.params; 
        const projects = await Project.findById(ngoId).sort({date: -1});
        res.json(projects);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const addProject = async(req: Request, res: Response): Promise<void> => {
    try {
        const newProject = new Project(req.body);
        const savedProject = await newProject.save();
        const { ngoId } = req.params;
        const updatedVolunteer = await NGO.findByIdAndUpdate(
            ngoId,
            {$addToSet: {projects: savedProject._id}},
            {new: true}
        )
        res.status(200).json(savedProject);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const delProject = async(req: Request, res: Response): Promise<void> => {
    try {
        const { ngoId, projId } = req.body;
        const updatedNGO = await NGO.findByIdAndUpdate(
            ngoId,
            {$pull: {projects: projId}},
            {new: true}
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