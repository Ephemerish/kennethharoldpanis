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
    }, 4000); // Change slide every 4 seconds

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

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main carousel container */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {categories.map((category, index) => (
            <div 
              key={category.title} 
              className="w-full flex-shrink-0 p-8 sm:p-12"
            >
              <div className="text-center">
                {/* Category header */}
                <div className="mb-6">
                  <div className="text-6xl mb-4">{category.icon}</div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {category.title}
                  </h3>
                  <div className="w-20 h-1 bg-blue-500 rounded-full mx-auto"></div>
                </div>
                
                {/* Skills grid */}
                <div className="flex flex-wrap justify-center gap-3">
                  {category.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="px-4 py-2 bg-white text-blue-800 rounded-full text-sm sm:text-base font-medium shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 border border-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
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
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:scale-110"
            aria-label="Previous category"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:scale-110"
            aria-label="Next category"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {categories.length > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-blue-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to category ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Auto-play indicator */}
      {categories.length > 1 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
          >
            {isAutoPlaying ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
                Auto-playing
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
