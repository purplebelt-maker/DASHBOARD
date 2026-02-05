export interface IUser {
  id: string;
  email: string;
  name?: string;
}

export interface IAuthState {
  token?: string | null;
  isAuthenticated?: boolean | null;
  isRegistered?: boolean | null;
  loading?: boolean;
  user?: IUser | null;
  role?: "user" | "admin";
}

export interface ILoginFormData {
  email: string;
  password: string;
}

export interface IRegisterFormData {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword: string;
  
}
