import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from './GlassCard';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning';
  delay?: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const StatCard = ({ title, value, icon: Icon, variant = 'default', delay = 0 }: StatCardProps) => {
  const iconStyles = {
    default: 'text-muted-foreground bg-muted',
    primary: 'text-primary bg-primary/15',
    accent: 'text-accent bg-accent/15',
    success: 'text-success bg-success/15',
    warning: 'text-warning bg-warning/15'
  };

  const valueStyles = {
    default: 'text-foreground',
    primary: 'text-primary',
    accent: 'text-accent',
    success: 'text-success',
    warning: 'text-warning'
  };

  return (
    <GlassCard delay={delay} className="relative overflow-hidden p-3 sm:p-5">
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: delay + 0.1, type: 'spring', stiffness: 200 }}
            className={cn("p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl", iconStyles[variant])}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.div>
        </div>
        
        <div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">{title}</p>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.2 }}
            className={cn("text-lg sm:text-2xl md:text-3xl font-bold font-display tracking-tight", valueStyles[variant])}
          >
            {formatCurrency(value)}
          </motion.p>
        </div>
      </div>
    </GlassCard>
  );
};