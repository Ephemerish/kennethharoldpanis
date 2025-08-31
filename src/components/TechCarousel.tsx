import React, { useState, useEffect } from 'react';
import type { TechCategory } from '../utils/tagCategorizer';

interface TechCarouselProps {
  categories: TechCategory[];
}

export const TechCarousel: React.FC<TechCarouselProps> = ({ categories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying || categories.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === categories.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000); // Change slide every 6 seconds (slower for smoother experience)

    return () => clearInterval(interval);
  }, [isAutoPlaying, categories.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false); // Pause auto-play when user interacts
    
    // Resume auto-play after 8 seconds
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const nextSlide = () => {
    const newIndex = currentIndex === categories.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };

  const prevSlide = () => {
    const newIndex = currentIndex === 0 ? categories.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  if (categories.length === 0) return null;

  // Helper function to get the visible categories (prev, current, next)
  const getVisibleCategories = () => {
    const prevIndex = currentIndex === 0 ? categories.length - 1 : currentIndex - 1;
    const nextIndex = currentIndex === categories.length - 1 ? 0 : currentIndex + 1;
    
    return [
      { category: categories[prevIndex], position: 'prev', index: prevIndex },
      { category: categories[currentIndex], position: 'current', index: currentIndex },
      { category: categories[nextIndex], position: 'next', index: nextIndex }
    ];
  };

  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Main carousel container */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="flex items-center justify-center py-4 sm:py-6 lg:py-8">
          {getVisibleCategories().map(({ category, position, index }) => (
            <div
              key={`${category.title}-${index}`}
              className={`
                transition-all duration-700 ease-out cursor-pointer
                ${position === 'current' 
                  ? 'opacity-100 scale-100 z-10 mx-4 sm:mx-6' 
                  : 'opacity-50 scale-95 z-0 mx-2 sm:mx-4 hover:opacity-70'
                }
                ${position === 'prev' ? '-ml-4 sm:-ml-8' : ''}
                ${position === 'next' ? '-mr-4 sm:-mr-8' : ''}
                w-80 sm:w-96 flex-shrink-0
              `}
              onClick={() => position !== 'current' && goToSlide(index)}
            >
                            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 h-80 sm:h-96 border border-gray-300 transition-shadow duration-700 ease-out hover:shadow-xl flex flex-col">
                <div className="text-center flex-1 flex flex-col">
                  {/* Icon and title container */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3 transition-transform duration-700 ease-out">{category.icon}</div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-1.5 sm:mb-2 transition-all duration-700 ease-out">
                      {category.name}
                    </h3>
                    <div className="w-12 sm:w-16 lg:w-20 h-0.5 sm:h-1 bg-black rounded-full mx-auto transition-all duration-700 ease-out"></div>
                  </div>
                  
                  {/* Skills grid - flexible to fill remaining space */}
                  <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 transition-all duration-700 ease-out flex-1 content-start">
                    {category.skills.slice(0, position === 'current' ? 8 : 4).map((skill) => (
                      <span 
                        key={skill}
                        className="px-2 py-1 sm:px-2.5 sm:py-1 bg-white text-black rounded-full text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300 ease-out border border-gray-400 h-fit"
                      >
                        {skill}
                      </span>
                    ))}
                    {category.skills.length > (position === 'current' ? 8 : 4) && (
                      <span className="px-2 py-1 sm:px-2.5 sm:py-1 bg-gray-200 text-gray-700 rounded-full text-xs sm:text-sm font-medium border border-gray-400 transition-all duration-700 ease-out h-fit">
                        +{category.skills.length - (position === 'current' ? 8 : 4)} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {categories.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-black hover:scale-110 z-20 border border-gray-300"
            aria-label="Previous category"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-black hover:scale-110 z-20 border border-gray-300"
            aria-label="Next category"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {categories.length > 1 && (
        <div className="flex justify-center space-x-2 mt-3 sm:mt-4 lg:mt-6">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-black scale-125' 
                  : 'bg-gray-400 hover:bg-gray-600'
              }`}
              aria-label={`Go to ${categories[index].title}`}
            />
          ))}
        </div>
      )}

      {/* Auto-play indicator */}
      {categories.length > 1 && (
        <div className="mt-2 sm:mt-3 lg:mt-4 text-center">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-xs sm:text-sm text-gray-600 hover:text-black transition-colors duration-200 flex items-center justify-center gap-1.5 sm:gap-2 mx-auto"
          >
            {isAutoPlaying ? (
              <>
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
                Auto-playing
              </>
            ) : (
              <>
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Paused
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
