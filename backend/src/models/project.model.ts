import mongoose, { Document, Schema } from 'mongoose';

export interface Project extends Document {
  name: string;
  ngo: string;
  date: Date;
}

const projectSchema: Schema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  ngo: { 
    type: String,
    required: true
  },
  date: { 
    type: Date, 
    required: true 
  },
  address: {
    type: String, 
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'ongoing', 'completed'],
    default: 'pending'
  },
  registrations: { 
    type: Number, 
    default: 0 
  },
  VolunteersRegistered: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Volunteer',
      required: true
    }
  ]
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
