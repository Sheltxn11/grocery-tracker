import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, CreditCard, Calendar, FileText, IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Transaction } from '@/types/expense';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
}

export const TransactionModal = ({ isOpen, onClose, onSubmit }: TransactionModalProps) => {
  const [type, setType] = useState<'purchase' | 'payment'>('purchase');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date) return;

    onSubmit({
      type,
      amount: parseFloat(amount),
      date: new Date(date),
      description: description || undefined
    });

    // Reset form
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          />

          {/* Modal - Centered and mobile optimized */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="fixed inset-4 m-auto h-fit max-h-[calc(100vh-2rem)] overflow-auto z-50 w-[calc(100%-2rem)] max-w-md"
          >
            <div className="glass-card p-5 md:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg md:text-xl font-bold font-display text-foreground">Add Transaction</h2>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Transaction Type Toggle */}
                <div className="flex gap-3">
                  {[
                    { value: 'purchase' as const, label: 'Purchase', icon: ShoppingCart, variant: 'accent' },
                    { value: 'payment' as const, label: 'Payment', icon: CreditCard, variant: 'success' }
                  ].map(({ value, label, icon: Icon, variant }) => (
                    <motion.button
                      key={value}
                      type="button"
                      onClick={() => setType(value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-300 border",
                        type === value
                          ? variant === 'accent'
                            ? "bg-accent/15 border-accent/40 text-accent"
                            : "bg-success/15 border-success/40 text-success"
                          : "border-border bg-muted/50 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </motion.button>
                  ))}
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg font-medium text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Date Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground"
                  />
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Weekly groceries"
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={cn(
                    "w-full py-3.5 rounded-xl font-semibold text-base transition-all duration-300",
                    type === 'purchase'
                      ? "bg-accent text-accent-foreground glow-accent"
                      : "bg-success text-success-foreground glow-success"
                  )}
                >
                  Add {type === 'purchase' ? 'Purchase' : 'Payment'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};