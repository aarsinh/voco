import mongoose, { Schema } from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
dotenv.config();
 
const MONGO_URI = process.env.DB_LINK as string;
 
import NGO from './models/ngo.model'
import Project  from './models/project.model';
import  Volunteer  from './models/volunteer.model';
 
const NUM_NGOS = 10;
const NUM_PROJECTS = 30;       // spread across NGOs
const NUM_VOLUNTEERS = 50;     // each registers in 1–3 projects
const MAX_PROJECTS_PER_VOL = 3;
const REVIEWS_PER_PROJECT = 2; // how many volunteers leave a review
 
const TAGS = ['Education', 'Environment', 'Healthcare', 'Elderly Care', 'Animal Welfare'];
 
const pick = <T>(arr: T[]): T => faker.helpers.arrayElement(arr);
const pickMany = <T>(arr: T[], min = 1, max = 3): T[] =>
  faker.helpers.arrayElements(arr, { min, max });
 
async function seedNGOs() {
  const ngoDocs = Array.from({ length: NUM_NGOS }, () => ({
    username: faker.internet.username(),
    name: faker.company.name(),
    email: faker.internet.email().toLowerCase(),
    password: "$2b$10$XDHGbNJxtwu/XIqeiRMnd.EbKFzguDbp3umNxCK2lLI6OGVg3uwbW",
    phoneNumber: faker.string.numeric(10),
    website: faker.internet.url({ protocol: 'https' }),
    numProjTerminated: faker.number.int({ min: 0, max: 5 }),
    reviews: [],
    projects: [],
  }));
 
  const ngos = await NGO.insertMany(ngoDocs);
  console.log(`✔ Inserted ${ngos.length} NGOs`);
  return ngos;
}
 
async function seedProjects(ngos: any[]) {
  const projectDocs = Array.from({ length: NUM_PROJECTS }, () => {
    const ngo = pick(ngos);
    return {
      name: faker.lorem.words({ min: 2, max: 4 }),
      ngo: ngo.name,                          // denormalized NGO name
      ngoId: ngo._id,                         // reference
      date: faker.date.soon({ days: 180 }),
      address: faker.location.streetAddress() + ', ' + faker.location.city(),
      status: pick(['Ongoing', 'Completed']) as 'Ongoing' | 'Completed',
      registrations: 0,                       // will be updated after volunteers
      tags: pickMany(TAGS),
      VolunteersRegistered: [],               // populated after volunteers
    };
  });
 
  const projects = await Project.insertMany(projectDocs);
  console.log(`✔ Inserted ${projects.length} Projects`);
  return projects;
}
 
async function seedVolunteers(projects: any[]) {
  const volunteerDocs = Array.from({ length: NUM_VOLUNTEERS }, () => {
    const assignedProjects = pickMany(projects, 1, MAX_PROJECTS_PER_VOL);
 
    return {
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: "$2b$10$XDHGbNJxtwu/XIqeiRMnd.EbKFzguDbp3umNxCK2lLI6OGVg3uwbW",
      name: faker.person.fullName(),
      age: faker.number.int({ min: 18, max: 60 }),
      sex: pick(['male', 'female', 'other']) as 'male' | 'female' | 'other',
      phoneNumber: faker.string.numeric(10),
      preferences: pickMany(TAGS),
      registeredProjects: assignedProjects.map(p => ({
        project: p._id,
        status: p.status,
      })),
      reports: [],                            // populated after stitching
    };
  });
 
  const volunteers = await Volunteer.insertMany(volunteerDocs);
  console.log(`✔ Inserted ${volunteers.length} Volunteers`);
  return volunteers;
}
 
async function stitchReferences(projects: any[], volunteers: any[]) {
  // 4a — push volunteer _ids onto their registered projects
  //      and increment registrations count
  for (const vol of volunteers) {
    for (const reg of vol.registeredProjects) {
      await Project.findByIdAndUpdate(reg.project, {
        $push: { VolunteersRegistered: vol._id },
        $inc:  { registrations: 1 },
      });
    }
  }
  console.log('✔ VolunteersRegistered arrays populated');
 
  // 4b — push project _ids onto parent NGO's projects array
  for (const project of projects) {
    await NGO.findByIdAndUpdate(project.ngoId, {
      $push: { projects: project._id },
    });
  }
  console.log('✔ NGO projects arrays populated');
}
 
async function seedReviews(projects: any[], volunteers: any[]) {
  for (const project of projects) {
    // find volunteers who registered for this project
    const projectVols = volunteers.filter(v =>
      v.registeredProjects.some((r: any) =>
        r.project.equals(project._id)
      )
    );
 
    // take up to REVIEWS_PER_PROJECT of them
    const reviewers = projectVols.slice(0, REVIEWS_PER_PROJECT);
 
    for (const vol of reviewers) {
      await NGO.findByIdAndUpdate(project.ngoId, {
        $push: {
          reviews: {
            projectId:  project._id,
            volunteerId: vol._id,
            rating:     faker.number.int({ min: 1, max: 5 }),
            reviewText: faker.lorem.sentences({ min: 1, max: 3 }),
            createdAt:  faker.date.recent({ days: 90 }),
          },
        },
      });
    }
  }
  console.log('✔ NGO reviews populated');
}
 
async function seedReports(volunteers: any[], projects: any[]) {
  // give ~30% of volunteers a report from a random NGO
  const subset = volunteers.filter(() => Math.random() < 0.3);
 
  for (const vol of subset) {
    // pick a project the volunteer was involved in to find the NGO
    if (vol.registeredProjects.length === 0) continue;
    const reg = pick(vol.registeredProjects) as { project: mongoose.Types.ObjectId; status: string };
    const project = projects.find(p => p._id.equals(reg.project));
    if (!project) continue;
 
    await Volunteer.findByIdAndUpdate(vol._id, {
      $push: {
        reports: {
          ngoId:     project.ngoId,
          ngoName:   project.ngo,          // denormalized
          comment:   faker.lorem.sentence(),
          createdAt: faker.date.recent({ days: 60 }),
        },
      },
    });
  }
  console.log('✔ Volunteer reports populated');
}
 
async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB\n');
 
  // clear existing data (comment out if you want to keep existing docs)
  await Promise.all([
    NGO.deleteMany({}),
    Project.deleteMany({}),
    Volunteer.deleteMany({}),
  ]);
  console.log('Collections cleared\n');
 
  const ngos       = await seedNGOs();
  const projects   = await seedProjects(ngos);
  const volunteers = await seedVolunteers(projects);
 
  await stitchReferences(projects, volunteers);
  await seedReviews(projects, volunteers);
  await seedReports(volunteers, projects);
 
  console.log('\n🌱 Seeding complete');
  await mongoose.disconnect();
  process.exit(0);
}
 
main().catch(err => {
  console.error(err);
  process.exit(1);
});