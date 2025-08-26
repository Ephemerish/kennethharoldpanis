import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface SubjectSelectProps {
  name?: string;
  required?: boolean;
}

const subjectOptions = [
  { value: 'collaboration', label: 'Project Collaboration' },
  { value: 'job-opportunity', label: 'Job Opportunity' },
  { value: 'freelance', label: 'Freelance Project' },
  { value: 'consultation', label: 'Technical Consultation' },
  { value: 'question', label: 'General Question' },
  { value: 'other', label: 'Other' },
];

export function SubjectSelect({ name = 'subject', required }: SubjectSelectProps) {
  const [value, setValue] = useState('');

  React.useEffect(() => {
    // Create or update hidden input for form submission
    const form = document.getElementById('contact-form') as HTMLFormElement;
    if (form) {
      let hiddenInput = form.querySelector(`input[name="${name}"]`) as HTMLInputElement;
      if (!hiddenInput) {
        hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = name;
        hiddenInput.required = required || false;
        form.appendChild(hiddenInput);
      }
      hiddenInput.value = value;
    }
  }, [value, name, required]);

  React.useEffect(() => {
    // Listen for form reset events
    const handleFormReset = () => {
      setValue('');
    };

    window.addEventListener('form-reset', handleFormReset);
    return () => window.removeEventListener('form-reset', handleFormReset);
  }, []);

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger>
        <SelectValue placeholder="Select a subject" />
      </SelectTrigger>
      <SelectContent>
        {subjectOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
