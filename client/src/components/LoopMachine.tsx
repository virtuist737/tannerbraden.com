import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import * as Tone from 'tone';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Volume2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const BEATS_PER_BAR = 8;
const DEFAULT_BPM = 120;

// Drum configuration
const drumLabels = ['Kick', 'Snare', 'Hi-Hat'];


type ScaleType = keyof typeof scaleNotes;

export default function LoopMachine() {
  const [numBars, setNumBars] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [volume, setVolume] = useState(-10);
  const [melodyGrid, setMelodyGrid] = useState(() =>
    Array(BEATS_PER_BAR).fill(null).map(() => Array(BEATS_PER_BAR * 2).fill(false))
  );
  const [rhythmGrid, setRhythmGrid] = useState(() =>
    Array(3).fill(null).map(() => Array(BEATS_PER_BAR * 2).fill(false))
  );
  const [selectedSound, setSelectedSound] = useState('synth');

  const { toast } = useToast();
  const [isDrumLoaded, setIsDrumLoaded] = useState(false); // Add loading state

  const melodyInstrumentRef = useRef<any>();
  const rhythmInstrumentRef = useRef<any>();
  const sequenceRef = useRef<any>();
  const masterVolumeRef = useRef<any>();

  const scales = [
    'Pentatonic Major',
    'Pentatonic Minor',
    'Ionian Mode',
    'Harmonic Minor',
    'Melodic Minor',
    'Blues Scale',
    'Dorian Mode',
    'Mixolydian Mode',
    'Phrygian Mode',
    'Japanese Hirajoshi',
  ];

  const scaleNotes = {
    'Pentatonic Major': ['E5', 'D5', 'C5', 'A4', 'G4', 'E4', 'D4', 'C4'],
    'Pentatonic Minor': ['F5', 'Eb5', 'C5', 'Bb4', 'G4', 'F4', 'Eb4', 'C4'],
    'Ionian Mode': ['C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'],
    'Harmonic Minor': ['C5', 'B4', 'Ab4', 'G4', 'F4', 'Eb4', 'D4', 'C4'],
    'Melodic Minor': ['C5', 'B4', 'A4', 'G4', 'F4', 'Eb4', 'D4', 'C4'],
    'Blues Scale': ['Eb5', 'C5', 'Bb4', 'G4', 'F#4', 'F4', 'Eb4', 'C4'],
    'Dorian Mode': ['C5', 'Bb4', 'A4', 'G4', 'F4', 'Eb4', 'D4', 'C4'],
    'Mixolydian Mode': ['C5', 'Bb4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'],
    'Phrygian Mode': ['C5', 'Bb4', 'Ab4', 'G4', 'F4', 'Eb4', 'Db4', 'C4'],
    'Japanese Hirajoshi': ['Eb5', 'D5', 'C5', 'Ab4', 'G4', 'Eb4', 'D4', 'C4'],
  } as const;

  const [selectedScale, setSelectedScale] = useState<ScaleType>('Pentatonic Major');
  const notes = scaleNotes[selectedScale];

  useEffect(() => {
    try {
      masterVolumeRef.current = new Tone.Volume(volume).toDestination();

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
          }).connect(masterVolumeRef.current);
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
          }).connect(masterVolumeRef.current);
      }

      // Create individual synths for each drum sound
      rhythmInstrumentRef.current = {
        kick: new Tone.MembraneSynth({
          pitchDecay: 0.1,
          octaves: 8,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 0.3 }
        }).connect(masterVolumeRef.current),

        snare: new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: { attack: 0.001, decay: 0.4, sustain: 0.1 },
          filter: { type: 'bandpass', Q: 2, frequency: 2000 }
        }).connect(masterVolumeRef.current),

        hihat: new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: { attack: 0.001, decay: 0.05, sustain: 0 },
          filter: { type: 'highpass', frequency: 4000 }
        }).connect(masterVolumeRef.current)
      };
      setIsDrumLoaded(true);

      return () => {
        if (melodyInstrumentRef.current) {
          melodyInstrumentRef.current.dispose();
        }
        if (rhythmInstrumentRef.current) {
          rhythmInstrumentRef.current.kick.dispose();
          rhythmInstrumentRef.current.snare.dispose();
          rhythmInstrumentRef.current.hihat.dispose();
        }
        if (masterVolumeRef.current) {
          masterVolumeRef.current.dispose();
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

  const toggleMelodyCell = (row: number, col: number) => {
    const newGrid = melodyGrid.map((r, i) =>
      i === row ? r.map((cell: boolean, j: number) =>
        j === col ? !cell : cell
      ) : r
    );
    setMelodyGrid(newGrid);

    if (newGrid[row][col] && melodyInstrumentRef.current) {
      melodyInstrumentRef.current.triggerAttackRelease(notes[row], "8n");
    }
  };

  const toggleRhythmCell = (row: number, col: number) => {
    const newGrid = rhythmGrid.map((r, i) =>
      i === row ? r.map((cell: boolean, j: number) =>
        j === col ? !cell : cell
      ) : r
    );
    setRhythmGrid(newGrid);

    if (newGrid[row][col] && rhythmInstrumentRef.current) {
      switch (row) {
        case 0:
          rhythmInstrumentRef.current.kick.triggerAttackRelease('C1', '8n');
          break;
        case 1:
          rhythmInstrumentRef.current.snare.triggerAttackRelease('8n');
          break;
        case 2:
          rhythmInstrumentRef.current.hihat.triggerAttackRelease('8n');
          break;
      }
    }
  };

  const togglePlay = useCallback(async () => {
    try {
      if (!isPlaying) {
        await Tone.start();
        Tone.Transport.bpm.value = bpm;

        if (sequenceRef.current) {
          sequenceRef.current.dispose();
        }

        sequenceRef.current = new Tone.Sequence((time, step) => {
          setCurrentStep(step);

          const activeMelodyNotes = melodyGrid.map((row, rowIndex) =>
            row[step] ? notes[rowIndex] : null
          ).filter(Boolean);

          if (activeMelodyNotes.length && melodyInstrumentRef.current) {
            melodyInstrumentRef.current.triggerAttackRelease(activeMelodyNotes, '8n', time);
          }

          rhythmGrid.forEach((row, rowIndex) => {
            if (row[step] && rhythmInstrumentRef.current && isDrumLoaded) {
              switch (rowIndex) {
                case 0:
                  rhythmInstrumentRef.current.kick.triggerAttackRelease('C1', '8n', time);
                  break;
                case 1:
                  rhythmInstrumentRef.current.snare.triggerAttackRelease('8n', time);
                  break;
                case 2:
                  rhythmInstrumentRef.current.hihat.triggerAttackRelease('8n', time);
                  break;
              }
            }
          });
        }, Array.from({ length: BEATS_PER_BAR * numBars }, (_, i) => i), '8n').start(0);

        Tone.Transport.start();
        toast({
          title: "Playback started",
          description: "Audio loop is now playing",
        });
      } else {
        Tone.Transport.stop();
        if (sequenceRef.current) {
          sequenceRef.current.dispose();
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
  }, [isPlaying, melodyGrid, rhythmGrid, bpm, notes, numBars, toast, isDrumLoaded]);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  useEffect(() => {
    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      if (sequenceRef.current) {
        sequenceRef.current.dispose();
      }
    };
  }, []);

  const presetMelodyGrid = [
    [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
    [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  ];

  const presetRhythmGrid = [
    [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
  ];


  const resetToPreset = () => {
    setMelodyGrid(presetMelodyGrid);
    setRhythmGrid(presetRhythmGrid);
  };

  const clearPatterns = () => {
    setMelodyGrid(Array(BEATS_PER_BAR).fill(null).map(() => Array(BEATS_PER_BAR * numBars).fill(false)));
    setRhythmGrid(Array(3).fill(null).map(() => Array(BEATS_PER_BAR * numBars).fill(false)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex space-x-2">
          <Button
            onClick={togglePlay}
            variant={isPlaying ? "destructive" : "default"}
            className="min-w-[100px]"
          >
            {isPlaying ? 'Stop' : 'Play'}
          </Button>

          <Button
            onClick={resetToPreset}
            variant="outline"
            className="whitespace-nowrap"
          >
            Load Preset
          </Button>

          <Button
            onClick={clearPatterns}
            variant="outline"
            className="whitespace-nowrap"
          >
            Clear All
          </Button>
        </div>

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

        <Select
          value={selectedScale}
          onValueChange={(value: ScaleType) => setSelectedScale(value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Scale" />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(scaleNotes) as ScaleType[]).map((scale) => (
              <SelectItem key={scale} value={scale}>
                {scale}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={numBars.toString()}
          onValueChange={(value) => {
            const newBars = parseInt(value);
            setNumBars(newBars);
            setMelodyGrid(Array(BEATS_PER_BAR).fill(null).map(() => Array(BEATS_PER_BAR * newBars).fill(false)));
            setRhythmGrid(Array(3).fill(null).map(() => Array(BEATS_PER_BAR * newBars).fill(false)));
            setCurrentStep(0);
            if (isPlaying) {
              togglePlay();
            }
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Bars" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Bar</SelectItem>
            <SelectItem value="2">2 Bars</SelectItem>
            <SelectItem value="3">3 Bars</SelectItem>
            <SelectItem value="4">4 Bars</SelectItem>
          </SelectContent>
        </Select>



        <Button
          variant="outline"
          onClick={() => {
            setMelodyGrid(Array(BEATS_PER_BAR).fill(null).map(() => Array(BEATS_PER_BAR * numBars).fill(false)));
            setRhythmGrid(Array(3).fill(null).map(() => Array(BEATS_PER_BAR * numBars).fill(false)));
          }}
        >
          Clear
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Melody</h3>
          <div className="grid gap-1">
            {melodyGrid.map((row, i) => (
              <div key={i} className="flex gap-1 items-center">
                <span className="w-12 text-sm text-right mr-2">{notes[i]}</span>
                <div className="flex gap-1">
                  {row.map((cell, j) => (
                    <button
                      key={`${i}-${j}`}
                      onClick={() => toggleMelodyCell(i, j)}
                      className={`
                        w-12 h-12 rounded transition-all
                        ${cell ? 'bg-primary' : 'bg-secondary'}
                        ${currentStep === j ? 'ring-2 ring-primary' : ''}
                        hover:opacity-80
                      `}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Rhythm</h3>
          <div className="grid gap-1">
            {rhythmGrid.map((row, i) => (
              <div key={i} className="flex gap-1 items-center">
                <span className="w-12 text-sm text-right mr-2">{drumLabels[i]}</span>
                <div className="flex gap-1">
                  {row.map((cell, j) => (
                    <button
                      key={`${i}-${j}`}
                      onClick={() => toggleRhythmCell(i, j)}
                      className={`
                        w-12 h-12 rounded transition-all
                        ${cell ? 'bg-primary' : 'bg-secondary'}
                        ${currentStep === j ? 'ring-2 ring-primary' : ''}
                        hover:opacity-80
                      `}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}