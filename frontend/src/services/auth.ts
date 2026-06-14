import { apiClient } from "@/lib/axios";
import type {
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  User,
  UserRole,
  CreateUserRequest,
} from "@/types";

/** Exchange credentials for a JWT token pair */
export async function login(data: LoginRequest): Promise<AuthTokens> {
  const res = await apiClient.post<AuthTokens>("/auth/login", {
    email: data.email,
    password: data.password,
  });

  return res.data;
}

/** Create a new user account */
export async function register(data: RegisterRequest): Promise<User> {
  const res = await apiClient.post<User>("/auth/register", data);
  return res.data;
}

/** Fetch the currently authenticated user's profile */
export async function getMe(): Promise<User> {
  const res = await apiClient.get<User>("/auth/me");
  return res.data;
}

export async function getUsers() {
  const response = await apiClient.get<User[]>("/auth/users");

  return response.data;
}

export async function createUser(payload: CreateUserRequest) {
  const response = await apiClient.post(
    "/auth/register",

    payload,
  );

  return response.data;
}

export async function updateUserRole(
  userId: number,

  role: UserRole,
) {
  const response = await apiClient.put(
    `/auth/users/${userId}/role`,

    null,

    {
      params: { role },
    },
  );

  return response.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get<User>("/auth/me");

  return response.data;
}

export async function deleteUser(id: number) {
  await apiClient.delete(`/auth/users/${id}`);
}
