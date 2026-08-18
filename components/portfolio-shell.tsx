'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Headphones, Menu, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import { useMemo, useRef, useState, type CSSProperties } from 'react';
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

  const screenProjects = useMemo(
    () => projects.filter((p) => !['Music', 'Commercial'].includes(p.type)),
    [projects]
  );
  const featured = useMemo(() => screenProjects.filter((p) => p.featured !== false), [screenProjects]);
  const musicProjects = useMemo(() => projects.filter((p) => p.type === 'Music'), [projects]);
  const commercials = useMemo(() => projects.filter((p) => p.type === 'Commercial'), [projects]);

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
        if (el) el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }}
    >
      <div className={`cursor-orb ${cursorVisible ? 'is-visible' : ''}`}><span>{cursorLabel}</span></div>
      <div className="grain" aria-hidden="true" />

      <header className={`nav-shell ${scrolled ? 'is-scrolled' : ''}`}>
        <a className="brand" href="#top">{settings.artist_name}</a>
        <nav className="desktop-nav">
          <a href="#work">Screen</a><a href="#songs">Songs</a><a href="#commercials">Ads</a><a href="#scores">Scores</a><a href="#about">About</a>
          <Link className="nav-admin" href="/admin">Studio</Link>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={20}/></button>
      </header>

      <AnimatePresence>
        {menuOpen && <motion.div className="mobile-menu" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu"><X/></button>
          {['work','songs','commercials','scores','about'].map((item, i) => (
            <motion.a key={item} href={`#${item}`} onClick={() => setMenuOpen(false)} initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:.08*i}}>
              {item === 'work' ? 'screen' : item === 'commercials' ? 'ads' : item}
            </motion.a>
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
            <a className="button-primary" href="#work">Explore screen work <ArrowUpRight size={16}/></a>
            <button className="button-text" onClick={() => tracks[0] && startTrack(tracks[0])}>Listen <Headphones size={16}/></button>
          </motion.div>
        </div>
        <div className="hero-index">MUSIC / SOUND / PICTURE</div>
        <a href="#manifesto" className="scroll-cue">Scroll to enter <ArrowDown size={15}/></a>
      </section>

      <section id="manifesto" className="manifesto section-pad">
        <div className="manifesto-kicker">Practice</div>
        {['COMPOSER','MUSIC PRODUCER','SOUND DESIGNER'].map((label,i)=>(
          <motion.div className="manifesto-row" key={label} initial={{opacity:.15,x:i%2?70:-70}} whileInView={{opacity:1,x:0}} viewport={{amount:.55}} transition={{duration:.75}}>
            <span>{label}</span><small>0{i+1}</small>
          </motion.div>
        ))}
      </section>

      <div className="practice-index">
        {[
          ['01','FOR FILM','Original score · sonic storytelling'],
          ['02','FOR RECORDS','Production · arrangement · vocal worlds'],
          ['03','FOR BRANDS','Composition · sound design · sonic identity']
        ].map(([n,t,d]) => <div className="practice-row" key={n}><span>{n}</span><strong>{t}</strong><p>{d}</p><ArrowUpRight size={16}/></div>)}
      </div>

      <section id="work" className="section-pad work-section">
        <div className="section-heading">
          <p>Selected screen work</p><h2>Sound that lives<br/>inside the picture.</h2><span>Film · Series · Documentary</span>
        </div>
        <div className="project-stack">
          {featured.map((project,index)=><ProjectCard key={project.id} project={project} index={index} setCursorLabel={setCursorLabel} setCursorVisible={setCursorVisible}/>)}
        </div>
      </section>

      <section id="songs" className="music-showcase section-pad">
        <div className="music-head">
          <div><p className="eyebrow">Records I&apos;ve produced</p><p className="music-intro">Songs are their own worlds. Explore selected records through the production, arrangement and sonic decisions behind them.</p></div>
          <h2>Made to live<br/><em>beyond the session.</em></h2>
        </div>
        <div className="release-grid">
          {musicProjects.length ? musicProjects.map((project,index) => {
            const track = tracks.find((t) => t.project_id === project.id || t.project_id === project.slug);
            return <ReleaseCard key={project.id} project={project} track={track} index={index} onPlay={startTrack}/>;
          }) : tracks.slice(0,3).map((track,index) => <ReleaseCard key={track.id} track={track} index={index} onPlay={startTrack}/>)}
        </div>
        <div className="music-note"><strong>Production is storytelling too.</strong><p>The vocal can feel closer. The chorus can arrive harder. A tiny texture can become the memory that survives the song. This section is built to showcase not only what was released, but what I contributed to the record.</p></div>
      </section>

      <section id="commercials" className="commercial-showcase section-pad">
        <div className="commercial-head">
          <div><p className="eyebrow">Commercial & brand work</p><p>Composition + sound design</p></div>
          <h2>Turn the<br/><em>sound on.</em></h2>
        </div>
        <div className="campaign-reel">
          {commercials.map((project,index)=><CommercialCard key={project.id} project={project} index={index}/>) }
        </div>
        <div className="campaign-strip"><div className="campaign-strip-inner">
          <span>ORIGINAL MUSIC</span><b>·</b><span>SOUND DESIGN</span><b>·</b><span>SONIC BRANDING</span><b>·</b><span>MIX</span><b>·</b><span>ORIGINAL MUSIC</span><b>·</b><span>SOUND DESIGN</span><b>·</b><span>SONIC BRANDING</span><b>·</b><span>MIX</span>
        </div></div>
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
              ['01','THE SCENE','I listen first: pace, dialogue, silence and emotional temperature.'],['02','THE MOTIF','A musical idea finds the emotional centre.'],['03','THE WORLD','Score and sound design create one sonic language.'],['04','THE FINAL MIX','Music, dialogue and detail become one finished experience.']
            ].map(([n,t,d])=><motion.div className="process-step" key={n} whileInView={{opacity:1,x:0}} initial={{opacity:.25,x:18}} viewport={{amount:.7}}><span>{n}</span><div><strong>{t}</strong><p>{d}</p></div></motion.div>)}
          </div>
        </div>
      </section>

      <section id="filmography" className="section-pad filmography">
        <div className="section-heading compact"><p>Screen credits</p><h2>Selected picture work.</h2></div>
        <div className="credits">
          {screenProjects.map((p)=><Link href={`/work/${p.slug}`} className="credit-row" key={p.id}>
            <span>{p.year}</span><strong>{p.title}</strong><small>{p.type.toUpperCase()}</small><p>{p.roles}</p><ArrowUpRight size={16}/>
          </Link>)}
        </div>
      </section>

      <section id="about" className="about section-pad">
        <motion.div className="portrait-block" initial={{clipPath:'inset(100% 0 0 0)'}} whileInView={{clipPath:'inset(0% 0 0 0)'}} viewport={{once:true,amount:.3}} transition={{duration:1}}/>
        <div className="about-copy"><p className="eyebrow">About</p><h2>Between music<br/>and meaning.</h2><p>{settings.bio}</p>
          <div className="socials">{[['IMDb',settings.imdb_url],['Vimeo',settings.vimeo_url],['Spotify',settings.spotify_url],['Instagram',settings.instagram_url]].map(([name,url])=>url&&<a href={url} key={name} target="_blank" rel="noreferrer">{name} ↗</a>)}</div>
        </div>
      </section>

      <section className="contact section-pad">
        <p className="eyebrow">Collaborate</p><h2>Let&apos;s make<br/><em>something worth hearing.</em></h2><a className="contact-email" href={`mailto:${settings.email}`}>{settings.email} ↗</a>
        <footer><span>{settings.artist_name} © {new Date().getFullYear()}</span><span>Composition · Production · Sound Design</span><a href="#top">Back to top ↑</a></footer>
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
      <div className="project-media" style={{'--accent':project.accent || '#7f5b4d'} as CSSProperties}>
        {project.hero_video_url ? <video src={project.hero_video_url} muted loop playsInline autoPlay preload="metadata"/> : project.poster_url ? <img src={project.poster_url} alt=""/> : <div className="project-placeholder"/>}
        <div className="project-shade"/><span className="project-verb">{project.type==='Score'?'Hear score':'View project'} <ArrowUpRight size={16}/></span>
      </div>
      <div className="project-meta"><span>{String(index+1).padStart(2,'0')}</span><h3>{project.title}</h3><p>{project.type} · {project.year}</p></div>
    </Link>
  </motion.article>
}

function ReleaseCard({project,track,index,onPlay}:{project?:Project;track?:Track;index:number;onPlay:(track:Track)=>void}) {
  if (!project && !track) return null;
  const title = project?.title || track?.title || 'Untitled';
  const artwork = track?.artwork_url || project?.poster_url;
  const role = project?.roles || track?.genre || 'Music Production';
  const year = project?.year;
  const wave = [32,68,45,84,54,95,43,76,61,88,38,72,48,92,58,80,41,66,36,74];

  return <motion.article className="release-card" initial={{opacity:0,y:55}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.7,delay:index*.07}}>
    <div className="release-art">
      {artwork ? <img src={artwork} alt={`${title} artwork`}/> : <div className="project-placeholder"/>}
      <div className="release-wave" aria-hidden="true">{wave.map((h,i)=><i key={i} style={{height:`${h}%`}}/>)}</div>
      <button className="release-play" aria-label={`Play ${title}`} onClick={()=>track&&onPlay(track)} disabled={!track}><Play size={18}/></button>
    </div>
    <div className="release-meta"><div><h3>{title}</h3><p>{role}</p></div><small>{year || track?.duration || String(index+1).padStart(2,'0')}</small></div>
  </motion.article>;
}

function CommercialCard({project,index}:{project:Project;index:number}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn,setSoundOn] = useState(false);
  const toggleSound = async () => {
    if (!videoRef.current) return;
    videoRef.current.muted = soundOn;
    setSoundOn(!soundOn);
    if (!soundOn) { try { await videoRef.current.play(); } catch {} }
  };
  const roles = project.roles.split('·').map((r)=>r.trim()).filter(Boolean);

  return <motion.article className="campaign-card" initial={{opacity:.45}} whileInView={{opacity:1}} viewport={{amount:.45}} transition={{duration:.8}}>
    <div className="campaign-media">
      {project.hero_video_url ? <video ref={videoRef} src={project.hero_video_url} muted loop playsInline autoPlay preload="metadata"/> : project.poster_url ? <img src={project.poster_url} alt=""/> : <div className="project-placeholder"/>}
    </div>
    <span className="campaign-number">CAMPAIGN {String(index+1).padStart(2,'0')} · {project.year}</span>
    <div className="campaign-copy">
      <div><h3>{project.title}</h3><div className="campaign-tags">{roles.map((role)=><span key={role}>{role}</span>)}</div></div>
      <p>{project.description}</p>
      {project.hero_video_url ? <button className="sound-on" onClick={toggleSound}>{soundOn?<Volume2 size={18}/>:<VolumeX size={18}/>}<span>{soundOn?'Sound on':'Hear it'}</span></button> : <Link className="sound-on" href={`/work/${project.slug}`}><ArrowUpRight size={18}/><span>Open</span></Link>}
    </div>
  </motion.article>;
}
