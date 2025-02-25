import { useEffect, useState, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Volume2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const GRID_SIZE = 8;
const DEFAULT_BPM = 120;

const DRUM_TYPES = ['Kick', 'Snare', 'HiHat', 'Crash', 'Tom1', 'Tom2', 'Rim', 'Clap'];

export default function Loop() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [volume, setVolume] = useState(-10);
  const [melodyGrid, setMelodyGrid] = useState(() => 
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))
  );
  const [rhythmGrid, setRhythmGrid] = useState(() => 
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))
  );
  const [selectedSound, setSelectedSound] = useState('synth');
  const { toast } = useToast();

  // Instrument refs
  const melodyInstrumentRef = useRef<any>();
  const drumInstrumentRef = useRef<any>();
  const loopRef = useRef<any>();
  const notes = ['C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'];

  // Initialize and update melody instrument
  useEffect(() => {
    try {
      const vol = new Tone.Volume(volume).toDestination();

      switch (selectedSound) {
        case 'piano':
          melodyInstrumentRef.current = new Tone.Sampler({
            urls: {
              C4: "piano-c4.mp3",
            },
            baseUrl: "https://tonejs.github.io/audio/salamander/",
            onload: () => {
              toast({
                title: "Piano samples loaded",
                description: "Ready to play",
              });
            },
          }).connect(vol);
          break;
        default:
          melodyInstrumentRef.current = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'triangle8' },
            envelope: {
              attack: 0.02,
              decay: 0.1,
              sustain: 0.2,
              release: 0.5,
            }
          }).connect(vol);
      }

      // Initialize drum instrument
      drumInstrumentRef.current = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 4,
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.001,
          decay: 0.4,
          sustain: 0.01,
          release: 1.4,
        }
      }).connect(vol);

      if (isPlaying) {
        melodyInstrumentRef.current?.triggerAttackRelease("C4", "8n");
      }

      return () => {
        if (melodyInstrumentRef.current) {
          melodyInstrumentRef.current.dispose();
        }
        if (drumInstrumentRef.current) {
          drumInstrumentRef.current.dispose();
        }
      };
    } catch (error) {
      console.error('Error initializing instruments:', error);
      toast({
        title: "Error",
        description: "Failed to initialize audio instruments",
        variant: "destructive",
      });
    }
  }, [selectedSound, volume, toast]);

  // Handle grid cell toggle
  const toggleCell = (row: number, col: number, isRhythm: boolean = false) => {
    if (isRhythm) {
      const newGrid = rhythmGrid.map((r, i) =>
        i === row ? r.map((cell: boolean, j: number) =>
          j === col ? !cell : cell
        ) : r
      );
      setRhythmGrid(newGrid);

      if (newGrid[row][col] && drumInstrumentRef.current) {
        // Preview drum sound with different pitches for different drum types
        const pitch = `C${Math.floor(row / 2) + 2}`;
        drumInstrumentRef.current.triggerAttackRelease(pitch, "8n");
      }
    } else {
      const newGrid = melodyGrid.map((r, i) =>
        i === row ? r.map((cell: boolean, j: number) =>
          j === col ? !cell : cell
        ) : r
      );
      setMelodyGrid(newGrid);

      if (newGrid[row][col] && melodyInstrumentRef.current) {
        const activeNotes = newGrid.map((r, idx) => r[col] ? notes[idx] : null).filter(Boolean);
        if (activeNotes.length) {
          melodyInstrumentRef.current.triggerAttackRelease(activeNotes, "8n");
        }
      }
    }
  };

  // Start/Stop sequence
  const togglePlay = useCallback(async () => {
    try {
      if (!isPlaying) {
        await Tone.start();
        Tone.Transport.bpm.value = bpm;

        if (loopRef.current) {
          loopRef.current.dispose();
        }

        loopRef.current = new Tone.Loop((time) => {
          setCurrentStep((prev) => {
            const nextStep = (prev + 1) % GRID_SIZE;

            // Play melody notes
            const activeMelodyNotes = melodyGrid.map((row, noteIndex) => 
              row[prev] ? notes[noteIndex] : null
            ).filter(Boolean);

            if (activeMelodyNotes.length && melodyInstrumentRef.current) {
              melodyInstrumentRef.current.triggerAttackRelease(activeMelodyNotes, '8n', time);
            }

            // Play rhythm notes
            rhythmGrid.forEach((row, drumIndex) => {
              if (row[prev] && drumInstrumentRef.current) {
                const pitch = `C${Math.floor(drumIndex / 2) + 2}`;
                drumInstrumentRef.current.triggerAttackRelease(pitch, '16n', time);
              }
            });

            return nextStep;
          });
        }, '8n').start(0);

        Tone.Transport.start();

        toast({
          title: "Playback started",
          description: "Audio loop is now playing",
        });
      } else {
        Tone.Transport.stop();
        if (loopRef.current) {
          loopRef.current.dispose();
        }
        setCurrentStep(0);
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling playback:', error);
      toast({
        title: "Error",
        description: "Failed to toggle playback",
        variant: "destructive",
      });
    }
  }, [isPlaying, melodyGrid, rhythmGrid, bpm, toast]);

  // Update BPM
  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  // Cleanup
  useEffect(() => {
    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      if (loopRef.current) {
        loopRef.current.dispose();
      }
      if (melodyInstrumentRef.current) {
        melodyInstrumentRef.current.dispose();
      }
      if (drumInstrumentRef.current) {
        drumInstrumentRef.current.dispose();
      }
    };
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Loop Machine</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <Button 
          onClick={togglePlay}
          variant={isPlaying ? "destructive" : "default"}
          className="min-w-[100px]"
        >
          {isPlaying ? 'Stop' : 'Play'}
        </Button>

        <div className="flex items-center gap-4">
          <span className="text-sm whitespace-nowrap">BPM: {bpm}</span>
          <div className="w-32">
            <Slider
              value={[bpm]}
              onValueChange={(value) => setBpm(value[0])}
              min={60}
              max={200}
              step={1}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Volume2 className="w-4 h-4" />
          <div className="w-32">
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              min={-40}
              max={0}
              step={1}
            />
          </div>
        </div>

        <Select value={selectedSound} onValueChange={setSelectedSound}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Sound" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="synth">Synth</SelectItem>
            <SelectItem value="piano">Piano</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline"
          onClick={() => {
            setMelodyGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false)));
            setRhythmGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false)));
          }}
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-8">
        {/* Melody Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Melody</h2>
          <Card className="p-6">
            <div className="grid gap-1">
              {melodyGrid.map((row, i) => (
                <div key={i} className="flex gap-1">
                  {row.map((cell, j) => (
                    <button
                      key={`${i}-${j}`}
                      onClick={() => toggleCell(i, j, false)}
                      className={`
                        w-12 h-12 rounded transition-all
                        ${cell ? 'bg-primary' : 'bg-secondary'}
                        ${currentStep === j ? 'ring-2 ring-primary' : ''}
                        hover:opacity-80
                      `}
                    />
                  ))}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Rhythm Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Rhythm</h2>
          <Card className="p-6">
            <div className="grid gap-1">
              {rhythmGrid.map((row, i) => (
                <div key={i} className="flex gap-1">
                  <span className="w-20 text-sm flex items-center">{DRUM_TYPES[i]}</span>
                  {row.map((cell, j) => (
                    <button
                      key={`${i}-${j}`}
                      onClick={() => toggleCell(i, j, true)}
                      className={`
                        w-12 h-12 rounded transition-all
                        ${cell ? 'bg-orange-500' : 'bg-orange-200/20'}
                        ${currentStep === j ? 'ring-2 ring-orange-500' : ''}
                        hover:opacity-80 dark:hover:opacity-70
                      `}
                    />
                  ))}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}