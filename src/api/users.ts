import axios from "axios";
import { ApiResponse } from "../types/api";
import { IUser, UserCredentials } from "../types/users";
import { BASE_URL } from "./base";

const usersApi = axios.create({
  baseURL: `${BASE_URL}/api/v1/users`,
});

interface TokenResponse {
  token: string;
}

export const apiLogin = async (values: UserCredentials) => {
  const response = await usersApi.post<ApiResponse<TokenResponse>>(
    "/login",
    values
  );

  return response.data;
};

export const apiRegister = async (values: UserCredentials) => {
  const response = await usersApi.post<ApiResponse<TokenResponse>>(
    "/register",
    values
  );

  return response.data;
};

export const getCurrentUser = async () => {
  const token = JSON.parse(localStorage.getItem("token") as string);

  const response = await usersApi.get<ApiResponse<IUser>>("/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.data;
};
