import { Request, Response } from 'express';
import Volunteer from '../models/volunteers.model';
import Project from '../models/projects.model';
import dotenv from 'dotenv';
dotenv.config();

export const registerProject = async(req: Request, res: Response): Promise<void> => {
    try{
        const {volunteerId, projectId} = req.body;
        const updatedVolunteer = await Volunteer.findByIdAndUpdate(
            volunteerId,
            {$push: {registeredProjects : projectId}},
            {new: true}
        );
        if(!updatedVolunteer){
            res.status(400).json({message: 'Volunteer not found'});
            return;
        }

        await Project.findByIdAndUpdate(
            projectId,
            {$inc: {registrations: 1}}
        )

        res.status(200).json({
            message: 'Successfully registered',
            volunteer: updatedVolunteer
        })

    } catch(err){
        res.status(500).json({
            message: 'Server error'
        });
    }
}

export const unregisterProject = async(req: Request, res: Response) => {
    try {
        const { volunteerId, projectId } = req.body;
        const updatedVolunteer = await Volunteer.findByIdAndUpdate(
            volunteerId,
            { $pull: { registeredProjects: projectId } },
            { new: true }
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