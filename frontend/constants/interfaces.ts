export interface OrderType {
  id: number;
  name: string;
  description?: string;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  contact: string;
  email: string;
  description?: string;
  createdById: number;
  user: {
    id: number;
    username: string;
    email: string;
    name: string;
    image: string;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  image: string;
  blocked: boolean;
  roleId: number;
  role: {
    id: number;
    name: string;
  };
}

export interface OrderDetail {
  id: string;
  name: string;
  price?: number;
  width: number;
  height: number;
  qty: number;
  design: number;
  eyelets: boolean;
  shiming: boolean;
  description?: string;
}

export interface Order {
  id: string;
  number: string;
  date: string;
  customer: string;
  description?: string;
  userId: number;
  OrderDetails: OrderDetail[];
  user: User;
}
