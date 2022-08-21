export interface ReportData {
  balance: number;
  totalExpense: number;
  totalIncome: number;
  expenseCategories: { [key: string]: number };
  incomeCategories: { [key: string]: number };
}
