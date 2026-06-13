import { apiClient } from "@/lib/axios";
import type { AuthTokens, LoginRequest, RegisterRequest, User } from "@/types";

/** Exchange credentials for a JWT token pair */
export async function login(
  data: LoginRequest
): Promise<AuthTokens> {
  const res = await apiClient.post<AuthTokens>(
    "/auth/login",
    {
      email: data.email,
      password: data.password,
    }
  );

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
