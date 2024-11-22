import { motion } from "framer-motion";

function BlinkerAnim(){
    const cursorVariants = {
        blinking: {
          opacity: [0, 0, 1, 1],
          transition: {
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0,
            ease: "linear",
            times: [0, 0.5, 0.5, 1]
          }
        }
      };
      return (
        <motion.div
          variants={cursorVariants}
          animate="blinking"
          className="w-1 h-10 md:h-16 bg-bgd"
        />
      );
}

export default BlinkerAnim