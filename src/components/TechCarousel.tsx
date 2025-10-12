import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { techLogos } from '../data/tech-logos';

interface TechCarouselProps {
  categoryFilter?: string;
}

export const TechCarousel: React.FC<TechCarouselProps> = ({ categoryFilter }) => {
  const filteredLogos = categoryFilter 
    ? techLogos.filter(tech => tech.category === categoryFilter)
    : techLogos;

  const midPoint = Math.ceil(filteredLogos.length / 2);
  const firstRowLogos = filteredLogos.slice(0, midPoint);
  const secondRowLogos = filteredLogos.slice(midPoint);

  // Duplicate for seamless infinite scroll
  const firstRowDuplicates = [...firstRowLogos, ...firstRowLogos, ...firstRowLogos];
  const secondRowDuplicates = [...secondRowLogos, ...secondRowLogos, ...secondRowLogos];

  // First carousel - scrolling right with smooth auto-scroll
  const [emblaRefFirst] = useEmblaCarousel(
    { 
      loop: true,
      dragFree: true,
      containScroll: false,
    },
    [AutoScroll({ 
      speed: 1, 
      stopOnInteraction: false, 
      stopOnMouseEnter: false,
      startDelay: 0,
      playOnInit: true
    })]
  );

  // Second carousel - scrolling left with smooth auto-scroll
  const [emblaRefSecond] = useEmblaCarousel(
    { 
      loop: true,
      dragFree: true,
      containScroll: false,
      direction: 'rtl',
    },
    [AutoScroll({ 
      speed: 1, 
      stopOnInteraction: false, 
      stopOnMouseEnter: false,
      startDelay: 0,
      playOnInit: true
    })]
  );

  if (filteredLogos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-600">
          No tech logos configured yet. Add logos to <code className="bg-neutral-100 px-2 py-1 rounded">src/data/tech-logos.ts</code>
        </p>
      </div>
    );
  }

  const LogoItem = ({ tech, index, rowPrefix }: { tech: typeof filteredLogos[0], index: number, rowPrefix: string }) => (
    <div
      key={`${rowPrefix}-${tech.name}-${index}`}
      className="flex-shrink-0 flex flex-col items-center justify-center group"
      style={{ flexBasis: 'clamp(80px, 15vw, 140px)' }}
    >
      <a
        href={tech.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center
                 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300
                 border border-neutral-200 hover:border-neutral-300
                 group-hover:scale-110 group-hover:-translate-y-1"
        title={tech.name}
      >
        <img
          src={tech.imagePath}
          alt={tech.name}
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain
                   transition-all duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && !parent.querySelector('.fallback-text')) {
              const fallback = document.createElement('div');
              fallback.className = 'fallback-text text-2xl font-bold text-neutral-400';
              fallback.textContent = tech.name.charAt(0).toUpperCase();
              parent.appendChild(fallback);
            }
          }}
        />
      </a>
      <span className="mt-2 text-xs sm:text-sm font-medium text-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
        {tech.name}
      </span>
    </div>
  );

  return (
    <div className="relative max-w-7xl mx-auto py-1">
                                             
      <div className="space-y-2">
        {/* First Carousel - Scrolling Right */}
        <div className="overflow-hidden" ref={emblaRefFirst}>
          <div className="flex gap-4 sm:gap-5 md:gap-6 py-4 px-4 sm:px-5 md:px-6">
            {firstRowDuplicates.map((tech, index) => (
              <LogoItem key={`first-${tech.name}-${index}`} tech={tech} index={index} rowPrefix="first" />
            ))}
          </div>
        </div>

        {/* Second Carousel - Scrolling Left */}
        <div className="overflow-hidden" ref={emblaRefSecond} dir="rtl">
          <div className="flex gap-4 sm:gap-5 md:gap-6 py-4 px-4 sm:px-5 md:px-6">
            {secondRowDuplicates.map((tech, index) => (
              <div key={`second-${tech.name}-${index}`} dir="ltr">
                <LogoItem tech={tech} index={index} rowPrefix="second" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mt-6 text-xs text-neutral-500">
        <p>Two layers scrolling in opposite directions • Drag to control</p>
      </div>
    </div>
  );
};
