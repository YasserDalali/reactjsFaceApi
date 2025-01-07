import { motion } from 'framer-motion';

const AnimatedTableRow = ({ children, index }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05, // Shorter delay for tables with many rows
        ease: [0.4, 0, 0.2, 1]
      }}
      className="bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-200"
    >
      {children}
    </motion.tr>
  );
};

export default AnimatedTableRow; 