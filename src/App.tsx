import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, ArrowCounterClockwise } from "@phosphor-icons/react";

function App() {
  // Timer states
  const [minutes, setMinutes] = React.useState<number>(25);
  const [seconds, setSeconds] = React.useState<number>(0);
  const [isActive, setIsActive] = React.useState<boolean>(false);
  const [mode, setMode] = React.useState<"focus" | "shortBreak" | "longBreak">(
    "focus"
  );

  // Timer durations (in minutes)
  const TIMER_MODES = {
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  };

  // Add this right after your TIMER_MODES constant
  const [backgroundDimensions, setBackgroundDimensions] = React.useState({
    width: 0,
    left: 0,
  });

  const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  // Add this effect to handle background animation
  React.useEffect(() => {
    const modes = ["focus", "shortBreak", "longBreak"];
    const activeIndex = modes.indexOf(mode);
    const activeElement = buttonRefs.current[activeIndex];

    if (activeElement) {
      const data = activeElement.getBoundingClientRect();
      const left = activeElement.offsetLeft;

      setBackgroundDimensions({
        width: data.width,
        left,
      });
    }
  }, [mode]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            setMinutes(TIMER_MODES[mode]);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const switchMode = (newMode: "focus" | "shortBreak" | "longBreak") => {
    setIsActive(false);
    setMode(newMode);
    setMinutes(TIMER_MODES[newMode]);
    setSeconds(0);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(TIMER_MODES[mode]);
    setSeconds(0);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white relative overflow-hidden p-6">
      {/* Simplified gradient background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.02, 0.04, 0.02],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 blur-[120px]"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.05), transparent 70%)
          `,
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-xl w-full"
      >
        <motion.div variants={itemVariants} className="text-center mb-10">
          <h1 className="text-5xl font-light text-neutral-900 mb-4 tracking-tight">
            Focus Chad
          </h1>
          <p className="text-neutral-500 text-base">
            Maintain focus. Take breaks. Stay productive.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white p-12 rounded-none border border-neutral-200"
        >
          {/* Mode Selection */}
          <div className="flex justify-center items-center w-full relative mb-16">
            <div className="flex items-center relative">
              <motion.div
                className="absolute bg-neutral-900 rounded-none"
                initial={false}
                animate={{
                  width: backgroundDimensions.width,
                  x: backgroundDimensions.left,
                  height: "100%",
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />

              {["focus", "shortBreak", "longBreak"].map((timerMode, index) => (
                <motion.button
                  key={timerMode}
                  ref={(el) => {
                    buttonRefs.current[index] = el;
                  }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: { duration: 0.1 },
                  }}
                  onClick={() =>
                    switchMode(
                      timerMode as "focus" | "shortBreak" | "longBreak"
                    )
                  }
                  className={`px-10 py-2 text-sm font-normal relative z-10 flex items-center gap-2 ${
                    mode === timerMode
                      ? "text-white"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {timerMode === "focus" ? (
                    <span>Focus</span>
                  ) : timerMode === "shortBreak" ? (
                    <span>Short Break</span>
                  ) : (
                    <span>Long Break</span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Timer Display */}
          <div className="text-[140px] font-light text-neutral-900 text-center mb-16 tabular-nums tracking-tight flex justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={Math.floor(minutes / 10)}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
              >
                {Math.floor(minutes / 10)}
              </motion.span>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.span
                key={minutes % 10}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
              >
                {minutes % 10}
              </motion.span>
            </AnimatePresence>
            <span className="text-neutral-900 mx-4">:</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={Math.floor(seconds / 10)}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
              >
                {Math.floor(seconds / 10)}
              </motion.span>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.span
                key={seconds % 10}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
              >
                {seconds % 10}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Control Buttons */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 gap-6"
          >
            <div className="relative">
              <AnimatePresence mode="wait" initial={false}>
                {isActive ? (
                  <motion.button
                    key="pause"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    whileHover={{
                      scale: 1.015,
                      backgroundColor: "#991b1b",
                      transition: {
                        duration: 0.2,
                        ease: "easeOut",
                      },
                    }}
                    whileTap={{ scale: 0.985 }}
                    onClick={toggleTimer}
                    className="w-full bg-red-800 text-white px-8 py-4 rounded-none font-normal text-base flex items-center justify-center gap-2"
                  >
                    <Pause size={20} weight="light" />
                    <span>Pause</span>
                  </motion.button>
                ) : (
                  <motion.button
                    key="start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    whileHover={{
                      scale: 1.015,
                      backgroundColor: "#282828",
                      transition: {
                        duration: 0.2,
                        ease: "easeOut",
                      },
                    }}
                    whileTap={{ scale: 0.985 }}
                    onClick={toggleTimer}
                    className="w-full bg-neutral-900 text-white px-8 py-4 rounded-none font-normal text-base flex items-center justify-center gap-2"
                  >
                    <Play size={20} weight="light" />
                    <span>Start</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{
                scale: 1.015,
                backgroundColor: "#f0f0f0",
                transition: {
                  duration: 0.2,
                  ease: "easeOut",
                  backgroundColor: {
                    duration: 0.2,
                    ease: "easeOut",
                  },
                  scale: {
                    duration: 0.15,
                    ease: "easeOut",
                  },
                },
              }}
              whileTap={{ scale: 0.985 }}
              onClick={resetTimer}
              className="w-full bg-white text-neutral-900 px-8 py-4 rounded-none font-normal text-base border border-neutral-200 flex items-center justify-center gap-2"
            >
              <ArrowCounterClockwise size={20} weight="light" />
              <span>Reset</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;
