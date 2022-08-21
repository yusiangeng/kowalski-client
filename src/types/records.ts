export interface RecordPostData {
  amount: number;
  type: string;
  category: string;
  description?: string;
  date: string;
}

export interface RecordPutData extends RecordPostData {
  _id: string;
}

export interface RecordData extends RecordPutData {
  userId: string;
}

export enum RecordType {
  ALL = "",
  INCOME = "Income",
  EXPENSE = "Expense",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}
