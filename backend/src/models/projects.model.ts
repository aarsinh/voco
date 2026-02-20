import mongoose, { Document, Schema } from 'mongoose';

export interface Project extends Document {
    name: string;
    ngo: string;
    date: Date;
    registrations: number;
}

const projectSchema: Schema = new mongoose.Schema({
    name: { type: String, required: true },
    ngo: { type: String, required: true },
    date: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model<Project>('Project', projectSchema);