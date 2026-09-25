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
  meta?: string; // e.g. "2025 – 2026 · Qualtrics"
  body?: string;
  emphasis?: string; // tail of `body`, set bold
  items?: string[];
};

export type Shot = {
  src?: string;
  label: string;
  /** "card" sets the mock in the glowing gradient card from the design —
   *  CSS, because Figma bakes a page-coloured background into its exports. */
  frame?: "card";
  /** Adds the Assist button tucked under the card's right edge. */
  fab?: boolean;
};

/** The white panel of options: a heading over a short list of methods. */
export type Panel = {
  title: string;
  subtitle?: string;
  rows: { title: string; body: string }[];
};

/** A mocked data table, drawn in markup rather than exported. */
export type Preview = {
  label: string;
  columns: string[];
  rows: string[][];
  chip?: string;
};

/** A story beat. It carries a mock, a panel, a preview table or a set of
 *  numbered cards — whichever the section needs. */
export type Section = {
  title: string;
  kicker?: string;
  subtitle?: string;
  body?: string[];
  shot?: Shot;
  panel?: Panel;
  preview?: Preview;
  cards?: { num: string; title: string; body: string }[];
  layout?: "shot-right" | "shot-left" | "wide";
};

/** The dark band of where a project stands, as a dated run of steps. */
export type Timeline = {
  kicker: string;
  title: string;
  steps: { when: string; title: string; body: string }[];
};

/** Closing notes on what the work taught. */
export type Reflection = {
  kicker: string;
  title: string;
  cards: { label: string; title: string; body: string }[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  cards: FactCard[];
  summary: {
    kicker?: string;
    body: string;
    list?: string[];
    shot?: Shot;
    panel?: Panel;
  };
  sections?: Section[];
  outcome?: { figure: string; caption: string; body: string };
  timeline?: Timeline;
  reflection?: Reflection;
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
      { label: "Role", headline: "Lead UX Designer", meta: "2025 – 2026 · Qualtrics" },
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
      shot: { src: "/mock-prompt-bar.png", label: "PROMPT_BAR.PNG", frame: "card", fab: true },
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
    subtitle:
      "Replacing two unequal tools with one — built on research that predicted the confusion before it ever shipped.",
    cards: [
      { label: "Role", headline: "Lead UX Research & Design", meta: "2026 · Qualtrics" },
      {
        label: "Problem",
        body: "Basic Transform's success created demand for complex, multi-field transforms — ",
        emphasis: "the default plan was a second, unequal tool.",
      },
      {
        label: "Deliverables",
        items: [
          "Prototype research",
          "Design principles",
          "Unified entry modal",
          "Split-pane workspace",
        ],
      },
      { label: "Team", items: ["Product Manager", "Engineering", "UX Research (Leah Zhu-Ireland)"] },
    ],
    summary: {
      kicker: "All in one",
      body: "Why unify Basic, Advanced Transform, and code transform",
      list: ["reduce user confusion", "more flexibility", "greater scalability"],
      panel: {
        title: "How do you want to set up your transformations?",
        subtitle: "One entry point. Every method lands in the same workspace.",
        rows: [
          {
            title: "Transform with AI",
            body: "Describe what you need — get a reviewable rule list with live preview.",
          },
          { title: "Transform manually", body: "Map fields yourself using the data mapper." },
          { title: "Code transform", body: "Write Python for complex, multi-step logic." },
        ],
      },
    },
    sections: [
      {
        title: "Basic Transform",
        body: [
          "When I joined Qualtrics in 2022, I owned Basic Transform — a task built to close a real gap: users ingesting data had no simple way to reshape it in-flight.",
          "It shipped, and it worked. That success surfaced a harder problem: users wanted more complex, multi-field transformations. The default instinct from the team was to build a second, separate task, Advanced Transform.",
        ],
        shot: { src: "/basic-transform.png", label: "BASIC_TRANSFORM.PNG" },
        layout: "shot-right",
      },
      {
        title: "One entry point, one workspace.",
        subtitle:
          "Every path — AI, manual, or code — starts at the same modal and lands in the same split-pane workspace.",
        panel: {
          title: "How do you want to set up your transformations?",
          subtitle: "Choose a method — you can always start over if you change your mind.",
          rows: [
            {
              title: "Transform with AI",
              body: "Describe what you need. AI generates a reviewable rule list with live preview.",
            },
            { title: "Transform manually", body: "Map fields manually using the data mapper." },
            { title: "Code transform", body: "Write Python for complex multi-step logic." },
          ],
        },
      },
      {
        kicker: "Live preview",
        title: "See it work before you commit.",
        body: [
          "Your real rows update next to every rule you write. No sample file to upload, no separate validation step — just your data, live, including the edge cases that usually slip through.",
        ],
        preview: {
          label: "Live preview",
          columns: ["full_name", "AccountID", "created_at", "needs_review"],
          rows: [
            ["Mansi Shah", "91228440", "2025-01-03", "no"],
            ["Tracy Sherwin", "21439885", "2025-10-15", "yes"],
            ["Jorge Lopez", "10233904", "2025-03-21", "no"],
          ],
          chip: "catherine zeta-jones → Catherine Zeta-Jones",
        },
        layout: "shot-left",
      },
      {
        title: "Built to be the only tool you reach for.",
        cards: [
          {
            num: "01",
            title: "No wrong door",
            body: "Start manual, fall back to AI, or the reverse — without leaving the task.",
          },
          {
            num: "02",
            title: "One source of truth",
            body: "A single transformation list, whether a rule came from AI, manual mapping, or code.",
          },
          {
            num: "03",
            title: "Progressive power",
            body: "Three entry points — AI, manual, code — with the AI-generated formula always visible.",
          },
          {
            num: "04",
            title: "Always visible data",
            body: "A live preview sits permanently beside the rule list, not validated after the fact.",
          },
        ],
      },
    ],
    timeline: {
      kicker: "Where it stands",
      title: "In development, targeting Q4 2026",
      steps: [
        { when: "Dec 2025", title: "Prototype research", body: "AI-assisted transformation study" },
        {
          when: "Late '25 – mid '26",
          title: "Making the case",
          body: "Fighting to get it prioritized",
        },
        { when: "May 2026", title: "Design lifecycle", body: "Mockups, A/B comparisons, handoff" },
        { when: "Now", title: "In build", body: "Moving through engineering" },
        { when: "Q4 2026", title: "Target launch", body: "Replaces Basic + Advanced" },
      ],
    },
    reflection: {
      kicker: "Reflection",
      title: "What this project sharpened.",
      cards: [
        {
          label: "01 — Advocating for research",
          title: "Research is an argument-winning tool, not a phase.",
          body: "I turned the disagreement into a testable question — run the study before the direction is locked, not after.",
        },
        {
          label: "02 — Pushing back, on the record",
          title: "Naming a specific problem beats naming a bad feeling.",
          body: "The capability-gap concern held up because it was concrete, and because I stayed with it through the fight that followed.",
        },
        {
          label: "03 — Thinking systematically",
          title: "The tell was structural, not visual.",
          body: "Seeing it meant stepping back from screens to ask what mental model the system was actually asking people to hold.",
        },
      ],
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
