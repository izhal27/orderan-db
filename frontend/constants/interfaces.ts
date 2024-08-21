export interface OrderType {
  id: number;
  name: string;
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  contact: string;
  email: string;
  description: string;
  createdById: number;
  user: {
    id: number;
    username: string;
    email: string;
    name: string;
    image: string;
  }
}

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  image: string;
  blocked: boolean;
  roleId: number;
  role: {
    id: number,
    name: string,
  }
}
