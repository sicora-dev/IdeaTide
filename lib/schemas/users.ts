import { z } from 'zod';
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserProfileInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  ChangePasswordInput,
  PublicUser
} from '../types/users';

// Schema base para usuarios
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('Email inválido'),
  full_name: z.string().nullable().optional(),
  image: z.string().url('URL de imagen inválida').nullable().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  last_sign_in_at: z.date().nullable().optional(),
  phone: z.string().nullable().optional(),
});

// Schema para crear usuario (sin fechas automáticas)
export const createUserSchema = userSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  last_sign_in_at: true,
});

// Schema para actualizar usuario (todo opcional excepto email)
export const updateUserSchema = userSchema.partial().required({ 
  email: true 
});

// Schema para perfil de usuario (formulario)
export const userProfileSchema = z.object({
  full_name: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Teléfono inválido').optional().or(z.literal('')),
  image: z.string().url('URL de imagen inválida').optional().or(z.literal('')),
});

// Schema para autenticación
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  full_name: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export const changePasswordSchema = z.object({
  current_password: z.string().min(6, 'Mínimo 6 caracteres'),
  new_password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirm_password: z.string().min(6, 'Mínimo 6 caracteres'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirm_password"],
});

// Helpers para validación
export const validateEmail = (email: string): boolean => {
  try {
    userSchema.shape.email.parse(email);
    return true;
  } catch {
    return false;
  }
};

export const validateUserProfile = (data: unknown): UserProfileInput => {
  return userProfileSchema.parse(data);
};

// Schema para respuestas de API (sin información sensible)
export const publicUserSchema = userSchema.pick({
  id: true,
  email: true,
  full_name: true,
  image: true,
  created_at: true,
});