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
      <div className="max-w-7xl mx-auto px-4 md:px-6 items-center justify-center align-middle flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Avatar Section - Show first on mobile */}
        <motion.div
          className="order-1 md:order-2 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.4,
          }}
        >
          <div className="relative w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] lg:w-[350px] lg:h-[350px] overflow-hidden rounded-full border-4 border-primary">
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

        {/* Content Section */}
        <motion.div
          className="order-2 md:order-1 flex flex-col justify-center space-y-6 text-center md:text-left flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="space-y-4">
            <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl/none">
              Hi, I'm{" "}
              <span className="relative text-[#3b82f6]">
                <TypingEffect text="Kenneth" delay={100} />
              </span>
            </h1>
            <motion.p
              className="max-w-[600px] mx-auto md:mx-0 text-muted-foreground text-base sm:text-lg md:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              I'm drawn to creating things that solve random problems and bring ideas to life.
            </motion.p>
            <motion.p
              className="max-w-[600px] mx-auto md:mx-0 text-muted-foreground text-base sm:text-lg md:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              I have a plan to create projects, and this is where all my thoughts and projects will be on display – 
              everything from weekend experiments to things I'm actually proud of or not, we'll see.
            </motion.p>
          </div>

          {/* Call to Action */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm sm:text-base"
                    onClick={() => window.location.href = '/contact'}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Get In Touch
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Let's discuss your project ideas</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors duration-200 text-sm sm:text-base"
                    onClick={() => window.location.href = '/projects'}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Projects
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Check out my latest work</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export { HomeHeader };
