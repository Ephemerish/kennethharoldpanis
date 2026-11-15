/**
 * What a message can be about. The form offers these and the endpoint accepts
 * only these, so a subject in the inbox is always one of them.
 */
export const SUBJECTS = [
  { value: "collaboration", label: "Project Collaboration" },
  { value: "job-opportunity", label: "Job Opportunity" },
  { value: "freelance", label: "Freelance Project" },
  { value: "consultation", label: "Technical Consultation" },
  { value: "question", label: "General Question" },
  { value: "other", label: "Other" },
] as const;

export type SubjectValue = (typeof SUBJECTS)[number]["value"];
