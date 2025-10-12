import React from 'react';
import { 
  ChevronDownIcon, 
  ChevronRightIcon, 
  ChevronUpIcon,
  ChevronUpDownIcon,
  BookOpenIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  WrenchScrewdriverIcon,
  CpuChipIcon,
  PuzzlePieceIcon,
  ComputerDesktopIcon,
  CalendarIcon,
  VideoCameraIcon,
  CircleStackIcon,
  BeakerIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  Bars3Icon,
  XMarkIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

interface HeroIconProps {
  name: 
    | 'chevron-down' 
    | 'chevron-right' 
    | 'chevron-up'
    | 'chevron-up-down'
    | 'book-open' 
    | 'document-text'
    | 'arrow-right'
    | 'arrow-left'
    | 'arrow-top-right-on-square'
    | 'globe-alt'
    | 'device-phone-mobile'
    | 'wrench-screwdriver'
    | 'cpu-chip'
    | 'puzzle-piece'
    | 'computer-desktop'
    | 'calendar'
    | 'video-camera'
    | 'circle-stack'
    | 'beaker'
    | 'envelope'
    | 'map-pin'
    | 'clock'
    | 'bars-3'
    | 'x-mark'
    | 'check'
    | 'eye'
    | 'eye-slash';
  className?: string;
}

const iconMap = {
  'chevron-down': ChevronDownIcon,
  'chevron-right': ChevronRightIcon,
  'chevron-up': ChevronUpIcon,
  'chevron-up-down': ChevronUpDownIcon,
  'book-open': BookOpenIcon,
  'document-text': DocumentTextIcon,
  'arrow-right': ArrowRightIcon,
  'arrow-left': ArrowLeftIcon,
  'arrow-top-right-on-square': ArrowTopRightOnSquareIcon,
  'globe-alt': GlobeAltIcon,
  'device-phone-mobile': DevicePhoneMobileIcon,
  'wrench-screwdriver': WrenchScrewdriverIcon,
  'cpu-chip': CpuChipIcon,
  'puzzle-piece': PuzzlePieceIcon,
  'computer-desktop': ComputerDesktopIcon,
  'calendar': CalendarIcon,
  'video-camera': VideoCameraIcon,
  'circle-stack': CircleStackIcon,
  'beaker': BeakerIcon,
  'envelope': EnvelopeIcon,
  'map-pin': MapPinIcon,
  'clock': ClockIcon,
  'bars-3': Bars3Icon,
  'x-mark': XMarkIcon,
  'check': CheckIcon,
  'eye': EyeIcon,
  'eye-slash': EyeSlashIcon,
};

export const HeroIcon: React.FC<HeroIconProps> = ({ name, className = 'w-4 h-4' }) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    return null;
  }
  
  return <IconComponent className={className} />;
};

export default HeroIcon;

