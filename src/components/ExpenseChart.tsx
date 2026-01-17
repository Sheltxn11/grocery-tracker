import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { GlassCard } from './GlassCard';
import { ChartDataPoint } from '@/types/expense';

interface ExpenseChartProps {
  chartData: ChartDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0]?.payload;
    return (
      <div className="glass-card px-3 py-2 text-xs sm:text-sm">
        <p className="font-medium mb-1 text-foreground">
          {dataPoint?.month_full || label} {dataPoint?.year}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: ₹{entry.value.toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ExpenseChart = ({ chartData }: ExpenseChartProps) => {
  const formattedData = chartData.map(item => ({
    ...item,
    name: item.month,
    Purchases: item.purchases,
    Payments: item.payments,
    Balance: item.balance
  }));

  if (formattedData.length === 0) {
    return (
      <GlassCard delay={0.5} hover={false} className="h-[180px] sm:h-[220px] flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No data available</p>
      </GlassCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5"
    >
      {/* Area Chart - Balance Trend */}
      <GlassCard delay={0.5} hover={false} className="p-3 sm:p-5">
        <h3 className="font-semibold font-display text-sm sm:text-base mb-3 sm:mb-4 text-foreground">
          Balance Trend (Last 10 Months)
        </h3>
        <div className="h-[140px] sm:h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(200, 80%, 55%)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(200, 80%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 25%, 25%)" strokeOpacity={0.3} />
              <XAxis 
                dataKey="name" 
                stroke="hsl(220, 12%, 50%)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="hsl(220, 12%, 50%)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                width={45}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="Balance"
                stroke="hsl(200, 80%, 55%)"
                strokeWidth={2}
                fill="url(#balanceGradient)"
                dot={{ fill: 'hsl(200, 80%, 55%)', strokeWidth: 1, r: 2 }}
                activeDot={{ r: 4, fill: 'hsl(200, 80%, 55%)', stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Bar Chart - Purchases vs Payments */}
      <GlassCard delay={0.6} hover={false} className="p-3 sm:p-5">
        <h3 className="font-semibold font-display text-sm sm:text-base mb-3 sm:mb-4 text-foreground">
          Purchases vs Payments
        </h3>
        <div className="h-[140px] sm:h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} barGap={2} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="purchaseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(350, 70%, 60%)" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="hsl(350, 70%, 60%)" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="paymentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(155, 55%, 48%)" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="hsl(155, 55%, 48%)" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 25%, 25%)" strokeOpacity={0.3} />
              <XAxis 
                dataKey="name" 
                stroke="hsl(220, 12%, 50%)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="hsl(220, 12%, 50%)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                width={45}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="Purchases" 
                fill="url(#purchaseGradient)" 
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
              <Bar 
                dataKey="Payments" 
                fill="url(#paymentGradient)" 
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </motion.div>
  );
};