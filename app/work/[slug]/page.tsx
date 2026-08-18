import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getProject, getProjects } from '@/lib/content';
import SoundLens from '@/components/sound-lens';

export const revalidate = 60;

export async function generateStaticParams(){
  const projects=await getProjects(); return projects.map(p=>({slug:p.slug}));
}

export default async function WorkPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const project=await getProject(slug); if(!project)notFound();
 const facts=Object.entries(project.credits||{});
 const supportsSoundLens=['Film','Documentary'].includes(project.type) && Boolean(project.hero_video_url) && Boolean(project.score_stem_url || project.sound_design_stem_url);
 return <main className="work-page">
   <section className="work-hero" style={{background:project.accent||'#17110f'}}>
    <Link href="/#work" className="back-link"><ArrowLeft size={13}/> Portfolio</Link>
    {project.hero_video_url?<video src={project.hero_video_url} autoPlay muted loop playsInline/>:project.poster_url?<img src={project.poster_url} alt={`${project.title} artwork`}/>:null}
    <div className="work-hero-copy"><p>{project.type} · {project.year} · {project.roles}</p><h1>{project.title}</h1></div>
   </section>
   <article className="work-body">
    <div className="work-intro"><h2>The work.</h2><div><p>{project.description}</p>{project.story&&<p>{project.story}</p>}</div></div>

    {supportsSoundLens&&project.hero_video_url&&<SoundLens
      title={project.title}
      videoUrl={project.hero_video_url}
      scoreUrl={project.score_stem_url}
      soundDesignUrl={project.sound_design_stem_url}
      note={project.sound_lens_note}
    />}

    {facts.length>0&&<div className="work-facts">{facts.map(([label,value])=><div className="fact-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>}
    {project.trailer_url&&<div className="work-section-copy"><p className="eyebrow">Watch</p><h2>Trailer.</h2><p><a href={project.trailer_url} target="_blank" rel="noreferrer">Open trailer <ArrowUpRight size={14}/></a></p></div>}
    {!!project.awards?.length&&<div className="work-section-copy"><p className="eyebrow">Recognition</p><h2>Awards & festivals.</h2><div className="award-list">{project.awards.map(a=><div key={a}>{a}</div>)}</div></div>}
    <div className="work-footer"><Link href="/#work">← All work</Link><Link href="/#scores">Listen to scores ↗</Link></div>
   </article>
 </main>
}
