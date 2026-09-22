export type Project = {
  num: string;
  name: string;
  blurb: string;
  meta: string[];
  role: string;
  caseStudyUrl?: string; // external (e.g. Figma prototype)
  caseStudySlug?: string; // internal case study page
  mockSrc?: string;
  links?: { label: string; url: string }[]; // extra external links, e.g. demo videos
};

/** One of the four cards under the case study title. */
export type FactCard = {
  label: string;
  headline?: string; // e.g. "Lead UX Designer"
  meta?: string; // e.g. "2025 – 2026"
  body?: string;
  emphasis?: string; // tail of `body`, set bold
  items?: string[];
};

export type Shot = {
  src?: string;
  label: string;
  /** "card" sets the mock in a glowing gradient-edged card, for dark bands. */
  frame?: "card";
};

/** A story beat: heading, copy and a mock. "wide" centres the copy and runs
 *  the mock full width; the others sit the mock beside it. */
export type Section = {
  title: string;
  body: string[];
  shot?: Shot;
  layout?: "shot-right" | "shot-left" | "wide";
};

export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  cards: FactCard[];
  summary: { body: string; shot?: Shot };
  sections?: Section[];
  outcome?: { figure: string; caption: string; body: string };
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
    mockSrc: "/describe-to-design.png",
  },
  {
    num: "/02",
    name: "Unified Transform",
    blurb:
      "A redesign of how users transform data fields when ingesting information into Qualtrics — replacing two separate, unequal tools (Basic and Advanced Transform) with a single task that lets people move fluidly between AI-assisted, manual, and code-based transformation without ever hitting a dead end. Currently in development, targeting a Q4 2026 launch.",
    meta: ["2026", "redesign", "UXR"],
    role: "Lead Designer",
    caseStudySlug: "unified-transform",
    mockSrc: "/unified-transform.png",
  },
  {
    num: "/03",
    name: "Pitchbook Projects",
    blurb:
      "I worked on the Market Intelligence team at PitchBook. I led the Emerging Markets space, Workspaces, and custom fields and saved lists. The case studies highlight two projects launched in 2021.",
    meta: ["2021"],
    role: "Lead Designer · Lead Researcher",
    mockSrc: "/pitchbook.png",
    links: [
      {
        label: "Analyst Curated Workspaces demo",
        url: "https://drive.google.com/file/d/12XQnwmsbtSXYwcJu6Vtxtd45tnIQnUMJ/view?usp=drive_link",
      },
      {
        label: "List Management demo",
        url: "https://drive.google.com/file/d/1yNu2YRuTIYGydGP2auSLbb4c94L8O0tO/view?usp=drive_link",
      },
    ],
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
    subtitle: "Lowered the barrier to complex automation through natural language.",
    cards: [
      { label: "Role", headline: "Lead UX Designer", meta: "2025 – 2026" },
      {
        label: "Problem",
        body: "xFlows allow users to automate tasks across their feedback ecosystems, but ",
        emphasis: "the manual configuration required significant technical know-how.",
      },
      {
        label: "Deliverables",
        items: ["Ship designs (MVP, V2)", "Define scope", "Usability testing", "End-to-End AI Assistant"],
      },
      { label: "Team", items: ["Product Manager", "Engineers", "UX Research"] },
    ],
    summary: {
      body: "We transformed Qualtrics Workflows from an intimidating, manual builder into an intuitive AI collaborator and made powerful enterprise tools accessible to everyone by turning natural language into working automation.",
      shot: { src: "/mock-prompt-bar.png", label: "PROMPT_BAR.PNG", frame: "card" },
    },
    sections: [
      {
        title: "Just describe your goal.",
        body: [
          "Instead of manually assembling triggers and logic click-by-click, users simply type what they want to automate in plain English.",
        ],
        shot: { src: "/mock-request-card.png", label: "REQUEST_CARD.PNG" },
        layout: "shot-right",
      },
      {
        title: "Review before you build.",
        body: [
          "A black-box AI creates anxiety.",
          "Before generating the automation, the Qualtrics Assist engine provides a clear, stepped-out summary of your request to ensure honest error handling and accurate task configuration so there is zero guesswork and absolute control.",
        ],
        shot: { src: "/mock-assist-outline.png", label: "ASSIST_OUTLINE.PNG" },
        layout: "shot-left",
      },
      {
        title: "Instant deployment.",
        body: [
          "What used to take twenty minutes of manual configuration is now an instant visual workflow. D2D constructs the entire foundational skeleton, so users never have to stare at a blank canvas again.",
        ],
        shot: { src: "/mock-workflow-canvas.png", label: "WORKFLOW_CANVAS.PNG" },
        layout: "wide",
      },
    ],
    outcome: {
      figure: "60% increase",
      caption: "in successful workflow executions.",
      body: "By lowering the barrier to entry and replacing click-by-click friction with an AI assistant, Describe to Design successfully transformed an intimidating feature into an everyday tool.",
    },
  },
  {
    slug: "unified-transform",
    title: "Unified Transform",
    subtitle: "One task for transforming data, from AI-assisted to hand-written.",
    cards: [
      { label: "Role", headline: "UX Designer & Researcher", meta: "2026" },
      {
        label: "Problem",
        body: "Transforming data fields was split across two separate, unequal tools, ",
        emphasis:
          "forcing users to guess which one they needed before they had even diagnosed their own problem.",
      },
      { label: "Deliverables", items: ["Define requirements", "Full redesign", "Internal testing"] },
      { label: "Team", items: ["Engineer"] },
    ],
    summary: {
      body: "As part of the Workflows team, I led the UX research and design for Unified Transform, a redesign that replaces both tools with a single task, letting users move seamlessly between AI-assisted, manual, and code-based transformation, with their real data visible at every step.",
      shot: { src: "/unified-transform.png", label: "UNIFIED_TRANSFORM.PNG" },
    },
  },
];

export const ABOUT = {
  intro: "I'm Mansi",
  pronunciation: "(pronounced mon-see)",
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
