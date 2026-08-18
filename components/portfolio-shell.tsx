'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Menu, Pause, Play, Volume2, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import type { Project, SiteSettings, Track } from '@/lib/types';

type Props = { projects: Project[]; tracks: Track[]; settings: SiteSettings };

type Playing = Track | null;

export default function PortfolioShell({ projects, tracks, settings }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [playing, setPlaying] = useState<Playing>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cursorLabel, setCursorLabel] = useState('VIEW');
  const [cursorVisible, setCursorVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 900], [0, 90]);
  const heroScale = useTransform(scrollY, [0, 900], [1, 1.08]);
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24));

  const featured = useMemo(() => projects.filter(p => p.featured !== false), [projects]);

  const startTrack = async (track: Track) => {
    setPlaying(track);
    setIsPlaying(Boolean(track.audio_url));
    requestAnimationFrame(async () => {
      if (!audioRef.current || !track.audio_url) return;
      audioRef.current.src = track.audio_url;
      try { await audioRef.current.play(); } catch { setIsPlaying(false); }
    });
  };

  const toggle = async () => {
    if (!audioRef.current || !playing?.audio_url) return;
    if (audioRef.current.paused) { await audioRef.current.play(); setIsPlaying(true); }
    else { audioRef.current.pause(); setIsPlaying(false); }
  };

  return (
    <main
      className="site-shell"
      onMouseMove={(e) => {
        const el = document.querySelector('.cursor-orb') as HTMLElement | null;
        if (el) { el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`; }
      }}
    >
      <div className={`cursor-orb ${cursorVisible ? 'is-visible' : ''}`}><span>{cursorLabel}</span></div>
      <div className="grain" aria-hidden="true" />

      <header className={`nav-shell ${scrolled ? 'is-scrolled' : ''}`}>
        <a className="brand" href="#top">{settings.artist_name}</a>
        <nav className="desktop-nav">
          <a href="#work">Work</a><a href="#scores">Scores</a><a href="#filmography">Filmography</a><a href="#about">About</a>
          <Link className="nav-admin" href="/admin">Studio</Link>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={20}/></button>
      </header>

      <AnimatePresence>
        {menuOpen && <motion.div className="mobile-menu" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu"><X/></button>
          {['work','scores','filmography','about'].map((item, i) => (
            <motion.a key={item} href={`#${item}`} onClick={() => setMenuOpen(false)} initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:.08*i}}>{item}</motion.a>
          ))}
          <Link href="/admin">private studio ↗</Link>
        </motion.div>}
      </AnimatePresence>

      <section id="top" className="hero">
        <motion.div className="hero-image" style={{ y: heroY, scale: heroScale }}>
          <div className="hero-image-layer hero-a"/><div className="hero-image-layer hero-b"/><div className="hero-image-layer hero-c"/>
        </motion.div>
        <div className="hero-vignette" />
        <div className="hero-copy">
          <motion.p className="eyebrow" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.35}}>{settings.eyebrow}</motion.p>
          <motion.h1 initial={{opacity:0,y:45}} animate={{opacity:1,y:0}} transition={{delay:.5,duration:.9}}>
            {settings.hero_line_1}<br/><em>{settings.hero_line_2}</em>
          </motion.h1>
          <motion.div className="hero-actions" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.95}}>
            <a className="button-primary" href="#work">Watch selected work <ArrowUpRight size={16}/></a>
            <button className="button-text" onClick={() => tracks[0] && startTrack(tracks[0])}>Listen to scores <Volume2 size={16}/></button>
          </motion.div>
        </div>
        <div className="hero-index">01 / {String(Math.max(featured.length, 1)).padStart(2,'0')}</div>
        <a href="#manifesto" className="scroll-cue">Scroll to enter <ArrowDown size={15}/></a>
      </section>

      <section id="manifesto" className="manifesto section-pad">
        <div className="manifesto-kicker">Disciplines</div>
        {['FILMMAKER','COMPOSER','SCORE ENGINEER','MUSIC PRODUCER'].map((label,i)=>(
          <motion.div className="manifesto-row" key={label} initial={{opacity:.15,x:i%2?70:-70}} whileInView={{opacity:1,x:0}} viewport={{amount:.55}} transition={{duration:.75}}>
            <span>{label}</span><small>0{i+1}</small>
          </motion.div>
        ))}
      </section>

      <section id="work" className="section-pad work-section">
        <div className="section-heading">
          <p>Selected work</p><h2>Worlds built<br/>for the screen.</h2><span>2023—{new Date().getFullYear()}</span>
        </div>
        <div className="project-stack">
          {featured.map((project,index)=><ProjectCard key={project.id} project={project} index={index} setCursorLabel={setCursorLabel} setCursorVisible={setCursorVisible}/>)}
        </div>
      </section>

      <section id="scores" className="section-pad scores-section">
        <div className="score-heading"><p className="eyebrow">Original music</p><h2>Stories deserve<br/><em>a sound.</em></h2></div>
        <div className="track-list">
          {tracks.map((track,index)=><button key={track.id} className="track-row" onClick={()=>startTrack(track)} onMouseEnter={()=>{setCursorVisible(true);setCursorLabel('PLAY')}} onMouseLeave={()=>setCursorVisible(false)}>
            <span>{String(index+1).padStart(2,'0')}</span><strong>{track.title}</strong><small>{track.genre}</small><b>{track.duration || '—'}</b><Play size={15}/>
          </button>)}
        </div>
      </section>

      <section className="process section-pad">
        <div className="process-copy"><p>From silence to score</p><h2>The music is already hiding inside the picture.</h2></div>
        <div className="process-grid">
          <div className="process-screen"><div className="screen-sun"/><div className="screen-road"/><div className="screen-car"/><span>01:42:17:08</span></div>
          <div className="process-steps">
            {[
              ['01','THE SCENE','Rhythm begins in the edit.'],['02','THE MOTIF','A small idea finds the emotional centre.'],['03','THE ARRANGEMENT','Texture and harmony widen the frame.'],['04','THE FINAL MIX','Picture, dialogue and music become one world.']
            ].map(([n,t,d])=><motion.div className="process-step" key={n} whileInView={{opacity:1,x:0}} initial={{opacity:.25,x:18}} viewport={{amount:.7}}><span>{n}</span><div><strong>{t}</strong><p>{d}</p></div></motion.div>)}
          </div>
        </div>
      </section>

      <section id="filmography" className="section-pad filmography">
        <div className="section-heading compact"><p>Filmography</p><h2>Selected credits.</h2></div>
        <div className="credits">
          {projects.map((p)=><Link href={`/work/${p.slug}`} className="credit-row" key={p.id}>
            <span>{p.year}</span><strong>{p.title}</strong><small>{p.type.toUpperCase()}</small><p>{p.roles}</p><ArrowUpRight size={16}/>
          </Link>)}
        </div>
      </section>

      <section id="about" className="about section-pad">
        <motion.div className="portrait-block" initial={{clipPath:'inset(100% 0 0 0)'}} whileInView={{clipPath:'inset(0% 0 0 0)'}} viewport={{once:true,amount:.3}} transition={{duration:1}}/>
        <div className="about-copy"><p className="eyebrow">About</p><h2>Between image<br/>and sound.</h2><p>{settings.bio}</p>
          <div className="socials">{[['IMDb',settings.imdb_url],['Vimeo',settings.vimeo_url],['Spotify',settings.spotify_url],['Instagram',settings.instagram_url]].map(([name,url])=>url&&<a href={url} key={name} target="_blank" rel="noreferrer">{name} ↗</a>)}</div>
        </div>
      </section>

      <section className="contact section-pad">
        <p className="eyebrow">Collaborate</p><h2>Let&apos;s make<br/><em>something worth feeling.</em></h2><a className="contact-email" href={`mailto:${settings.email}`}>{settings.email} ↗</a>
        <footer><span>{settings.artist_name} © {new Date().getFullYear()}</span><span>Film · Score · Sound</span><a href="#top">Back to top ↑</a></footer>
      </section>

      <AnimatePresence>
        {playing && <motion.div className="player" initial={{y:120}} animate={{y:0}} exit={{y:120}}>
          <button onClick={toggle} aria-label={isPlaying?'Pause':'Play'}>{isPlaying?<Pause size={17}/>:<Play size={17}/>}</button>
          <div><span>Now playing</span><strong>{playing.title}</strong></div>
          <div className="player-line"><span className={isPlaying?'pulse-line active':'pulse-line'}/></div>
          <button onClick={()=>{audioRef.current?.pause();setPlaying(null);setIsPlaying(false)}} aria-label="Close player"><X size={17}/></button>
          <audio ref={audioRef} onEnded={()=>setIsPlaying(false)} />
        </motion.div>}
      </AnimatePresence>
    </main>
  );
}

function ProjectCard({project,index,setCursorLabel,setCursorVisible}:{project:Project;index:number;setCursorLabel:(s:string)=>void;setCursorVisible:(b:boolean)=>void}) {
  return <motion.article className="project-card" initial={{opacity:0,y:70}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.8}}>
    <Link href={`/work/${project.slug}`} className="project-link" onMouseEnter={()=>{setCursorLabel(project.type==='Score'?'HEAR':'OPEN');setCursorVisible(true)}} onMouseLeave={()=>setCursorVisible(false)}>
      <div className="project-media" style={{'--accent':project.accent || '#7f5b4d'} as React.CSSProperties}>
        {project.hero_video_url ? <video src={project.hero_video_url} muted loop playsInline autoPlay preload="metadata"/> : project.poster_url ? <img src={project.poster_url} alt=""/> : <div className="project-placeholder"/>}
        <div className="project-shade"/><span className="project-verb">{project.type==='Score'?'Hear score':'View project'} <ArrowUpRight size={16}/></span>
      </div>
      <div className="project-meta"><span>{String(index+1).padStart(2,'0')}</span><h3>{project.title}</h3><p>{project.type} · {project.year}</p></div>
    </Link>
  </motion.article>
}
