import { motion } from "framer-motion";

interface LogoWatermarkProps {
  className?: string;
  opacity?: number;
}

export const LogoWatermark = ({ className = "", opacity = 0.03 }: LogoWatermarkProps) => {
  return (
    <div className={`fixed pointer-events-none inset-0 flex items-center justify-center z-0 ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="w-[120%] h-[120%] max-w-[1200px] blur-[2px]"
      >
        <img
          src="/logo.png"
          alt=""
          className="w-full h-full object-contain mix-blend-darken grayscale brightness-110"
        />
      </motion.div>
    </div>
  );
};
