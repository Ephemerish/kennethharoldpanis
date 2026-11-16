import { useEffect, useRef, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/components/form/Select";
import { SUBJECTS } from "@data/contact/subjects";

interface SubjectSelectProps {
  name?: string;
}

/**
 * The subject picker (Radix Select, KHP §4.6). Server-rendered, so it shows
 * with the page. Radix submits it through its own hidden select; it gets its
 * `name` and `required` only once hydrated, so the server's markup holds no
 * hidden required field that would block the plain form a reader without
 * script sends with the NoScript fallback (KHP §7.8). The form's reset clears it.
 */
export function SubjectSelect({ name = "subject" }: SubjectSelectProps) {
  const [value, setValue] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    const form = ref.current?.closest("form");
    if (!form) return;
    const onReset = () => setValue("");
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  return (
    <Select name={hydrated ? name : undefined} required={hydrated} value={value} onValueChange={setValue}>
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
