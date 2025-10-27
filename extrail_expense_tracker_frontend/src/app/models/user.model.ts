import { RolesModel } from './roles.model';

export interface UserModel {
  userId?: number;
  userName: string;
  email: string;
  phone: string;
  roles: RolesModel[];
  deactivated: boolean; // maps to isDeactivated
  createdAt?: string; // ISO date string
}

// Shape useful when creating a user via /users/add-user (requires password)

export interface UserCreateModel extends Omit<UserModel, 'userId' | 'createdAt'> {
  passwordHash: string;
}
