import { getSupabase } from './supabase';
import { Project, Experience, Biodata, SkillCategory, ServiceItem } from './types';
import { personalData, projectsData, experienceData, skillsData, servicesData } from './data';


// =========================================================================
// SQL SCHEMA FOR SUPABASE SQL EDITOR
// =========================================================================
/*
-- Run this SQL in your Supabase SQL Editor (https://supabase.com) to set up tables:

CREATE TABLE IF NOT EXISTS biodata (
  id TEXT PRIMARY KEY DEFAULT 'personal-bio',
  full_name TEXT,
  short_name TEXT,
  title TEXT,
  email TEXT,
  whatsapp TEXT,
  whatsapp_link TEXT,
  instagram TEXT,
  instagram_link TEXT,
  linkedin TEXT,
  github_cv TEXT,
  cv_filename TEXT,
  about_me TEXT,
  experience_years TEXT,
  projects_completed_count TEXT,
  support_availability TEXT,
  avatar_url TEXT
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  button_link TEXT,
  detail_text TEXT,
  specs TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS experiences (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT NOT NULL,
  image_url TEXT,
  description TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
  "order" INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  "order" INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS admin_settings (
  id TEXT PRIMARY KEY DEFAULT 'admin-auth',
  email TEXT NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS portfolio_categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- PENTING: Supabase mengaktifkan Row Level Security (RLS) secara default untuk tabel baru.
-- Jalankan perintah ini di SQL Editor Supabase Anda untuk menonaktifkan RLS agar aplikasi web bisa membaca & mengedit data:
ALTER TABLE biodata DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE experiences DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_categories DISABLE ROW LEVEL SECURITY;
*/

// =========================================================================
// MAPPING UTILITIES (Postgres snake_case to Frontend camelCase)
// =========================================================================

function mapBiodataFromDb(row: any): Biodata {
  return {
    fullName: row.full_name || row.fullName || '',
    shortName: row.short_name || row.shortName || '',
    title: row.title || '',
    email: row.email || '',
    whatsapp: row.whatsapp || '',
    whatsappLink: row.whatsapp_link || row.whatsappLink || '',
    instagram: row.instagram || '',
    instagramLink: row.instagram_link || row.instagramLink || '',
    linkedin: row.linkedin || '',
    githubCV: row.github_cv || row.githubCV || '',
    cvFilename: row.cv_filename || row.cvFilename || '',
    aboutMe: row.about_me || row.aboutMe || '',
    experienceYears: row.experience_years || row.experienceYears || '',
    projectsCompletedCount: row.projects_completed_count || row.projectsCompletedCount || '',
    supportAvailability: row.support_availability || row.supportAvailability || '',
    avatarUrl: row.avatar_url || row.avatarUrl || ''
  };
}

function mapBiodataToDb(data: Partial<Biodata>) {
  const row: any = {};
  if (data.fullName !== undefined) row.full_name = data.fullName;
  if (data.shortName !== undefined) row.short_name = data.shortName;
  if (data.title !== undefined) row.title = data.title;
  if (data.email !== undefined) row.email = data.email;
  if (data.whatsapp !== undefined) row.whatsapp = data.whatsapp;
  if (data.whatsappLink !== undefined) row.whatsapp_link = data.whatsappLink;
  if (data.instagram !== undefined) row.instagram = data.instagram;
  if (data.instagramLink !== undefined) row.instagram_link = data.instagramLink;
  if (data.linkedin !== undefined) row.linkedin = data.linkedin;
  if (data.githubCV !== undefined) row.github_cv = data.githubCV;
  if (data.cvFilename !== undefined) row.cv_filename = data.cvFilename;
  if (data.aboutMe !== undefined) row.about_me = data.aboutMe;
  if (data.experienceYears !== undefined) row.experience_years = data.experienceYears;
  if (data.projectsCompletedCount !== undefined) row.projects_completed_count = data.projectsCompletedCount;
  if (data.supportAvailability !== undefined) row.support_availability = data.supportAvailability;
  if (data.avatarUrl !== undefined) row.avatar_url = data.avatarUrl;
  return row;
}

function mapProjectFromDb(row: any): Project {
  return {
    id: row.id,
    title: row.title || '',
    category: row.category || 'web',
    description: row.description || '',
    imageUrl: row.image_url || row.imageUrl || '',
    buttonLink: row.button_link || row.buttonLink || '',
    detailText: row.detail_text || row.detailText || '',
    specs: row.specs || ''
  };
}

function mapProjectToDb(data: Partial<Project>) {
  const row: any = {};
  if (data.id !== undefined) row.id = data.id;
  if (data.title !== undefined) row.title = data.title;
  if (data.category !== undefined) row.category = data.category;
  if (data.description !== undefined) row.description = data.description;
  if (data.imageUrl !== undefined) row.image_url = data.imageUrl;
  if (data.buttonLink !== undefined) row.button_link = data.buttonLink;
  if (data.detailText !== undefined) row.detail_text = data.detailText;
  if (data.specs !== undefined) row.specs = data.specs;
  return row;
}

function mapExperienceFromDb(row: any): Experience {
  let detailsArray: string[] = [];
  if (row.details) {
    if (typeof row.details === 'string') {
      try {
        detailsArray = JSON.parse(row.details);
      } catch (e) {
        detailsArray = [];
      }
    } else if (Array.isArray(row.details)) {
      detailsArray = row.details;
    }
  }
  return {
    id: row.id,
    company: row.company || '',
    location: row.location || '',
    role: row.role || '',
    period: row.period || '',
    imageUrl: row.image_url || row.imageUrl || '',
    description: row.description || '',
    details: detailsArray
  };
}

function mapExperienceToDb(data: Partial<Experience>) {
  const row: any = {};
  if (data.id !== undefined) row.id = data.id;
  if (data.company !== undefined) row.company = data.company;
  if (data.location !== undefined) row.location = data.location;
  if (data.role !== undefined) row.role = data.role;
  if (data.period !== undefined) row.period = data.period;
  if (data.imageUrl !== undefined) row.image_url = data.imageUrl;
  if (data.description !== undefined) row.description = data.description;
  if (data.details !== undefined) row.details = data.details;
  return row;
}

function mapServiceFromDb(row: any): ServiceItem {
  let checklistArray: string[] = [];
  if (row.checklist) {
    if (typeof row.checklist === 'string') {
      try {
        checklistArray = JSON.parse(row.checklist);
      } catch (e) {
        checklistArray = [];
      }
    } else if (Array.isArray(row.checklist)) {
      checklistArray = row.checklist;
    }
  }
  return {
    id: row.id,
    title: row.title || '',
    description: row.description || '',
    icon: row.icon || '',
    checklist: checklistArray,
    order: row.order !== undefined ? row.order : undefined
  };
}

function mapServiceToDb(data: Partial<ServiceItem>) {
  const row: any = {};
  if (data.id !== undefined) row.id = data.id;
  if (data.title !== undefined) row.title = data.title;
  if (data.description !== undefined) row.description = data.description;
  if (data.icon !== undefined) row.icon = data.icon;
  if (data.checklist !== undefined) row.checklist = data.checklist;
  if (data.order !== undefined) row.order = data.order;
  return row;
}

function mapSkillFromDb(row: any): SkillCategory {
  let skillsArray: any[] = [];
  if (row.skills) {
    if (typeof row.skills === 'string') {
      try {
        skillsArray = JSON.parse(row.skills);
      } catch (e) {
        skillsArray = [];
      }
    } else if (Array.isArray(row.skills)) {
      skillsArray = row.skills;
    }
  }
  return {
    id: row.id,
    title: row.title || '',
    skills: skillsArray,
    order: row.order !== undefined ? row.order : undefined
  };
}

function mapSkillToDb(data: Partial<SkillCategory>) {
  const row: any = {};
  if (data.id !== undefined) row.id = data.id;
  if (data.title !== undefined) row.title = data.title;
  if (data.skills !== undefined) row.skills = data.skills;
  if (data.order !== undefined) row.order = data.order;
  return row;
}

function mapContactFromDb(row: any) {
  return {
    id: row.id,
    name: row.name || '',
    email: row.email || '',
    message: row.message || '',
    status: row.status || 'unread',
    createdAt: row.created_at || row.createdAt || ''
  };
}

// =========================================================================
// SEEDING AND AUTO-INITIALIZATION FUNCTIONS
// =========================================================================

export async function initializeProjectsInSupabase(): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  try {
    const { data, error } = await supabase.from('projects').select('id').limit(1);
    if (error) {
      console.warn('Supabase projects check warning:', error);
      return false;
    }
    if (!data || data.length === 0) {
      console.log('Supabase projects table is empty. Seeding initial data...');
      const seedData = projectsData.map(proj => mapProjectToDb(proj));
      const { error: insertError } = await supabase.from('projects').insert(seedData);
      if (insertError) {
        console.error('Failed to seed Supabase projects:', insertError);
        return false;
      }
      return true;
    }
  } catch (err) {
    console.error('Supabase seed projects error:', err);
  }
  return false;
}

export async function initializeExperiencesInSupabase(): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  try {
    const { data, error } = await supabase.from('experiences').select('id').limit(1);
    if (error) return false;
    if (!data || data.length === 0) {
      console.log('Supabase experiences table is empty. Seeding initial data...');
      const seedData = experienceData.map(exp => mapExperienceToDb(exp));
      const { error: insertError } = await supabase.from('experiences').insert(seedData);
      if (insertError) {
        console.error('Failed to seed Supabase experiences:', insertError);
        return false;
      }
      return true;
    }
  } catch (err) {
    console.error('Supabase seed experiences error:', err);
  }
  return false;
}

export async function initializeBiodataInSupabase(): Promise<Biodata | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('biodata').select('*').eq('id', 'personal-bio').single();
    if (error && error.code === 'PGRST116') {
      // Record not found, seed it
      console.log('Supabase biodata document not found. Seeding initial bio...');
      const seedBio = { id: 'personal-bio', ...mapBiodataToDb(personalData) };
      const { data: inserted, error: insertError } = await supabase.from('biodata').insert([seedBio]).select().single();
      if (insertError) {
        console.error('Failed to seed Supabase biodata:', insertError);
        return null;
      }
      return mapBiodataFromDb(inserted);
    } else if (data) {
      return mapBiodataFromDb(data);
    }
  } catch (err) {
    console.error('Supabase seed biodata error:', err);
  }
  return null;
}

export async function initializeServicesInSupabase(): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  try {
    const { data, error } = await supabase.from('services').select('id').limit(1);
    if (error) return false;
    if (!data || data.length === 0) {
      console.log('Supabase services table is empty. Seeding initial services...');
      const seedData = servicesData.map((svc, index) => ({
        id: `svc-${index + 1}`,
        ...mapServiceToDb(svc),
        order: index
      }));
      const { error: insertError } = await supabase.from('services').insert(seedData);
      if (insertError) {
        console.error('Failed to seed Supabase services:', insertError);
        return false;
      }
      return true;
    }
  } catch (err) {
    console.error('Supabase seed services error:', err);
  }
  return false;
}

export async function initializeSkillsInSupabase(): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  try {
    const { data, error } = await supabase.from('skills').select('id').limit(1);
    if (error) return false;
    if (!data || data.length === 0) {
      console.log('Supabase skills table is empty. Seeding initial skills...');
      const seedData = skillsData.map((sk, index) => ({
        id: `sk-${index + 1}`,
        ...mapSkillToDb(sk),
        order: index
      }));
      const { error: insertError } = await supabase.from('skills').insert(seedData);
      if (insertError) {
        console.error('Failed to seed Supabase skills:', insertError);
        return false;
      }
      return true;
    }
  } catch (err) {
    console.error('Supabase seed skills error:', err);
  }
  return false;
}

// =========================================================================
// MAIN SUPABASE PORTFOLIO API METHODS
// =========================================================================

// Projects
export async function getProjectsFromSupabase(): Promise<Project[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return [];
  }
  try {
    await initializeProjectsInSupabase();
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: true });
    if (error) {
      console.warn('Projects table not ready:', error.message);
      return [];
    }
    return (data || []).map(mapProjectFromDb);
  } catch (err: any) {
    console.error('getProjectsFromSupabase error:', err);
    return [];
  }
}

export async function addProjectInSupabase(project: Omit<Project, 'id'> & { id?: string }): Promise<string> {
  const id = project.id || `proj-${Date.now()}`;
  const newProject = { ...project, id } as Project;

  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  const payload = mapProjectToDb(newProject);
  const { error } = await supabase.from('projects').insert([payload]);
  if (error) {
    console.error('Failed to insert project into Supabase:', error);
    throw error;
  }
  return id;
}

export async function updateProjectInSupabase(id: string, updates: Partial<Omit<Project, 'id'>>): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  const payload = mapProjectToDb(updates);
  const { error } = await supabase.from('projects').update(payload).eq('id', id);
  if (error) {
    console.error('Failed to update project in Supabase:', error);
    throw error;
  }
}

export async function deleteProjectFromSupabase(id: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete project from Supabase:', error);
    throw error;
  }
}

// Contacts/Messages
export async function addContactMessageInSupabase(name: string, email: string, message: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  const { error } = await supabase.from('contacts').insert([{ name, email, message, status: 'unread' }]);
  if (error) {
    console.error('Failed to add contact message to Supabase:', error);
    throw error;
  }
}

export async function getContactMessagesFromSupabase(): Promise<any[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Contacts table not ready:', error.message);
      return [];
    }
    return (data || []).map(mapContactFromDb);
  } catch (err) {
    console.error('getContactMessagesFromSupabase error:', err);
    return [];
  }
}

export async function updateMessageStatusInSupabase(id: string, status: 'unread' | 'read'): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  const { error } = await supabase.from('contacts').update({ status }).eq('id', id);
  if (error) {
    console.error('Failed to update contact status in Supabase:', error);
    throw error;
  }
}

export async function deleteMessageFromSupabase(id: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete contact from Supabase:', error);
    throw error;
  }
}

// Experiences
export async function getExperiencesFromSupabase(): Promise<Experience[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return [];
  }
  try {
    await initializeExperiencesInSupabase();
    const { data, error } = await supabase.from('experiences').select('*').order('created_at', { ascending: true });
    if (error) {
      console.warn('Experiences table not ready:', error.message);
      return [];
    }
    return (data || []).map(mapExperienceFromDb);
  } catch (err: any) {
    console.error('getExperiencesFromSupabase error:', err);
    return [];
  }
}

export async function addExperienceInSupabase(exp: Omit<Experience, 'id'> & { id?: string }): Promise<string> {
  const id = exp.id || `exp-${Date.now()}`;
  const newExp = { ...exp, id } as Experience;

  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  const payload = mapExperienceToDb(newExp);
  const { error } = await supabase.from('experiences').insert([payload]);
  if (error) {
    console.error('Failed to add experience to Supabase:', error);
    throw error;
  }
  return id;
}

export async function updateExperienceInSupabase(id: string, updates: Partial<Omit<Experience, 'id'>>): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  const payload = mapExperienceToDb(updates);
  const { error } = await supabase.from('experiences').update(payload).eq('id', id);
  if (error) {
    console.error('Failed to update experience in Supabase:', error);
    throw error;
  }
}

export async function deleteExperienceFromSupabase(id: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  const { error } = await supabase.from('experiences').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete experience from Supabase:', error);
    throw error;
  }
}

const emptyBiodata: Biodata = {
  fullName: '',
  shortName: '',
  title: '',
  email: '',
  whatsapp: '',
  whatsappLink: '',
  instagram: '',
  instagramLink: '',
  linkedin: '',
  githubCV: '',
  cvFilename: '',
  aboutMe: '',
  experienceYears: '',
  projectsCompletedCount: '',
  supportAvailability: '',
  avatarUrl: ''
};

// Biodata
export async function getBiodataFromSupabase(): Promise<Biodata> {
  const supabase = getSupabase();
  if (!supabase) return emptyBiodata;

  try {
    const bio = await initializeBiodataInSupabase();
    if (bio) {
      return bio;
    }
  } catch (err) {
    console.error('getBiodataFromSupabase error:', err);
  }
  return emptyBiodata;
}

export async function updateBiodataInSupabase(updates: Partial<Biodata>): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  const payload = mapBiodataToDb(updates);
  const { error } = await supabase.from('biodata').upsert({ id: 'personal-bio', ...payload });
  if (error) {
    console.error('Failed to save biodata to Supabase:', error);
    throw error;
  }
}

// Services
export async function getServicesFromSupabase(): Promise<ServiceItem[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return [];
  }
  try {
    await initializeServicesInSupabase();
    const { data, error } = await supabase.from('services').select('*').order('order', { ascending: true });
    if (error) {
      console.warn('Services table not ready:', error.message);
      return [];
    }
    return (data || []).map(mapServiceFromDb);
  } catch (err: any) {
    console.error('getServicesFromSupabase error:', err);
    return [];
  }
}

export async function addServiceInSupabase(service: Omit<ServiceItem, 'id'>): Promise<string> {
  const id = `svc-${Date.now()}`;
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  const { data } = await supabase.from('services').select('id');
  const count = data ? data.length : 0;
  
  const payload = { id, ...mapServiceToDb(service), order: count };
  const { error } = await supabase.from('services').insert([payload]);
  if (error) {
    console.error('Failed to add service to Supabase:', error);
    throw error;
  }
  return id;
}

export async function updateServiceInSupabase(id: string, updates: Partial<ServiceItem>): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  const payload = mapServiceToDb(updates);
  const { error } = await supabase.from('services').update(payload).eq('id', id);
  if (error) {
    console.error('Failed to update service in Supabase:', error);
    throw error;
  }
}

export async function deleteServiceFromSupabase(id: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete service from Supabase:', error);
    throw error;
  }
}

// Skills
export async function getSkillsCategoriesFromSupabase(): Promise<SkillCategory[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return [];
  }
  try {
    await initializeSkillsInSupabase();
    const { data, error } = await supabase.from('skills').select('*').order('order', { ascending: true });
    if (error) {
      console.warn('Skills table not ready:', error.message);
      return [];
    }
    return (data || []).map(mapSkillFromDb);
  } catch (err: any) {
    console.error('getSkillsCategoriesFromSupabase error:', err);
    return [];
  }
}

export async function addSkillCategoryInSupabase(category: Omit<SkillCategory, 'id'>): Promise<string> {
  const id = `sk-${Date.now()}`;
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  const { data } = await supabase.from('skills').select('id');
  const count = data ? data.length : 0;

  const payload = { id, ...mapSkillToDb(category), order: count };
  const { error } = await supabase.from('skills').insert([payload]);
  if (error) {
    console.error('Failed to add skill category to Supabase:', error);
    throw error;
  }
  return id;
}

export async function updateSkillCategoryInSupabase(id: string, updates: Partial<SkillCategory>): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  const payload = mapSkillToDb(updates);
  const { error } = await supabase.from('skills').update(payload).eq('id', id);
  if (error) {
    console.error('Failed to update skill category in Supabase:', error);
    throw error;
  }
}

export async function deleteSkillCategoryFromSupabase(id: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  const { error } = await supabase.from('skills').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete skill category from Supabase:', error);
    throw error;
  }
}

// =========================================================================
// ADMIN SETTINGS MANAGEMENT
// =========================================================================

export async function getAdminSettingsFromSupabase(): Promise<{ email: string; pass: string }> {
  const supabase = getSupabase();
  const preset = { email: 'daniel.admin@gmail.com', pass: 'danieladmin123' };
  if (!supabase) {
    return preset;
  }

  try {
    const { data, error } = await supabase.from('admin_settings').select('*').eq('id', 'admin-auth').single();
    if (error) {
      if (error.code === 'PGRST116') {
        const seedAdmin = { id: 'admin-auth', email: 'daniel.admin@gmail.com', password: 'danieladmin123' };
        await supabase.from('admin_settings').insert([seedAdmin]);
        return preset;
      } else {
        console.warn('Supabase admin_settings fetch error, falling back to preset:', error);
        return preset;
      }
    }
    return { email: data.email, pass: data.password };
  } catch (err) {
    console.error('Supabase admin_settings error:', err);
    return preset;
  }
}

export async function updateAdminSettingsInSupabase(email: string, pass: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  const { error } = await supabase.from('admin_settings').upsert({ id: 'admin-auth', email, password: pass });
  if (error) {
    console.error('Supabase admin_settings upsert error:', error);
    throw error;
  }
}

// =========================================================================
// PORTFOLIO CATEGORIES MANAGEMENT
// =========================================================================

const DEFAULT_PORTFOLIO_CATEGORIES = [
  { id: 'web', label: 'Web' },
  { id: 'photography', label: 'Photo' },
  { id: 'design', label: 'Design' },
  { id: 'certificate', label: 'Certificates' }
];

export async function getPortfolioCategoriesFromSupabase(): Promise<{ id: string; label: string }[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase.from('portfolio_categories').select('*').order('created_at', { ascending: true });
    if (error) {
      console.warn('Supabase portfolio_categories fetch error:', error);
      return [];
    }
    if (!data || data.length === 0) {
      try {
        await supabase.from('portfolio_categories').insert(DEFAULT_PORTFOLIO_CATEGORIES);
      } catch (seedErr) {
        console.warn('Failed to seed portfolio_categories:', seedErr);
      }
      return DEFAULT_PORTFOLIO_CATEGORIES;
    }
    return data.map((item: any) => ({
      id: item.id,
      label: item.label
    }));
  } catch (err) {
    console.error('Supabase portfolio_categories error:', err);
    return [];
  }
}

export async function addPortfolioCategoryInSupabase(id: string, label: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  const { error } = await supabase.from('portfolio_categories').insert([{ id, label }]);
  if (error) {
    console.error('Failed to add portfolio category to Supabase:', error);
    throw error;
  }
}

export async function updatePortfolioCategoryInSupabase(id: string, label: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  const { error } = await supabase.from('portfolio_categories').update({ label }).eq('id', id);
  if (error) {
    console.error('Failed to update portfolio category in Supabase:', error);
    throw error;
  }
}

export async function deletePortfolioCategoryFromSupabase(id: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  const { error } = await supabase.from('portfolio_categories').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete portfolio category from Supabase:', error);
    throw error;
  }
}
