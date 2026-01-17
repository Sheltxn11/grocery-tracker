import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, CreditCard, History, ShoppingBag } from 'lucide-react';
import { useExpenseStore } from '@/hooks/useExpenseStore';
import { StatCard } from '@/components/StatCard';
import { MonthYearSelector } from '@/components/MonthYearSelector';
import { TransactionModal } from '@/components/TransactionModal';
import { TransactionList } from '@/components/TransactionList';
import { ExpenseChart } from '@/components/ExpenseChart';
import { AddTransactionButton } from '@/components/AddTransactionButton';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const {
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    getCurrentMonthData,
    getPrevMonthPaid,
    addTransaction,
    getChartData,
    getAvailableYears,
    months,
    loading,
    error
  } = useExpenseStore();

  const currentData = getCurrentMonthData();
  const prevMonthPaid = getPrevMonthPaid();
  const chartData = getChartData();

  const totalPurchases = currentData?.total_expense || 0;
  const totalPayments = currentData?.credits.reduce((sum, c) => sum + c.amount, 0) || 0;
  const currentBalance = currentData?.balance || 0;

  // Show error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass-card p-6 md:p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-destructive/15 flex items-center justify-center">
            <Wallet className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">
            Make sure your backend server is running on{' '}
            <code className="bg-muted px-2 py-1 rounded">http://localhost:10000</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects - soft light orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating-orb w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/30 -top-32 -right-32 animate-float" />
        <div className="floating-orb w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-accent/25 -bottom-24 -left-24 animate-float" style={{ animationDelay: '-4s' }} />
        <div className="floating-orb w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-success/20 top-1/3 right-1/4 animate-float" style={{ animationDelay: '-2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-10 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 sm:mb-8 md:mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
            <div className="flex items-center justify-between sm:block">
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
                  className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-primary/15"
                >
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </motion.div>
                <div>
                  <h1 className="text-xl sm:text-3xl md:text-4xl font-bold font-display gradient-text">
                    Grocery Tracker
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                    Built with ❤️ by Shelton
                  </p>
                </div>
              </div>
              
              {/* Mobile month selector */}
              <div className="sm:hidden">
                <MonthYearSelector
                  selectedYear={selectedYear}
                  selectedMonth={selectedMonth}
                  onYearChange={setSelectedYear}
                  onMonthChange={setSelectedMonth}
                  availableYears={getAvailableYears()}
                  months={months}
                />
              </div>
            </div>

            {/* Desktop month selector */}
            <div className="hidden sm:block">
              <MonthYearSelector
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                onYearChange={setSelectedYear}
                onMonthChange={setSelectedMonth}
                availableYears={getAvailableYears()}
              months={months}
            />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-5 mb-4 sm:mb-8 md:mb-10">
          <StatCard
            title="Current Due"
            value={currentBalance}
            icon={Wallet}
            variant={currentBalance > 0 ? 'warning' : 'success'}
            delay={0.1}
          />
          <StatCard
            title="Total Spent"
            value={totalPurchases}
            icon={TrendingUp}
            variant="accent"
            delay={0.15}
          />
          <StatCard
            title="Total Paid"
            value={totalPayments}
            icon={CreditCard}
            variant="success"
            delay={0.2}
          />
          <StatCard
            title="Prev Month Paid"
            value={prevMonthPaid}
            icon={History}
            variant="default"
            delay={0.25}
          />
        </div>

        {/* Charts */}
        <div className="mb-4 sm:mb-8 md:mb-10">
          <ExpenseChart chartData={chartData} />
        </div>

        {/* Transaction List */}
        <TransactionList
          purchases={currentData?.daily_expenses || []}
          payments={currentData?.credits || []}
        />
      </div>

      {/* FAB */}
      <AddTransactionButton onClick={() => setIsModalOpen(true)} />

      {/* Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addTransaction}
      />
    </div>
  );
};

export default Index;