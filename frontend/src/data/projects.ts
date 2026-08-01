// src/data/projects.ts
// Type definitions only — project data is now stored in Supabase (club_projects table)
// Use the Supabase client to fetch data: import { supabase } from '../lib/supabase'

export interface Project {
  id: number;
  title: string;
  author: string;
  authorId: number;   // maps to club_members.id (author_id column in DB)
  description: string;
  tags: string[];
  githubLink: string; // maps to github_link column in DB
}
