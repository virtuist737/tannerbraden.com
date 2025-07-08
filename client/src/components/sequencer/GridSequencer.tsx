import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import * as Tone from 'tone';

interface GridSequencerProps {
  className?: string;
}

const GridSequencer: React.FC<GridSequencerProps> = ({ className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState([120]);
  const [currentStep, setCurrentStep] = useState(0);
  const [pattern, setPattern] = useState<boolean[][]>([]);
  const [volume, setVolume] = useState([0.7]);
  
  const sequenceRef = useRef<Tone.Sequence | null>(null);
  const synthsRef = useRef<Tone.Synth[]>([]);
  const transportRef = useRef<typeof Tone.Transport>(Tone.Transport);

  const tracks = [
    { name: 'Kick', color: 'bg-red-500', note: 'C1' },
    { name: 'Snare', color: 'bg-blue-500', note: 'D1' },
    { name: 'Hi-Hat', color: 'bg-green-500', note: 'F#1' },
    { name: 'Open Hat', color: 'bg-yellow-500', note: 'A1' },
    { name: 'Clap', color: 'bg-purple-500', note: 'E1' },
    { name: 'Crash', color: 'bg-pink-500', note: 'C2' },
    { name: 'Ride', color: 'bg-indigo-500', note: 'D2' },
    { name: 'Tom', color: 'bg-orange-500', note: 'G1' },
  ];

  const steps = 16;

  useEffect(() => {
    // Initialize pattern
    const initialPattern = tracks.map(() => new Array(steps).fill(false));
    setPattern(initialPattern);

    // Initialize synths
    synthsRef.current = tracks.map(() => new Tone.Synth({
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.3,
        release: 0.3,
      },
    }).toDestination());

    // Initialize transport
    transportRef.current.bpm.value = bpm[0];

    return () => {
      // Cleanup
      synthsRef.current.forEach(synth => synth.dispose());
      if (sequenceRef.current) {
        sequenceRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    transportRef.current.bpm.value = bpm[0];
  }, [bpm]);

  useEffect(() => {
    synthsRef.current.forEach(synth => {
      synth.volume.value = Tone.gainToDb(volume[0]);
    });
  }, [volume]);

  const toggleStep = (trackIndex: number, stepIndex: number) => {
    setPattern(prev => {
      const newPattern = [...prev];
      newPattern[trackIndex][stepIndex] = !newPattern[trackIndex][stepIndex];
      return newPattern;
    });
  };

  const playSequence = async () => {
    if (!isPlaying) {
      await Tone.start();
      
      sequenceRef.current = new Tone.Sequence(
        (time, step) => {
          setCurrentStep(step);
          
          tracks.forEach((track, trackIndex) => {
            if (pattern[trackIndex] && pattern[trackIndex][step]) {
              synthsRef.current[trackIndex].triggerAttackRelease(track.note, '8n', time);
            }
          });
        },
        [...Array(steps)].map((_, i) => i),
        '16n'
      );

      sequenceRef.current.start();
      transportRef.current.start();
      setIsPlaying(true);
    }
  };

  const stopSequence = () => {
    if (isPlaying) {
      transportRef.current.stop();
      if (sequenceRef.current) {
        sequenceRef.current.dispose();
        sequenceRef.current = null;
      }
      setIsPlaying(false);
      setCurrentStep(0);
    }
  };

  const pauseSequence = () => {
    if (isPlaying) {
      transportRef.current.pause();
      setIsPlaying(false);
    }
  };

  const clearPattern = () => {
    setPattern(tracks.map(() => new Array(steps).fill(false)));
    setCurrentStep(0);
  };

  return (
    <Card className={`w-full max-w-6xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Grid Sequencer</CardTitle>
        
        {/* Transport Controls */}
        <div className="flex justify-center gap-4 mt-4">
          <Button
            onClick={playSequence}
            disabled={isPlaying}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Play
          </Button>
          
          <Button
            onClick={pauseSequence}
            disabled={!isPlaying}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Pause className="w-4 h-4" />
            Pause
          </Button>
          
          <Button
            onClick={stopSequence}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Stop
          </Button>
          
          <Button
            onClick={clearPattern}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </Button>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-8 mt-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">BPM:</label>
            <Slider
              value={bpm}
              onValueChange={setBpm}
              max={180}
              min={60}
              step={1}
              className="w-32"
            />
            <span className="text-sm w-12">{bpm[0]}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Volume:</label>
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={1}
              min={0}
              step={0.1}
              className="w-32"
            />
            <span className="text-sm w-12">{Math.round(volume[0] * 100)}%</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Step Indicators */}
        <div className="flex justify-between mb-4">
          <div className="w-24"></div>
          {[...Array(steps)].map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium ${
                i === currentStep && isPlaying
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Sequencer Grid */}
        <div className="space-y-2">
          {tracks.map((track, trackIndex) => (
            <div key={trackIndex} className="flex items-center gap-2">
              <div className="w-24 text-right">
                <div className={`inline-block px-2 py-1 rounded text-white text-xs font-medium ${track.color}`}>
                  {track.name}
                </div>
              </div>
              
              <div className="flex gap-1">
                {[...Array(steps)].map((_, stepIndex) => (
                  <button
                    key={stepIndex}
                    onClick={() => toggleStep(trackIndex, stepIndex)}
                    className={`w-8 h-8 rounded border-2 transition-all ${
                      pattern[trackIndex] && pattern[trackIndex][stepIndex]
                        ? `${track.color} border-white shadow-md`
                        : stepIndex === currentStep && isPlaying
                        ? 'bg-orange-200 border-orange-400'
                        : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GridSequencer;