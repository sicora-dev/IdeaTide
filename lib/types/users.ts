export interface User {
  id: string;
  email: string;
  full_name?: string | null;
  image?: string | null;
  created_at?: Date;
  updated_at?: Date;
  last_sign_in_at?: Date | null;
  phone?: string | null;
}

export interface CreateUserInput {
  email: string;
  full_name?: string | null;
  image?: string | null;
  phone?: string | null;
}

export interface UpdateUserInput {
  email: string;
  full_name?: string | null;
  image?: string | null;
  phone?: string | null;
  updated_at?: Date;
  last_sign_in_at?: Date | null;
}

export interface UserProfileInput {
  full_name: string;
  phone?: string;
  image?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  full_name: string;
}

export interface ResetPasswordInput {
  email: string;
}

export interface ChangePasswordInput {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface PublicUser {
  id: string;
  email: string;
  full_name?: string | null;
  image?: string | null;
  created_at?: Date;
}