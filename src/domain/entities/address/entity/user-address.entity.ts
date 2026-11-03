import { AddressEntity } from "./address.entity";

export interface UserAddressEntity extends AddressEntity {
  userId: string;
}
