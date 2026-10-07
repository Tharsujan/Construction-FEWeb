export type ApiEnvelope<T> = {
  success: boolean;
  message: string | null;
  data: T;
};

export type AuthSession = {
  token: string;
  userId: string;
  name: string;
  email: string;
  role: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
};

export type CementProduct = {
  id: string;
  imageUrl: string;
  name: string;
  unitId: string;
  unitName: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
};

export type CementOrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type CementOrder = {
  id: string;
  clientId: string;
  clientName: string;
  projectId: string | null;
  projectName: string | null;
  deliveryAddress: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  items: CementOrderItem[];
};

export type Equipment = {
  id: string;
  name: string;
  code: string;
  dailyRate: number;
  status: string;
};

export type Rental = {
  id: string;
  clientId: string;
  clientName: string;
  equipmentId: string;
  equipmentName: string;
  projectId: string | null;
  projectName: string | null;
  startDate: string;
  expectedReturn: string;
  actualReturn: string | null;
  siteAddress: string;
  deposit: number;
  dailyRate: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

export type Project = {
  id: string;
  name: string;
  summary: string;
  description: string;
  location: string;
  status: string;
  startDate: string;
  endDate: string;
};

export type CartItem = {
  productId: string;
  name: string;
  imageUrl: string;
  unitName: string;
  price: number;
  stockQuantity: number;
  quantity: number;
};
