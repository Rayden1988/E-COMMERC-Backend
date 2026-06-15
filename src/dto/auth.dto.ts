// DTOs de entrada e saida para autenticacao.
export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface TokenPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: string;
}
