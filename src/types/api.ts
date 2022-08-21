export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface CollectionApiResponse<T> {
  count: number;
  // pagination: any;
  data: T[];
}
