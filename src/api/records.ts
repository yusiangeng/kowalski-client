import { BASE_URL } from "./base";
import axios from "axios";
import {
  RecordData,
  RecordPostData,
  RecordPutData,
  RecordType,
  SortOrder,
} from "../types/records";
import { ApiResponse, CollectionApiResponse } from "../types/api";

const recordsApi = axios.create({
  baseURL: `${BASE_URL}/api/v1/records`,
});

export const getRecords = async (query: {
  sortBy?: keyof RecordData;
  order?: SortOrder;
  type?: RecordType;
}) => {
  const token = JSON.parse(localStorage.getItem("token") as string);

  const response = await recordsApi.get<CollectionApiResponse<RecordData>>(
    "/",
    {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        ...query,
      },
    }
  );

  return response.data;
};

export const addRecord = async (record: RecordPostData) => {
  const token = JSON.parse(localStorage.getItem("token") as string);

  const { data } = await recordsApi.post<ApiResponse<RecordData>>("/", record, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const updateRecord = async (record: RecordPutData) => {
  const token = JSON.parse(localStorage.getItem("token") as string);

  const { data } = await recordsApi.put<ApiResponse<RecordData>>(
    `/${record._id}`,
    record,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

export const deleteRecord = async (id: string) => {
  const token = JSON.parse(localStorage.getItem("token") as string);

  const { data } = await recordsApi.delete<ApiResponse<{}>>(`/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};
