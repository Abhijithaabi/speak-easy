import React, { useState, useRef } from "react";
import { TranscriptLine } from "./StudioTranscript";

interface SessionPlaybackProps {
  audioUrl: string | null;
  transcripts: TranscriptLine[];
}

export default function SessionPlayback({ audioUrl, transcripts }: SessionPlaybackProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  // THE FIX: Chrome WebM Duration Hack
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      if (audioRef.current.duration === Infinity) {
        // Force Chrome to fetch the end of the file to calculate duration
        audioRef.current.currentTime = 1e101;
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            setDuration(audioRef.current.duration);
          }
        }, 200);
      } else {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skip = (amount: number) => {
    if (audioRef.current) {
      let newTime = audioRef.current.currentTime + amount;
      newTime = Math.max(0, Math.min(newTime, duration));
      audioRef.current.currentTime = newTime;
    }
  };

  // THE FIX: Math safeguard to prevent NaN errors
  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const finalTranscripts = transcripts.filter(t => !t.isInterim && !t.isTranscribing);

  return (
    <div className="bg-surface-container-lowest rounded-[2rem] p-10 shadow-sm border border-outline-variant/10 mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-on-surface">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>settings_voice</span>
        Session Playback
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="flex flex-col justify-center">
          {audioUrl ? (
            <>
              <audio 
                ref={audioRef} 
                src={audioUrl} 
                onTimeUpdate={handleTimeUpdate} 
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
              <div className="bg-surface-container-low rounded-3xl p-8 flex flex-col gap-6 border border-outline-variant/5">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={togglePlay}
                    className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dim transition-all active:scale-95 shadow-md flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {isPlaying ? "pause" : "play_arrow"}
                    </span>
                  </button>
                  <div className="flex-grow flex flex-col">
                    <div className="flex justify-between text-sm font-bold text-on-surface-variant mb-3">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max={duration || 100} 
                      value={currentTime} 
                      onChange={handleSeek}
                      className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary"
                      style={{
                        background: `linear-gradient(to right, #366762 ${(currentTime / (duration || 1)) * 100}%, #e7e9e4 ${(currentTime / (duration || 1)) * 100}%)`
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center px-2 border-t border-outline-variant/10 pt-4 mt-2">
                  <span className="text-sm font-medium text-on-surface-variant italic">Mixed Audio Recording</span>
                  <div className="flex gap-6">
                    <button onClick={() => skip(-10)} className="text-primary hover:scale-110 transition-transform flex items-center">
                      <span className="material-symbols-outlined text-2xl">replay_10</span>
                    </button>
                    <button onClick={() => skip(10)} className="text-primary hover:scale-110 transition-transform flex items-center">
                      <span className="material-symbols-outlined text-2xl">forward_10</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
             <div className="bg-surface-container-low rounded-3xl p-8 flex items-center justify-center h-full text-on-surface-variant italic text-sm">
                No audio recorded for this session.
             </div>
          )}
        </div>

        <div className="max-h-[250px] overflow-y-auto pr-6 custom-scrollbar flex flex-col">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary mb-6 flex-shrink-0">Transcript</h3>
          <div className="space-y-6 flex-1">
            {finalTranscripts.length > 0 ? finalTranscripts.map((msg, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className={`text-[10px] font-bold italic ${msg.role === 'partner' ? 'text-primary' : 'text-secondary-dim'}`}>
                  {msg.role === 'partner' ? 'Partner' : 'You'}
                </span>
                <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-surface-container-low border border-outline-variant/5' : ''}`}>
                  <p className="text-sm leading-relaxed text-on-surface-variant font-medium">
                    "{msg.text}"
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-sm italic text-on-surface-variant/50">Transcript empty.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}