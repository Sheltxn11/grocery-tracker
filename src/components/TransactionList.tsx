import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, CreditCard, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Transaction } from '@/types/expense';
import { GlassCard } from './GlassCard';

interface TransactionListProps {
  purchases: Transaction[];
  payments: Transaction[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short'
  }).format(new Date(date));
};

export const TransactionList = ({ purchases, payments }: TransactionListProps) => {
  // Combine and sort all transactions by date (newest first)
  const allTransactions = [...purchases, ...payments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (allTransactions.length === 0) {
    return (
      <GlassCard delay={0.4} hover={false} className="text-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.5 }}
          className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center"
        >
          <Calendar className="w-8 h-8 text-muted-foreground" />
        </motion.div>
        <p className="text-muted-foreground">No transactions this month</p>
        <p className="text-sm text-muted-foreground/60 mt-1">Add your first purchase or payment</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard delay={0.4} hover={false} className="p-0 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border/50">
        <h3 className="font-semibold font-display text-lg text-foreground">Recent Transactions</h3>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
        <AnimatePresence>
          {allTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "flex items-center justify-between p-4 md:px-6 border-b border-border/30 last:border-0",
                "hover:bg-muted/50 transition-colors"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2.5 rounded-xl",
                  transaction.type === 'purchase'
                    ? "bg-accent/15 text-accent"
                    : "bg-success/15 text-success"
                )}>
                  {transaction.type === 'purchase' ? (
                    <ShoppingCart className="w-4 h-4" />
                  ) : (
                    <CreditCard className="w-4 h-4" />
                  )}
                </div>
                
                <div>
                  <p className="font-medium text-foreground">
                    {transaction.description || (transaction.type === 'purchase' ? 'Purchase' : 'Payment')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>

              <span className={cn(
                "font-semibold font-display",
                transaction.type === 'purchase' ? "text-accent" : "text-success"
              )}>
                {transaction.type === 'purchase' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
};