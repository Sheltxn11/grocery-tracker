import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

interface MonthYearSelectorProps {
  selectedYear: number;
  selectedMonth: string;
  onYearChange: (year: number) => void;
  onMonthChange: (month: string) => void;
  availableYears: number[];
  months: string[];
}

export const MonthYearSelector = ({
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
  availableYears,
  months
}: MonthYearSelectorProps) => {
  const [isYearOpen, setIsYearOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentMonthIndex = months.indexOf(selectedMonth);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsYearOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      const prevYearIndex = availableYears.indexOf(selectedYear) - 1;
      if (prevYearIndex >= 0) {
        onYearChange(availableYears[prevYearIndex]);
        onMonthChange(months[11]);
      }
    } else {
      onMonthChange(months[currentMonthIndex - 1]);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      const nextYearIndex = availableYears.indexOf(selectedYear) + 1;
      if (nextYearIndex < availableYears.length) {
        onYearChange(availableYears[nextYearIndex]);
        onMonthChange(months[0]);
      }
    } else {
      onMonthChange(months[currentMonthIndex + 1]);
    }
  };

  const handleYearSelect = (year: number) => {
    onYearChange(year);
    setIsYearOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
    >
      {/* Year Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <motion.button
          onClick={() => setIsYearOpen(!isYearOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl glass-card text-foreground font-medium text-sm sm:text-base"
        >
          {selectedYear}
          <ChevronDown className={cn(
            "w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground transition-transform duration-200",
            isYearOpen && "rotate-180"
          )} />
        </motion.button>

        <AnimatePresence>
          {isYearOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 left-0 z-50 min-w-[80px] sm:min-w-[100px] glass-card py-2 shadow-lg"
            >
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className={cn(
                    "w-full px-3 sm:px-4 py-1.5 sm:py-2 text-left text-xs sm:text-sm font-medium transition-colors",
                    selectedYear === year
                      ? "bg-primary/15 text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {year}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Month Navigator */}
      <div className="flex items-center glass-card px-1.5 sm:px-3 py-1.5 sm:py-2">
        <motion.button
          onClick={handlePrevMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1 sm:p-1.5 rounded-md sm:rounded-lg hover:bg-muted transition-colors flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
        </motion.button>

        <div className="flex items-center justify-center w-[50px] sm:w-[100px]">
          <AnimatePresence mode="wait">
            <motion.span
              key={selectedMonth}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="font-medium font-display text-foreground text-sm sm:text-base text-center"
            >
              {selectedMonth.substring(0, 3)}
            </motion.span>
          </AnimatePresence>
        </div>

        <motion.button
          onClick={handleNextMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1 sm:p-1.5 rounded-md sm:rounded-lg hover:bg-muted transition-colors flex-shrink-0"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
        </motion.button>
      </div>
    </motion.div>
  );
};