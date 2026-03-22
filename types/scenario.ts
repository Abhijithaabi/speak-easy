export type ScenarioCategory = 'Professional' | 'Personal' | 'Conflict' | 'Custom';

export interface Scenario {
  id: string;
  title: string;
  description: string;
  category: ScenarioCategory;
}

export const curatedScenarios: Scenario[] = [
  {
    id: "c1",
    title: "Asking for a Raise",
    description: "Negotiate your value with confidence. Practice framing your accomplishments and handling counter-offers.",
    category: "Professional",
  },
  {
    id: "c2",
    title: "Setting a Boundary",
    description: "Define your space gently but firmly. Perfect for navigating time commitments or personal limits with friends.",
    category: "Personal",
  },
  {
    id: "c3",
    title: "Addressing a Late Payment",
    description: "Practice the delicate art of asking for what you're owed without damaging the relationship.",
    category: "Conflict",
  },
  {
    id: "c4",
    title: "Giving Difficult Feedback",
    description: "Deliver constructive criticism that fosters growth rather than defensiveness in colleagues.",
    category: "Professional",
  },
  {
    id: "c5",
    title: "Expressing Disappointment",
    description: "A guide to voicing how you feel when expectations aren't met, focusing on 'I' statements.",
    category: "Conflict",
  }
];

export const initialMyScenarios: Scenario[] = [
  {
    id: "m1",
    title: "Moving Out Notice",
    description: "Practice telling your roommate that you're planning to move out by the end of next month.",
    category: "Custom",
  },
  {
    id: "m2",
    title: "Project Extension",
    description: "Ask for a two-day extension on the marketing presentation due to unexpected data delays.",
    category: "Custom",
  }
];