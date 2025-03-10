"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./button";
import * as Avatar from "@radix-ui/react-avatar";
import {
  // ChevronDown,
  Mail,
  FileText,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

// Typing effect component
interface TypingEffectProps {
  text: string;
  delay?: number;
}

const TypingEffect = ({ text, delay = 40 }: TypingEffectProps) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, delay, text]);

  return (
    <span
      className={`${
        isComplete
          ? "after:hidden"
          : "after:inline-block after:w-0.5 after:h-5 after:bg-[#4ECDC4] after:animate-blink"
      }`}
    >
      {displayText}
    </span>
  );
};

const HomeHeader: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="w-full py-8 md:py-8 lg:py-12 overflow-hidden bg-amber-100">
      <div className="px-4 md:px-6 items-center justify-center align-middle flex flex-col md:flex-row ">
        <motion.div
          className="flex flex-col justify-center space-y-6 "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
              Hi, I'm{" "}
              <span className="relative text-[#3b82f6]">
                <TypingEffect text="Kenneth" delay={100} />
              </span>
            </h1>
            <motion.p
              className="max-w-[600px] text-muted-foreground md:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              I'm a passionate developer/designer with expertise in creating
              beautiful and functional web experiences. I love solving complex
              problems and turning ideas into reality.
            </motion.p>
            <motion.p
              className="max-w-[600px] text-muted-foreground md:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Welcome to my portfolio where I showcase my projects and share my
              thoughts on technology, design, and more.
            </motion.p>
          </div>

          {/* <motion.div
              className="hidden md:flex items-center justify-center mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <a
                href="#projects"
                className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="text-sm mb-2">Scroll to see my work</span>
                <ChevronDown className="h-6 w-6 animate-bounce" />
              </a>
            </motion.div> */}
        </motion.div>

        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.4,
          }}
        >
          <div className="relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] lg:w-[350px] lg:h-[350px] overflow-hidden rounded-full border-4 border-primary">
            <motion.div
              className="absolute inset-0 bg-primary/10"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 4,
                ease: "easeInOut",
              }}
            />
            <Avatar.Root className="w-full h-full">
              <Avatar.Image
                src="/me.jpg"
                alt="Kenneth Harold Panis"
                className="w-full h-full object-cover"
              />
              {/* <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-gray-200">
                  KH
                </Avatar.Fallback> */}
            </Avatar.Root>

            {/* Decorative elements around the avatar */}
            <motion.div
              className="absolute -z-10 w-full h-full rounded-full border-4 border-dashed border-primary/30"
              animate={{ rotate: 360 }}
              transition={{
                duration: 40,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Mobile scroll indicator */}
      {/* <motion.div
        className="flex md:hidden items-center justify-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <a
          href="#projects"
          className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="text-sm mb-2">Scroll to see my work</span>
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </a>
      </motion.div> */}
    </div>
  );
};

export { HomeHeader };
