import { UserProfiles, UserTypes } from "@/domain/consts";

export interface UserEntity {
  id: string;
  userTypeId: UserTypes;
  name: string;
  phone: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  profile: {
    id: UserProfiles;
    name: string;
  };
}
