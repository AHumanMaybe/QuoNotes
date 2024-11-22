import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import BlinkerAnim from "../components/BlinkerAnim"

function TypeAnim() {
  const textIndex = useMotionValue(0);
  const texts = [
    "Learning Made Quicker.",
    "Learning Made Easier.",
    "Learning Made Better."
  ];

  const staticPart = "Learning Made";
  const finalWords = texts.map(text => text.replace(staticPart, ""));

  const startText = useTransform(textIndex, (latest) => finalWords[latest] || "");
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) =>
    startText.get().slice(0, latest)
  );
  const updatedThisRound = useMotionValue(true);

  useEffect(() => {
    animate(count, 60, {
      type: "tween",
      duration: 1,
      ease: "easeIn",
      repeat: Infinity,
      repeatType: "reverse",
      repeatDelay: 0.1,
      onUpdate(latest) {
        if (updatedThisRound.get() === true && latest > 0) {
          updatedThisRound.set(false);
        } else if (updatedThisRound.get() === false && latest === 0) {
          if (textIndex.get() === finalWords.length - 1) {
            textIndex.set(0);
          } else {
            textIndex.set(textIndex.get() + 1);
          }
          updatedThisRound.set(true);
        }
      }
    });
  }, [count, textIndex, updatedThisRound, finalWords.length]);

  return (
    <div className="">
          <div className="inline-block md:flex md:justify-start md:items-center md:space-x-2">
            <span className="block md:inline text-6xl">
                {staticPart}
                <div className="flex flex-row">
                  <motion.span className="block md:inline text-6xl text-textcl">
                    {displayText}
                  </motion.span>
                  {/* <BlinkerAnim/> */}
                </div> 
                
                
            </span>
          </div>
      </div>
  );
}

export default TypeAnim;