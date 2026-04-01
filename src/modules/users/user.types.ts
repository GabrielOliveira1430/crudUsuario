/**
 * DTO para criação de usuário
 */
export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN'; // opcional (não confiar no client)
}

/**
 * DTO para login
 */
export interface LoginDTO {
  email: string;
  password: string;
}