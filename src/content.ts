export type Project = {
  num: string;
  name: string;
  blurb: string;
  meta: string[];
  role: string;
  caseStudyUrl?: string;
  mockSrc?: string;
};

export const PROJECTS: Project[] = [
  {
    num: "/01",
    name: "Describe to Design",
    blurb:
      "Describe to Design set out to let people describe what they wanted in plain language and have AI simply build and configure the workflow for them. This project was successfully launched in 2026.",
    meta: ["2026", "0→1"],
    role: "Lead Designer",
  },
  {
    num: "/02",
    name: "Unified Transform",
    blurb:
      "A redesign of how users transform data fields when ingesting information into Qualtrics — replacing two separate, unequal tools (Basic and Advanced Transform) with a single task that lets people move fluidly between AI-assisted, manual, and code-based transformation without ever hitting a dead end. Currently in development, targeting a Q4 2026 launch.",
    meta: ["2026", "redesign", "UXR"],
    role: "Lead Designer",
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

export const ABOUT = {
  intro: "I'm Mansi (pronounced mahn-see).",
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
