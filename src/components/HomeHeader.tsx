import { Button } from "./button";
import { EnvelopeIcon, FileTextIcon as DocumentTextIcon } from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const HomeHeader: React.FC = () => {
  return (
    <div className="w-full py-6 md:py-8 lg:py-10 overflow-hidden bg-white relative">
      <div className="absolute inset-0">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="bg-hero-gradient border-l border-r border-neutral-200 h-full"></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="items-center justify-center align-middle flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Avatar Section - Show first on mobile */}
            <div className="order-1 md:order-2 flex items-center justify-center">
              <div className="relative w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] lg:w-[350px] lg:h-[350px] overflow-hidden border-4 border-brand-600">
                <div className="w-full h-full overflow-hidden">
                  <img
                    src="/images/me/me.jpg"
                    alt="Kenneth Harold Panis"
                    className="w-full h-full object-cover"
                    loading="eager"
                    width="240"
                    height="240"
                    decoding="async"
                    fetchPriority="high"
                  />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="order-2 md:order-1 flex flex-col justify-center space-y-6 text-center md:text-left flex-1">
              <div className="space-y-4">
                <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl/none">
                  Hi, I'm <span className="text-brand-600">Kenneth</span>
                </h1>
                <p className="max-w-[600px] mx-auto md:mx-0 text-neutral-600 text-base sm:text-lg md:text-xl">
                  I'm drawn to creating things that solve random problems and bring ideas to life.
                </p>
                <p className="max-w-[600px] mx-auto md:mx-0 text-neutral-600 text-base sm:text-lg md:text-xl">
                  I have a plan to create projects, and this is where all my thoughts and projects will be on display –
                  everything from weekend experiments to things I'm actually proud of or not, we'll see.
                </p>
              </div>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-brand-600 hover:bg-brand-700 text-neutral-0 text-sm sm:text-base"
                        onClick={() => window.location.href = '/contact'}
                      >
                        <EnvelopeIcon className="mr-2 h-4 w-4" />
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
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border-2 border-neutral-300 text-neutral-900 hover:bg-neutral-100 hover:text-neutral-900 text-sm sm:text-base"
                        onClick={() => window.location.href = '/projects'}
                      >
                        <DocumentTextIcon className="mr-2 h-4 w-4" />
                        View Projects
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Check out my latest work</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { HomeHeader };
