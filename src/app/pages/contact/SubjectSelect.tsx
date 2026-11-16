import { useEffect, useRef, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/components/form/Select";
import { SUBJECTS } from "@data/contact/subjects";

interface SubjectSelectProps {
  name?: string;
}

/**
 * The subject picker. Radix submits it with the form through its own hidden
 * select (`name`, `required`); the form's native reset clears it.
 */
export function SubjectSelect({ name = "subject" }: SubjectSelectProps) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const form = ref.current?.closest("form");
    if (!form) return;
    const onReset = () => setValue("");
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  return (
    <Select name={name} required value={value} onValueChange={setValue}>
      <SelectTrigger ref={ref} id="subject">
        <SelectValue placeholder="Select a subject" />
      </SelectTrigger>
      <SelectContent>
        {SUBJECTS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
