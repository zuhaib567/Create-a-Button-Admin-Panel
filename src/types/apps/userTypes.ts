// Type Imports
import type { ThemeColor } from '@core/types';

export type UsersType = {
  id: number;
  role: string;
  email: string;
  status: string;
  avatar: string;
  company: string;
  country: string;
  contact: string;
  fullName: string;
  username: string;
  currentPlan: string;
  avatarColor?: ThemeColor;
  billing: string;
};

export interface IAdminUpdate {
  name?: string;
  image?: string;
  email?: string;
  phone?: string;
  country?: string;
  address?: string;
}

export interface IAdminUpdateRes {
  token: string;
  _id: string;
  name: string;
  image?: string;
  address?: string;
  country?: string;
  city?: string;
  email: string;
  phone?: string;
  status?: 'Active' | 'Inactive';
  password?: string;
  role: 'Admin' | 'Super Admin' | 'Manager' | 'CEO';
  joiningDate?: string;
}
