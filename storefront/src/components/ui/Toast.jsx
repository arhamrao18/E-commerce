import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useStore } from "../../context/StoreContext";

export default function Toast() {
  const { toast } = useStore();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto flex items-center gap-2.5 rounded-full glass-dark px-5 py-3 text-sm text-porcelain shadow-glass-lg"
          >
            <CheckCircle2 size={16} className="text-emerald-400" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
