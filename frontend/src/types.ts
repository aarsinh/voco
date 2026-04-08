export interface Project {
  _id: string;
  name: string;
  ngo: string;
  date: Date;
  address: string;
  registrations?: number;
  ngoId?: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  status?: string;
}
