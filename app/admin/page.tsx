import { redirect } from 'next/navigation';
import AdminStudio from './admin-studio';
import { createClient } from '@/lib/supabase/server';
import type { Project, Track } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminPage(){
 const supabase=await createClient();
 if(!supabase) return <main className="login-page"><div className="login-card"><p className="eyebrow">Setup required</p><h1>Connect Supabase.</h1><p className="login-note">Copy <code>.env.example</code> to <code>.env.local</code>, add your project URL and anon key, then run the SQL migration in <code>supabase/migrations/001_initial.sql</code>.</p><a className="admin-button" href="/">View public prototype ↗</a></div></main>;
 const {data:{user}}=await supabase.auth.getUser(); if(!user)redirect('/admin/login');
 const {data:admin}=await supabase.from('admins').select('user_id').eq('user_id',user.id).maybeSingle(); if(!admin)redirect('/admin/login');
 const [{data:projects},{data:tracks}]=await Promise.all([supabase.from('projects').select('*').order('sort_order'),supabase.from('tracks').select('*').order('sort_order')]);
 return <AdminStudio initialProjects={(projects||[]) as Project[]} initialTracks={(tracks||[]) as Track[]} email={user.email||''}/>;
}
