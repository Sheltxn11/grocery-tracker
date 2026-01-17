import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface AddTransactionButtonProps {
  onClick: () => void;
}

export const AddTransactionButton = ({ onClick }: AddTransactionButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary text-primary-foreground shadow-lg glow-primary flex items-center justify-center"
    >
      <Plus className="w-6 h-6 md:w-7 md:h-7" />
      
      {/* Subtle pulse ring */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-primary/25"
      />
    </motion.button>
  );
};