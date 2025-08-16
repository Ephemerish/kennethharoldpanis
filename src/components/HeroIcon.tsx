import React from 'react';
import { 
  ChevronDownIcon, 
  ChevronRightIcon, 
  BookOpenIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

interface HeroIconProps {
  name: 'chevron-down' | 'chevron-right' | 'book-open' | 'document-text';
  className?: string;
}

const iconMap = {
  'chevron-down': ChevronDownIcon,
  'chevron-right': ChevronRightIcon,
  'book-open': BookOpenIcon,
  'document-text': DocumentTextIcon,
};

export const HeroIcon: React.FC<HeroIconProps> = ({ name, className = 'w-4 h-4' }) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    return null;
  }
  
  return <IconComponent className={className} />;
};

export default HeroIcon;
