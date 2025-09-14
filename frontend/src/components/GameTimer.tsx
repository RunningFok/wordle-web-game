import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';



export const GameTimer: React.FC<{ timeLeft: number }> = ({ timeLeft }) => {
  const count = useMotionValue(timeLeft);
  const seconds = useTransform(count, (value) => {
    const secs = Math.floor(value);
    return secs.toString().padStart(2, '0');
  });
  const milliseconds = useTransform(count, (value) => {
    const ms = Math.floor((value % 1) * 100);
    return ms.toString().padStart(2, '0');
  });

  useEffect(() => {
    const controls = animate(count, timeLeft, { duration: 0.5, ease: "easeOut" });
    return () => controls.stop();
  }, [timeLeft, count]);

  return (
    <motion.div 
      className={`timer-value ${timeLeft <= 10 ? 'timer-warning' : ''}`}
      style={{
        fontSize: 30,
        color: timeLeft <= 10 ? "#FF6B6B" : "#8DF0CC",
        fontWeight: "bold",
        textShadow: timeLeft <= 10 ? "0 0 10px #FF6B6B" : "0 0 5px #8DF0CC",
        fontFamily: "monospace",
      }}
    >
      <motion.span>{seconds}</motion.span>:<motion.span>{milliseconds}</motion.span>
    </motion.div>
  );
};