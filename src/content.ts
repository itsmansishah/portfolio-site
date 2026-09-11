export type Project = {
  num: string;
  name: string;
  blurb: string;
  meta: string[];
  role: string;
  caseStudyUrl?: string; // external (e.g. Figma prototype)
  caseStudySlug?: string; // internal case study page
  mockSrc?: string;
};

export type Fact = { label: string; values: string[] };

// A headline outcome shown under the intro. `value` is the optional large
// figure (e.g. "60%"); `text` is the full statement.
export type Highlight = { value?: string; text: string };

export type CaseStudy = {
  slug: string;
  title: string;
  intro: string[];
  highlights?: Highlight[];
  facts: Fact[];
  shots: { src?: string; label: string }[];
};

export const PROJECTS: Project[] = [
  {
    num: "/01",
    name: "Describe to Design",
    blurb:
      "Describe to Design set out to let people describe what they wanted in plain language and have AI simply build and configure the workflow for them. This project was successfully launched in 2026.",
    meta: ["2026", "0→1"],
    role: "Lead Designer",
    caseStudySlug: "describe-to-design",
  },
  {
    num: "/02",
    name: "Unified Transform",
    blurb:
      "A redesign of how users transform data fields when ingesting information into Qualtrics — replacing two separate, unequal tools (Basic and Advanced Transform) with a single task that lets people move fluidly between AI-assisted, manual, and code-based transformation without ever hitting a dead end. Currently in development, targeting a Q4 2026 launch.",
    meta: ["2026", "redesign", "UXR"],
    role: "Lead Designer",
    caseStudySlug: "unified-transform",
  },
  {
    num: "/03",
    name: "Pitchbook Projects",
    blurb:
      "I worked on the Market Intelligence team at PitchBook. I led the Emerging Markets space as well as features around custom fields and saved lists. The case studies highlight two projects launched in 2021.",
    meta: ["2021"],
    role: "Lead Designer · Lead Researcher",
    caseStudyUrl:
      "https://www.figma.com/proto/rZ1VDRfVbJ3xziSJcXC0K1/Case-Studies?node-id=101-8872&viewport=407%2C406%2C0.02&t=ZaXoOVmx3rNedutz-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=101%3A8872&page-id=101%3A8865",
  },
];

// Facts render in a two-column grid, flowing in this order — so the pairs
// land as (Company, Year), (Deliverables, Role), (Team, …).
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "describe-to-design",
    title: "Describe to Design",
    intro: [
      "At Qualtrics, creating automated workflows (known internally as xFlows) is a powerful but complex experience. While these workflows allow users to automate tasks across their survey and other feedback ecosystems, configuring them requires significant manual setup and technical know-how.",
      "As part of the Workflows team, I led design exploration for a new concept called Describe to Design (D2D), an AI-powered chat experience that lowers the barrier to workflow creation by enabling users to generate, modify, and refine workflows through natural language.",
    ],
    highlights: [
      {
        value: "60%",
        text: "D2D increased the number of successful workflow executions by 60%.",
      },
    ],
    facts: [
      { label: "Company", values: ["Qualtrics"] },
      { label: "Year", values: ["2025 – 2026"] },
      { label: "Deliverables", values: ["Ship designs (MVP, V2)", "Define scope", "Usability testing"] },
      { label: "Role", values: ["UX Designer"] },
      { label: "Team", values: ["Product Manager", "Engineers", "UX Research"] },
    ],
    shots: [{ label: "D2D_OVERVIEW.PNG" }],
  },
  {
    slug: "unified-transform",
    title: "Unified Transform",
    intro: [
      "A redesign of how users transform data fields when ingesting information into Qualtrics — replacing two separate, unequal tools (Basic and Advanced Transform) with a single task that lets people move fluidly between AI-assisted, manual, and code-based transformation without ever hitting a dead end.",
      "Currently in development, targeting a Q4 2026 launch.",
    ],
    facts: [
      { label: "Company", values: ["Qualtrics"] },
      { label: "Year", values: ["2026"] },
      { label: "Deliverables", values: ["Add deliverables"] },
      { label: "Role", values: ["Lead Designer"] },
      { label: "Team", values: ["Add team"] },
    ],
    shots: [{ label: "UNIFIED_TRANSFORM_OVERVIEW.PNG" }],
  },
];

export const ABOUT = {
  intro: "I'm Mansi",
  pronunciation: "(pronounced mahn-see).",
  body: [
    "By day, I'm a UX designer at Qualtrics, where I get to untangle complicated problems into experiences that feel simple. Outside of that, I'm equal parts restless tinkerer, designer, and random hobby collector. I find so much joy in the process of making and exploring: building interactive web experiments, knitting cozy sweaters, training for my next marathon, and frequently googling “ice cream near me.”",
    "I value living a life anchored in curiosity and quiet creativity — and I'm always up for talking design, sweaters, or good ice cream spots. feel free to say hi!",
  ],
};

export const CONTACT = {
  email: "mansishah120@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/mansishah120/",
  linkedinLabel: "Linkedin",
  resumeUrl: "/Mansi_Shah_Resume.pdf",
};
