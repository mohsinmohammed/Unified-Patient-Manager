// Provider model with role and permissions
export interface Provider {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string; // "Doctor", "Nurse", etc.
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProviderData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions?: string[];
}

export interface ProviderLoginData {
  email: string;
  password: string;
}

export interface ProviderLoginResponse {
  token: string;
  provider: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}
