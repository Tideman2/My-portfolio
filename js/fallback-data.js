import currentTechSkills from "../components/skills/skills-utility/tech-skills.js";

export function proficiencyFromPercentage(percent) {
  const value = Number(percent);
  if (!Number.isFinite(value)) return 1;
  if (value <= 20) return 1;
  if (value <= 40) return 2;
  if (value <= 60) return 3;
  if (value <= 80) return 4;
  return 5;
}

export const fallbackProfile = {
  name: "Isaac Mark",
  bio: [
    "I'm a self-taught frontend developer with over 2 years of hands-on experience building responsive web apps using HTML, CSS, and JavaScript. I enjoy learning by doing — solving algorithmic problems and building real-world projects to deepen my understanding. Along the way, I’ve also worked with modern tools like React, Tailwind CSS, and Material UI (MUI) to create dynamic, user-friendly interfaces. Also build rest APIs servers using python and sql",
    "This portfolio was built without frameworks to sharpen my core understanding of the web. I focused on clean structure, accessibility, and modularity. Every challenge — whether design-related or algorithmic — is an opportunity to think deeper and grow as a developer.",
  ].join("\n\n"),
  country: null,
  age: null,
  date_of_birth: null,
};

export const fallbackSocials = [
  {
    platform_name: "LinkedIn",
    url: "https://www.linkedin.com/in/isaac-oghenekaro-939a742a7/",
  },
  { platform_name: "GitHub", url: "https://github.com/Tideman2" },
  { platform_name: "WhatsApp", url: "https://wa.me/2347078768665" },
  { platform_name: "Email", url: "mailto:isaacmark83@gmail.com" },
];

export const fallbackTechnicalSkills = currentTechSkills.map((skill) => ({
  name: skill.tech,
  description: skill.why,
  proficiency: proficiencyFromPercentage(skill.percentageLearnt),
}));

export const fallbackProfessionalSkills = [
  {
    name: "Problem Solving & Critical Thinking",
    description:
      "Breaking complex problems into clear, testable steps and choosing the simplest workable solution.",
    proficiency: 4,
  },
  {
    name: "Communication & Collaboration",
    description:
      "Explaining technical work clearly and working well with teammates and stakeholders.",
    proficiency: 4,
  },
  {
    name: "Adaptability & Quick Learning",
    description:
      "Picking up new tools and patterns quickly, then applying them to real projects.",
    proficiency: 4,
  },
  {
    name: "Attention to Detail",
    description:
      "Catching edge cases, accessibility gaps, and small inconsistencies before they ship.",
    proficiency: 4,
  },
  {
    name: "User Experience Design / Responsive Web Apps",
    description:
      "Designing interfaces that stay usable and readable across screen sizes.",
    proficiency: 4,
  },
];

export const fallbackContent = {
  profile: fallbackProfile,
  socials: fallbackSocials,
  technicalSkills: fallbackTechnicalSkills,
  professionalSkills: fallbackProfessionalSkills,
};
