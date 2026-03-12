// src/data/projects.ts

export interface Project {
  id: number;
  title: string;
  category: string;
  tech: string[];
  description: string;
  status: "Live" | "Development";
  link?: string; // Opsional, jika ada link website
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Portal Garut Satu Data",
    category: "Government / Data Portal",
    tech: ["React", "PHP", "MySQL"], // Backend PHP (Laragon env)
    description: "Portal data terpadu resmi Pemerintah Kabupaten Garut. Fokus pada penyajian data publik yang transparan dengan antarmuka yang modern dan responsif.",
    status: "Live",
    link: "https://satudata.garutkab.go.id/"
  },
  {
    id: 2,
    title: "Picme Studio",
    category: "Creative / Web App",
    tech: ["React", "Express.js", "MySQL"],
    description: "Platform digital untuk studio kreatif Picme Studio. Menggunakan arsitektur modern dengan React dan Express untuk performa yang cepat dan dinamis.",
    status: "Live",
    link: "https://picmestudio.id/"
  },
  {
    id: 3,
    title: "IMN Business Group",
    category: "Corporate Profile",
    tech: ["React", "Express.js", "MySQL"],
    description: "Website profil perusahaan profesional untuk IMN Business Group. Dirancang untuk merepresentasikan kredibilitas bisnis dengan integrasi backend yang solid.",
    status: "Live",
    link: "https://imnbusinessgroup.co.id/"
  }
];