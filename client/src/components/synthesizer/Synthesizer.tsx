import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as Tone from 'tone';

interface SynthesizerProps {
  className?: string;
}

const Synthesizer: React.FC<SynthesizerProps> = ({ className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [oscillatorType, setOscillatorType] = useState<'sine' | 'square' | 'sawtooth' | 'triangle'>('sine');
  const [attack, setAttack] = useState([0.1]);
  const [decay, setDecay] = useState([0.2]);
  const [sustain, setSustain] = useState([0.3]);
  const [release, setRelease] = useState([0.5]);
  const [volume, setVolume] = useState([0.7]);
  const [filterFreq, setFilterFreq] = useState([2000]);
  const [filterQ, setFilterQ] = useState([1]);
  const [distortion, setDistortion] = useState([0]);
  const [reverb, setReverb] = useState([0]);
  
  const synthRef = useRef<Tone.Synth | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);
  const distortionRef = useRef<Tone.Distortion | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);

  const notes = [
    { note: 'C4', key: 'a', color: 'bg-white', textColor: 'text-black', type: 'white' },
    { note: 'C#4', key: 'w', color: 'bg-black', textColor: 'text-white', type: 'black' },
    { note: 'D4', key: 's', color: 'bg-white', textColor: 'text-black', type: 'white' },
    { note: 'D#4', key: 'e', color: 'bg-black', textColor: 'text-white', type: 'black' },
    { note: 'E4', key: 'd', color: 'bg-white', textColor: 'text-black', type: 'white' },
    { note: 'F4', key: 'f', color: 'bg-white', textColor: 'text-black', type: 'white' },
    { note: 'F#4', key: 't', color: 'bg-black', textColor: 'text-white', type: 'black' },
    { note: 'G4', key: 'g', color: 'bg-white', textColor: 'text-black', type: 'white' },
    { note: 'G#4', key: 'y', color: 'bg-black', textColor: 'text-white', type: 'black' },
    { note: 'A4', key: 'h', color: 'bg-white', textColor: 'text-black', type: 'white' },
    { note: 'A#4', key: 'u', color: 'bg-black', textColor: 'text-white', type: 'black' },
    { note: 'B4', key: 'j', color: 'bg-white', textColor: 'text-black', type: 'white' },
    { note: 'C5', key: 'k', color: 'bg-white', textColor: 'text-black', type: 'white' },
  ];

  useEffect(() => {
    // Initialize synthesizer with effects chain
    filterRef.current = new Tone.Filter({
      frequency: filterFreq[0],
      Q: filterQ[0],
      type: 'lowpass',
    });

    distortionRef.current = new Tone.Distortion(distortion[0]);
    reverbRef.current = new Tone.Reverb(0.5);

    synthRef.current = new Tone.Synth({
      oscillator: {
        type: oscillatorType,
      },
      envelope: {
        attack: attack[0],
        decay: decay[0],
        sustain: sustain[0],
        release: release[0],
      },
    }).chain(filterRef.current, distortionRef.current, reverbRef.current, Tone.Destination);

    synthRef.current.volume.value = Tone.gainToDb(volume[0]);

    return () => {
      synthRef.current?.dispose();
      filterRef.current?.dispose();
      distortionRef.current?.dispose();
      reverbRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.set({
        oscillator: { type: oscillatorType },
        envelope: {
          attack: attack[0],
          decay: decay[0],
          sustain: sustain[0],
          release: release[0],
        },
      });
    }
  }, [oscillatorType, attack, decay, sustain, release]);

  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.volume.value = Tone.gainToDb(volume[0]);
    }
  }, [volume]);

  useEffect(() => {
    if (filterRef.current) {
      filterRef.current.frequency.value = filterFreq[0];
      filterRef.current.Q.value = filterQ[0];
    }
  }, [filterFreq, filterQ]);

  useEffect(() => {
    if (distortionRef.current) {
      distortionRef.current.distortion = distortion[0];
    }
  }, [distortion]);

  useEffect(() => {
    if (reverbRef.current) {
      const reverbValue = Math.max(0.1, reverb[0]);
      reverbRef.current.roomSize.value = reverbValue;
    }
  }, [reverb]);

  const playNote = async (note: string) => {
    if (synthRef.current) {
      await Tone.start();
      synthRef.current.triggerAttackRelease(note, '8n');
    }
  };

  const startNote = async (note: string) => {
    if (synthRef.current) {
      await Tone.start();
      synthRef.current.triggerAttack(note);
    }
  };

  const stopNote = (note: string) => {
    if (synthRef.current) {
      synthRef.current.triggerRelease();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const noteObj = notes.find(n => n.key === event.key.toLowerCase());
      if (noteObj && !event.repeat) {
        startNote(noteObj.note);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const noteObj = notes.find(n => n.key === event.key.toLowerCase());
      if (noteObj) {
        stopNote(noteObj.note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [notes]);

  return (
    <Card className={`w-full max-w-6xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Synthesizer</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Oscillator Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Oscillator Type</label>
            <Select value={oscillatorType} onValueChange={setOscillatorType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sine">Sine</SelectItem>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="sawtooth">Sawtooth</SelectItem>
                <SelectItem value="triangle">Triangle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Volume</label>
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
            <span className="text-xs text-gray-500">{Math.round(volume[0] * 100)}%</span>
          </div>
        </div>

        {/* ADSR Envelope */}
        <div>
          <h3 className="text-lg font-semibold mb-3">ADSR Envelope</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Attack</label>
              <Slider
                value={attack}
                onValueChange={setAttack}
                max={2}
                min={0}
                step={0.1}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{attack[0]}s</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Decay</label>
              <Slider
                value={decay}
                onValueChange={setDecay}
                max={2}
                min={0}
                step={0.1}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{decay[0]}s</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sustain</label>
              <Slider
                value={sustain}
                onValueChange={setSustain}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{sustain[0]}</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Release</label>
              <Slider
                value={release}
                onValueChange={setRelease}
                max={4}
                min={0}
                step={0.1}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{release[0]}s</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Filter</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Frequency</label>
              <Slider
                value={filterFreq}
                onValueChange={setFilterFreq}
                max={5000}
                min={50}
                step={50}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{filterFreq[0]}Hz</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Resonance (Q)</label>
              <Slider
                value={filterQ}
                onValueChange={setFilterQ}
                max={30}
                min={0.1}
                step={0.1}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{filterQ[0]}</span>
            </div>
          </div>
        </div>

        {/* Effects */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Effects</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Distortion</label>
              <Slider
                value={distortion}
                onValueChange={setDistortion}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{distortion[0]}</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Reverb</label>
              <Slider
                value={reverb}
                onValueChange={setReverb}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{reverb[0]}</span>
            </div>
          </div>
        </div>

        {/* Virtual Keyboard */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Virtual Keyboard</h3>
          <div className="flex justify-center">
            <div className="relative">
              <div className="flex">
                {notes.map((noteObj, index) => (
                  <button
                    key={noteObj.note}
                    onMouseDown={() => startNote(noteObj.note)}
                    onMouseUp={() => stopNote(noteObj.note)}
                    onMouseLeave={() => stopNote(noteObj.note)}
                    className={`
                      ${noteObj.color} ${noteObj.textColor} border border-gray-300 
                      ${noteObj.type === 'white' ? 'h-32 w-12' : 'h-20 w-8 absolute -mt-0 z-10'}
                      flex items-end justify-center pb-2 text-xs font-medium
                      hover:bg-gray-100 active:bg-gray-200 transition-colors
                      ${noteObj.type === 'black' ? 'hover:bg-gray-800 active:bg-gray-700' : ''}
                    `}
                    style={
                      noteObj.type === 'black'
                        ? { left: `${(index - 0.5) * 48 - 16}px` }
                        : {}
                    }
                  >
                    {noteObj.key.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center mt-2">
            Use keyboard keys or click/tap to play notes
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Synthesizer;