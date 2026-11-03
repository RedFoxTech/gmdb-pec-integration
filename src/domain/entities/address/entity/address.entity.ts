export interface AddressEntity {
  id: string;
  zipCode: string;
  address: string;
  address2: string;
  number: string;
  city: string;
  state: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}
