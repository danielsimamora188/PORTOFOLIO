export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
  buttonLink?: string;
  detailText?: string;
  specs?: string;
}

export interface Skill {
  name: string;
  level?: 'Advanced' | 'Intermediate' | 'Basic';
}

export interface SkillCategory {
  id?: string;
  title: string;
  skills: Skill[];
  order?: number;
}

export interface ServiceItem {
  id?: string;
  title: string;
  description: string;
  icon: string; // slug / string e.g. 'code', 'video', 'palette'
  checklist: string[];
  order?: number;
}

export interface Experience {
  id: string;
  company: string;
  location: string;
  role: string;
  period: string;
  imageUrl?: string;
  description: string;
  details: string[];
}

export interface Biodata {
  fullName: string;
  shortName: string;
  title: string;
  email: string;
  whatsapp: string;
  whatsappLink: string;
  instagram: string;
  instagramLink: string;
  linkedin: string;
  githubCV: string;
  cvFilename: string;
  aboutMe: string;
  experienceYears: string;
  projectsCompletedCount: string;
  supportAvailability: string;
  avatarUrl?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read';
}
