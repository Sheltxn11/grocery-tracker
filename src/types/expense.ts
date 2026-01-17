export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  description?: string;
  type: 'purchase' | 'payment';
}

export interface MonthData {
  month: string;
  daily_expenses: Transaction[];
  credits: Transaction[];
  total_expense: number;
  balance: number;
}

export interface YearData {
  year: number;
  months: MonthData[];
}
export interface ChartDataPoint {
  month: string;
  month_full: string;
  year: number;
  purchases: number;
  payments: number;
  balance: number;
}