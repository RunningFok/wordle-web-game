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

  const isWarning = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  return (
    <motion.div 
      className="timer-container"
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: '15px 25px',
        background: isCritical 
          ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(220, 38, 38, 0.15))'
          : isWarning 
          ? 'linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 152, 0, 0.15))'
          : 'linear-gradient(135deg, rgba(141, 240, 204, 0.2), rgba(72, 179, 175, 0.15))',
        border: isCritical 
          ? '2px solid rgba(255, 107, 107, 0.5)'
          : isWarning 
          ? '2px solid rgba(255, 193, 7, 0.5)'
          : '2px solid rgba(141, 240, 204, 0.5)',
        borderRadius: '16px',
        backdropFilter: 'blur(15px)',
        boxShadow: isCritical 
          ? '0 8px 32px rgba(255, 107, 107, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          : isWarning 
          ? '0 8px 32px rgba(255, 193, 7, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          : '0 8px 32px rgba(141, 240, 204, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }}
      animate={{
        scale: isCritical ? [1, 1.05, 1] : isWarning ? [1, 1.02, 1] : 1,
        rotate: isCritical ? [0, 1, -1, 0] : 0,
      }}
      transition={{
        duration: isCritical ? 0.5 : isWarning ? 1 : 0,
        repeat: isCritical ? Infinity : isWarning ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '16px',
          background: isCritical 
            ? 'radial-gradient(circle, rgba(255, 107, 107, 0.3) 0%, transparent 70%)'
            : isWarning 
            ? 'radial-gradient(circle, rgba(255, 193, 7, 0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(141, 240, 204, 0.1) 0%, transparent 70%)',
        }}
        animate={{
          opacity: isCritical ? [0.3, 0.8, 0.3] : isWarning ? [0.2, 0.5, 0.2] : [0.1, 0.3, 0.1],
          scale: isCritical ? [1, 1.1, 1] : isWarning ? [1, 1.05, 1] : [1, 1.02, 1],
        }}
        transition={{
          duration: isCritical ? 0.8 : isWarning ? 1.2 : 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="timer-value"
        style={{
          position: 'relative',
          zIndex: 2,
          fontSize: 36,
          color: isCritical ? "#FF6B6B" : isWarning ? "#FFC107" : "#8DF0CC",
          fontWeight: "900",
          textShadow: isCritical 
            ? "0 0 20px #FF6B6B, 0 0 40px #FF6B6B"
            : isWarning 
            ? "0 0 15px #FFC107, 0 0 30px #FFC107"
            : "0 0 10px #8DF0CC, 0 0 20px #8DF0CC",
          fontFamily: "monospace",
          letterSpacing: "2px",
          textAlign: 'center',
        }}
        animate={{
          textShadow: isCritical 
            ? ["0 0 20px #FF6B6B, 0 0 40px #FF6B6B", "0 0 30px #FF6B6B, 0 0 60px #FF6B6B", "0 0 20px #FF6B6B, 0 0 40px #FF6B6B"]
            : isWarning 
            ? ["0 0 15px #FFC107, 0 0 30px #FFC107", "0 0 25px #FFC107, 0 0 50px #FFC107", "0 0 15px #FFC107, 0 0 30px #FFC107"]
            : "0 0 10px #8DF0CC, 0 0 20px #8DF0CC",
        }}
        transition={{
          duration: isCritical ? 0.6 : isWarning ? 1 : 0,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.span
          animate={{
            scale: isCritical ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: isCritical ? 0.3 : 0,
            repeat: isCritical ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {seconds}
        </motion.span>
        <span style={{ margin: '0 4px' }}>:</span>
        <motion.span
          animate={{
            scale: isCritical ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: isCritical ? 0.3 : 0,
            repeat: isCritical ? Infinity : 0,
            ease: "easeInOut",
            delay: 0.15
          }}
        >
          {milliseconds}
        </motion.span>
      </motion.div>
    </motion.div>
  );
};