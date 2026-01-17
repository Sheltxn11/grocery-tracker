import { useState, useCallback, useEffect } from 'react';
import { Transaction, MonthData, ChartDataPoint } from '@/types/expense';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Backend API URL - update this to your deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

// Transform backend response to frontend format
const transformBackendData = (backendData: any[]): MonthData[] => {
  return backendData.map(monthDoc => {
    const dailyExpenses: Transaction[] = monthDoc.daily_expenses.map((expense: any, idx: number) => ({
      id: `${monthDoc._id}-exp-${idx}`,
      type: 'purchase' as const,
      amount: expense.amount,
      date: new Date(expense.date),
      description: expense.description
    }));

    const credits: Transaction[] = monthDoc.credits.map((credit: any, idx: number) => ({
      id: `${monthDoc._id}-pay-${idx}`,
      type: 'payment' as const,
      amount: credit.amount,
      date: new Date(credit.date),
      description: credit.description
    }));

    return {
      month: monthDoc.month,
      daily_expenses: dailyExpenses,
      credits: credits,
      total_expense: monthDoc.total_expense,
      balance: monthDoc.balance
    };
  });
};

export const useExpenseStore = () => {
  const [data, setData] = useState<Record<number, MonthData[]>>({});
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([new Date().getFullYear()]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch chart data (last 10 months across years)
  const fetchChartData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chart-data?months=10`);
      if (response.ok) {
        const data = await response.json();
        setChartData(data);
      }
    } catch (err) {
      console.error('Error fetching chart data:', err);
    }
  }, []);

  // Fetch available years from backend
  const fetchAvailableYears = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/available-years`);
      if (response.ok) {
        const years = await response.json();
        setAvailableYears(years);
      }
    } catch (err) {
      console.error('Error fetching available years:', err);
      // Fallback to current year
      const currentYear = new Date().getFullYear();
      setAvailableYears([currentYear, currentYear + 1]);
    }
  }, []);

  // Fetch available years and chart data on mount
  useEffect(() => {
    fetchAvailableYears();
    fetchChartData();
  }, [fetchAvailableYears, fetchChartData]);

  // Fetch data for a specific year from backend
  const fetchYearData = useCallback(async (year: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/monthly-data?year=${year}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      
      const backendData = await response.json();
      const transformedData = transformBackendData(backendData);
      
      setData(prev => ({
        ...prev,
        [year]: transformedData
      }));
    } catch (err) {
      console.error('Error fetching year data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      // Initialize with empty data on error
      setData(prev => ({
        ...prev,
        [year]: []
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data when year changes
  useEffect(() => {
    if (!data[selectedYear]) {
      fetchYearData(selectedYear);
    }
  }, [selectedYear, data, fetchYearData]);

  // Dynamic year range: return years from backend
  const getAvailableYears = useCallback(() => {
    return availableYears;
  }, [availableYears]);

  const getCurrentMonthData = useCallback((): MonthData | undefined => {
    return data[selectedYear]?.find(m => m.month === selectedMonth);
  }, [data, selectedYear, selectedMonth]);

  // Fetch previous month's total paid from backend
  const [prevMonthPaid, setPrevMonthPaid] = useState<number>(0);
  
  const fetchPrevMonthPaid = useCallback(async (month: string, year: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/prev-month-paid?month=${month}&year=${year}`);
      if (response.ok) {
        const data = await response.json();
        setPrevMonthPaid(data.prev_month_paid || 0);
      }
    } catch (err) {
      console.error('Error fetching prev month paid:', err);
      setPrevMonthPaid(0);
    }
  }, []);

  // Fetch prev month paid when month/year changes
  useEffect(() => {
    fetchPrevMonthPaid(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear, fetchPrevMonthPaid]);

  const getPrevMonthPaid = useCallback((): number => {
    return prevMonthPaid;
  }, [prevMonthPaid]);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    try {
      setLoading(true);
      setError(null);

      // Format date as YYYY-MM-DD
      const dateStr = transaction.date instanceof Date 
        ? transaction.date.toISOString().split('T')[0]
        : transaction.date;

      const payload = {
        date: dateStr,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description || ''
      };

      const response = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add transaction');
      }

      const result = await response.json();
      console.log('Transaction added:', result.message);

      // Extract year from the transaction date
      const transactionYear = new Date(transaction.date).getFullYear();
      
      // Refetch the year data and chart data
      await fetchYearData(transactionYear);
      await fetchChartData();
      
      // If the transaction was for a different year, switch to that year
      if (transactionYear !== selectedYear) {
        setSelectedYear(transactionYear);
      }
      
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError(err instanceof Error ? err.message : 'Failed to add transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedYear, fetchYearData, fetchChartData]);

  const getYearlyData = useCallback(() => {
    return data[selectedYear] || [];
  }, [data, selectedYear]);

  const getChartData = useCallback(() => {
    return chartData;
  }, [chartData]);

  return {
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    getCurrentMonthData,
    getPrevMonthPaid,
    addTransaction,
    getYearlyData,
    getChartData,
    getAvailableYears,
    months: MONTHS,
    loading,
    error,
    refetchYear: fetchYearData
  };
};