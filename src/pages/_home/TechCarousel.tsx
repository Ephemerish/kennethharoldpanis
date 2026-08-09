import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { technologies, techSlug } from '@/data/technologies';

interface TechCarouselProps {
  categoryFilter?: string;
}

export const TechCarousel: React.FC<TechCarouselProps> = ({ categoryFilter }) => {
  const filteredLogos = categoryFilter 
    ? technologies.filter(tech => tech.category === categoryFilter)
    : technologies;

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
          No tech logos configured yet. Add logos to <code className="bg-neutral-100 px-2 py-1">src/data/technologies.ts</code>
        </p>
      </div>
    );
  }

  const LogoItem = ({ tech, index, rowPrefix }: { tech: typeof filteredLogos[0], index: number, rowPrefix: string }) => (
    <div
      key={`${rowPrefix}-${tech.name}-${index}`}
      className="flex-shrink-0 flex flex-col items-center group"
      style={{ flexBasis: 'clamp(80px, 15vw, 140px)' }}
    >
      <a
        href={`/tech/${techSlug(tech.name)}`}
        className="relative w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center
                 bg-white shadow-md hover:shadow-xl transition-all duration-300
                 border border-neutral-200 hover:border-neutral-300
                 group-hover:scale-110 group-hover:-translate-y-1"
        title={`See where I've used ${tech.name}`}
      >
        <img
          src={tech.imagePath}
          alt={tech.name}
          className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain
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
      <span className="mt-2 text-xs sm:text-sm font-medium text-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center max-w-[80px] sm:max-w-[100px] md:max-w-[120px] truncate px-1">
        {tech.name}
      </span>
    </div>
  );

  return (
    <div className="relative max-w-7xl mx-auto py-1">
                                             
      <div className="space-y-1 sm:space-y-2">
        {/* First Carousel - Scrolling Right */}
        <div className="overflow-hidden" ref={emblaRefFirst}>
          <div className="flex gap-2 sm:gap-4 md:gap-5 lg:gap-6 py-2 px-2 sm:py-4 sm:px-4 md:px-5 lg:px-6">
            {firstRowDuplicates.map((tech, index) => (
              <div key={`first-${tech.name}-${index}`}>
                <LogoItem tech={tech} index={index} rowPrefix="first" />
              </div>
            ))}
          </div>
        </div>

        {/* Second Carousel - Scrolling Left */}
        <div className="overflow-hidden" ref={emblaRefSecond} dir="rtl">
          <div className="flex gap-2 sm:gap-4 md:gap-5 lg:gap-6 py-2 px-2 sm:py-4 sm:px-4 md:px-5 lg:px-6">
            {secondRowDuplicates.map((tech, index) => (
              <div key={`second-${tech.name}-${index}`} dir="ltr">
                <LogoItem tech={tech} index={index} rowPrefix="second" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
