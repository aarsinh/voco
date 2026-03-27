export interface Project {
  _id: string;
  name: string;
  ngo: string;
  date: string;
  address: string;
  registrations?: number;
  ngoId?: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  status?: string;
}
