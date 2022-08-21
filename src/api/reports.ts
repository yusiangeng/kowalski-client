import axios from "axios";
import { ReportData } from "../types/reports";
import { BASE_URL } from "./base";

const reportsApi = axios.create({
  baseURL: `${BASE_URL}/api/v1/report`,
});

export const getReport = async () => {
  const token = JSON.parse(localStorage.getItem("token") as string);

  const response = await reportsApi.get<ReportData>("/", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};
