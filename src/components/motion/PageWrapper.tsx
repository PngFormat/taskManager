import { motion } from "framer-motion";

export default function PageWrapper({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50}}
            animate={{ opacity: 1, x: 0}}
            exit = {{ opacity: 0, x: -50}}
            transition={{ duration: 0.4, ease: "easeInOut"}}
            className="h-full w-full"
        >
            {children}
        </motion.div>
    )
}