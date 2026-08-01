// src/data/members.ts
// Type definitions only — member data is now stored in Supabase (club_members table)
// Use the Supabase client to fetch data: import { supabase } from '../lib/supabase'

export type MemberRole = 'Convenor' | 'Deputy Convenor' | 'Core Member' | 'Extended Core Member' | 'Member';

export interface Member {
  id: number;
  name: string;
  role: MemberRole;
  photo: string;
  description: string;
  github?: string;
  linkedin?: string;
  order_no?: number;
  created_at?: string;
}
