import { UserModel } from './user.model';

export interface UserResponseModel {
  user: UserModel;
  token: string;
}
