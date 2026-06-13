interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

interface LoginDto {
  email: string;
  password: string;
}

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: string;
}

export type {
  RegisterDto,
  LoginDto,
  TokenPayload,
  AuthenticatedUser,
  UserResponseDto,
};
