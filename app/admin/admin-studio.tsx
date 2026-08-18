'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Project, Track } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

const slugify=(s:string)=>s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

export default function AdminStudio({initialProjects,initialTracks,email}:{initialProjects:Project[];initialTracks:Track[];email:string}){
 const supabase=createClient(); const router=useRouter();
 const [projects,setProjects]=useState(initialProjects); const [tracks,setTracks]=useState(initialTracks);
 const [status,setStatus]=useState(''); const [busy,setBusy]=useState(false);
 const musicProjects=projects.filter((p)=>p.type==='Music');
 useEffect(()=>{if(status){const t=setTimeout(()=>setStatus(''),5000);return()=>clearTimeout(t)}},[status]);

 async function upload(file:File|null,folder:string){
   if(!file||file.size===0||!supabase)return null;
   const ext=file.name.split('.').pop()||'bin'; const path=`${folder}/${crypto.randomUUID()}.${ext}`;
   const {error}=await supabase.storage.from('portfolio').upload(path,file,{upsert:false,cacheControl:'3600'});
   if(error)throw error;
   return supabase.storage.from('portfolio').getPublicUrl(path).data.publicUrl;
 }

 async function createProject(e:React.FormEvent<HTMLFormElement>){
   e.preventDefault(); if(!supabase)return; setBusy(true); setStatus('');
   try{
     const form=e.currentTarget; const fd=new FormData(form); const title=String(fd.get('title')||'');
     const poster=await upload(fd.get('poster') as File,'posters');
     const video=await upload(fd.get('video') as File,'video');
     const posterUrl=poster || String(fd.get('poster_url')||'') || null;
     const videoUrl=video || String(fd.get('video_url')||'') || null;
     const payload={title,slug:slugify(String(fd.get('slug')||title)),year:Number(fd.get('year')),type:String(fd.get('type')),roles:String(fd.get('roles')),description:String(fd.get('description')),story:String(fd.get('story')||''),poster_url:posterUrl,hero_video_url:videoUrl,trailer_url:String(fd.get('trailer_url')||'')||null,accent:String(fd.get('accent')||'#7f5b4d'),featured:fd.get('featured')==='on',published:fd.get('published')==='on',sort_order:projects.length+1};
     const {data,error}=await supabase.from('projects').insert(payload).select().single(); if(error)throw error;
     setProjects(p=>[...p,data as Project]); form.reset(); setStatus('Project published successfully.'); router.refresh();
   }catch(err:any){setStatus(`Could not save project: ${err.message||err}`)}finally{setBusy(false)}
 }

 async function createTrack(e:React.FormEvent<HTMLFormElement>){
   e.preventDefault(); if(!supabase)return; setBusy(true); setStatus('');
   try{
     const form=e.currentTarget; const fd=new FormData(form); const title=String(fd.get('title')||'');
     const audio=await upload(fd.get('audio') as File,'audio'); const art=await upload(fd.get('artwork') as File,'artwork');
     const selectedProject=String(fd.get('project_id')||'');
     const payload={title,slug:slugify(title),genre:String(fd.get('genre')),duration:String(fd.get('duration')||''),audio_url:audio,artwork_url:art,project_id:selectedProject||null,featured:true,published:true,sort_order:tracks.length+1};
     const {data,error}=await supabase.from('tracks').insert(payload).select().single(); if(error)throw error;
     setTracks(t=>[...t,data as Track]); form.reset(); setStatus('Track added and linked successfully.'); router.refresh();
   }catch(err:any){setStatus(`Could not save track: ${err.message||err}`)}finally{setBusy(false)}
 }

 async function remove(kind:'projects'|'tracks',id:string){
   if(!supabase||!confirm('Delete this item?'))return; const {error}=await supabase.from(kind).delete().eq('id',id); if(error){setStatus(error.message);return}
   if(kind==='projects')setProjects(p=>p.filter(x=>x.id!==id)); else setTracks(t=>t.filter(x=>x.id!==id)); router.refresh();
 }

 async function signOut(){if(supabase)await supabase.auth.signOut();router.replace('/admin/login');router.refresh()}

 return <main className="admin-shell"><div className="admin-wrap">
   <div className="admin-top"><div><p>Signed in · {email}</p><h1>Content Studio</h1></div><div className="admin-actions"><a className="admin-button" href="/" target="_blank">View site ↗</a><button className="admin-button" onClick={signOut}>Sign out</button></div></div>
   {status&&<div className="admin-status">{status}</div>}
   <div className="admin-grid">
    <section className="admin-panel"><h2>Add screen, song or ad project</h2><form className="admin-form" onSubmit={createProject}>
      <label>Project title<input name="title" required/></label><div className="admin-row"><label>Type<select name="type"><option>Film</option><option>Score</option><option>Music</option><option>Commercial</option><option>Documentary</option></select></label><label>Year<input name="year" type="number" defaultValue={new Date().getFullYear()} required/></label></div>
      <label>Your role(s)<input name="roles" placeholder="Composer · Music Producer · Sound Designer" required/></label><label>Short description<textarea name="description" rows={3} placeholder="Describe the work and your sonic contribution." required/></label><label>Story / case study<textarea name="story" rows={5} placeholder="Creative brief, approach, process, result…"/></label>
      <div className="admin-row"><label>Poster / artwork<input name="poster" type="file" accept="image/*"/></label><label>Hero / campaign video<input name="video" type="file" accept="video/*"/></label></div><div className="admin-row"><label>Poster URL (optional)<input name="poster_url" type="url" placeholder="https://…"/></label><label>Streaming video URL<input name="video_url" type="url" placeholder="Mux / Cloudinary / CDN URL"/></label></div><label>Trailer / campaign URL<input name="trailer_url" type="url" placeholder="YouTube / Vimeo / external link"/></label><div className="admin-row"><label>Accent colour<input name="accent" type="color" defaultValue="#7f5b4d"/></label><label>Custom slug<input name="slug" placeholder="auto-generated if empty"/></label></div>
      <div className="admin-row"><label><span>Featured on screen-work section</span><input name="featured" type="checkbox" defaultChecked/></label><label><span>Published</span><input name="published" type="checkbox" defaultChecked/></label></div><button className="admin-submit" disabled={busy}>{busy?'Uploading…':'Publish project ↗'}</button>
    </form><div className="admin-items">{projects.map(p=><div className="admin-item" key={p.id}><div><strong>{p.title}</strong><small>{p.type} · {p.year} · {p.published?'Published':'Draft'}</small></div><button className="admin-button" onClick={()=>remove('projects',p.id)}>Delete</button></div>)}</div></section>
    <section className="admin-panel"><h2>Add audio</h2><form className="admin-form" onSubmit={createTrack}>
      <label>Track / song title<input name="title" required/></label><div className="admin-row"><label>Genre / mood<input name="genre" placeholder="ALT R&B / SOUL" required/></label><label>Duration<input name="duration" placeholder="03:26"/></label></div>
      <label>Link to a song project<select name="project_id" defaultValue=""><option value="">Standalone score / cue</option>{musicProjects.map((p)=><option key={p.id} value={p.id}>{p.title} · {p.year}</option>)}</select><small>Create the Music project first, then link its playable master here.</small></label>
      <label>Audio file<input name="audio" type="file" accept="audio/*" required/></label><label>Artwork<input name="artwork" type="file" accept="image/*"/></label><button className="admin-submit" disabled={busy}>{busy?'Uploading…':'Add audio ↗'}</button>
    </form><div className="admin-items">{tracks.map(t=><div className="admin-item" key={t.id}><div><strong>{t.title}</strong><small>{t.genre} · {t.duration||'—'}{t.project_id?' · Linked release':''}</small></div><button className="admin-button" onClick={()=>remove('tracks',t.id)}>Delete</button></div>)}</div></section>
   </div>
 </div></main>
}
