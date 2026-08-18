'use client';

import { Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type Mode = 'picture' | 'score' | 'sound' | 'final';

type Props = {
  videoUrl: string;
  scoreUrl?: string | null;
  soundDesignUrl?: string | null;
  note?: string | null;
  title: string;
};

const labels: Record<Mode, { title: string; caption: string }> = {
  picture: { title: 'Picture', caption: 'The image before the music and designed sound arrive.' },
  score: { title: 'Score', caption: 'Hear the emotional architecture carried by the composition.' },
  sound: { title: 'Sound Design', caption: 'Hear texture, movement, detail and impact shape the frame.' },
  final: { title: 'Final Mix', caption: 'Picture, score and sound design working as one experience.' },
};

export default function SoundLens({ videoUrl, scoreUrl, soundDesignUrl, note, title }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scoreRef = useRef<HTMLAudioElement>(null);
  const soundRef = useRef<HTMLAudioElement>(null);
  const [mode, setMode] = useState<Mode>('picture');
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timecode, setTimecode] = useState('00:00');

  const availableModes = useMemo<Mode[]>(() => {
    const items: Mode[] = ['picture'];
    if (scoreUrl) items.push('score');
    if (soundDesignUrl) items.push('sound');
    if (scoreUrl && soundDesignUrl) items.push('final');
    return items;
  }, [scoreUrl, soundDesignUrl]);

  const syncAudio = () => {
    const video = videoRef.current;
    if (!video) return;
    [scoreRef.current, soundRef.current].forEach((audio) => {
      if (audio && Math.abs(audio.currentTime - video.currentTime) > 0.16) audio.currentTime = video.currentTime;
    });
  };

  const applyMode = async (nextMode: Mode) => {
    setMode(nextMode);
    const video = videoRef.current;
    const score = scoreRef.current;
    const sound = soundRef.current;
    if (!video) return;

    syncAudio();
    const wantsScore = nextMode === 'score' || nextMode === 'final';
    const wantsSound = nextMode === 'sound' || nextMode === 'final';

    if (score) {
      score.volume = wantsScore ? 1 : 0;
      if (playing && scoreUrl) { try { await score.play(); } catch {} }
    }
    if (sound) {
      sound.volume = wantsSound ? 1 : 0;
      if (playing && soundDesignUrl) { try { await sound.play(); } catch {} }
    }
  };

  const toggle = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      syncAudio();
      try {
        await video.play();
        if (scoreRef.current && scoreUrl) await scoreRef.current.play().catch(() => undefined);
        if (soundRef.current && soundDesignUrl) await soundRef.current.play().catch(() => undefined);
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      video.pause();
      scoreRef.current?.pause();
      soundRef.current?.pause();
      setPlaying(false);
    }
  };

  const restart = async () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    if (scoreRef.current) scoreRef.current.currentTime = 0;
    if (soundRef.current) soundRef.current.currentTime = 0;
    if (playing) {
      await videoRef.current.play().catch(() => undefined);
      scoreRef.current?.play().catch(() => undefined);
      soundRef.current?.play().catch(() => undefined);
    }
  };

  useEffect(() => {
    if (scoreRef.current) scoreRef.current.volume = 0;
    if (soundRef.current) soundRef.current.volume = 0;
  }, []);

  return (
    <section className="sound-lens" aria-label={`Sound Lens for ${title}`}>
      <div className="sound-lens-head">
        <div>
          <p className="eyebrow">Sound Lens</p>
          <h2>Hear what changes<br/><em>when sound enters.</em></h2>
        </div>
        <p>{note || 'One scene. Four perspectives. Isolate the sonic layers and hear how the emotional meaning of the picture changes.'}</p>
      </div>

      <div className="sound-lens-stage">
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          playsInline
          preload="metadata"
          onTimeUpdate={(e) => {
            const video = e.currentTarget;
            syncAudio();
            const ratio = video.duration ? video.currentTime / video.duration : 0;
            setProgress(ratio * 100);
            const mins = Math.floor(video.currentTime / 60);
            const secs = Math.floor(video.currentTime % 60);
            setTimecode(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
          }}
          onEnded={() => setPlaying(false)}
        />
        {scoreUrl && <audio ref={scoreRef} src={scoreUrl} preload="metadata" />}
        {soundDesignUrl && <audio ref={soundRef} src={soundDesignUrl} preload="metadata" />}
        <div className="sound-lens-overlay" />
        <div className="sound-lens-status"><span>{timecode}</span><span>{labels[mode].title}</span></div>
        <button className="sound-lens-play" onClick={toggle} aria-label={playing ? 'Pause sound lens' : 'Play sound lens'}>
          {playing ? <Pause size={20}/> : <Play size={20}/>}<span>{playing ? 'Pause' : 'Play scene'}</span>
        </button>
      </div>

      <div className="sound-lens-progress"><span style={{ width: `${progress}%` }} /></div>

      <div className="sound-lens-console">
        <div className="sound-lens-modes">
          {availableModes.map((item, index) => (
            <button key={item} className={mode === item ? 'active' : ''} onClick={() => applyMode(item)}>
              <small>{String(index + 1).padStart(2, '0')}</small>
              <strong>{labels[item].title}</strong>
            </button>
          ))}
        </div>
        <div className="sound-lens-readout">
          <Volume2 size={16}/>
          <div><strong>{labels[mode].title}</strong><p>{labels[mode].caption}</p></div>
          <button onClick={restart} aria-label="Restart scene"><RotateCcw size={15}/></button>
        </div>
      </div>
    </section>
  );
}
