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
const drumNotes = ['C1', 'D1', 'E1'];
const drumLabels = ['Kick', 'Snare', 'Hi-Hat'];

// Define drum kits here.  Each kit maps notes to sample URLs.
const drumKits = {
  'Kit 1': {
    'C1': 'kick.mp3',
    'D1': 'snare.mp3',
    'E1': 'hihat.mp3'
  },
  'Kit 2': {
    'C1': 'kick2.mp3',
    'D1': 'snare2.mp3',
    'E1': 'hihat2.mp3'
  }
};

const drumSamples = drumKits['Kit 1']; // Default to Kit 1


type ScaleType = keyof typeof scaleNotes;

export default function LoopMachine() {
  const [numBars, setNumBars] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [volume, setVolume] = useState(-10);
  const [melodyGrid, setMelodyGrid] = useState(() => 
    Array(BEATS_PER_BAR).fill(null).map(() => Array(BEATS_PER_BAR).fill(false))
  );
  const [rhythmGrid, setRhythmGrid] = useState(() => 
    Array(3).fill(null).map(() => Array(BEATS_PER_BAR).fill(false))
  );
  const [selectedSound, setSelectedSound] = useState('synth');
  const [selectedDrumKit, setSelectedDrumKit] = useState('Kit 1'); // Add state for drum kit selection
  const { toast } = useToast();

  const melodyInstrumentRef = useRef<any>();
  const rhythmInstrumentRef = useRef<any>();
  const sequenceRef = useRef<any>();
  const masterVolumeRef = useRef<any>();

  const scales = [
    'Pentatonic Major',
    'Pentatonic Minor',
    'Blues Scale',
    'Dorian Mode',
    'Mixolydian Mode',
    'Harmonic Minor',
    'Melodic Minor',
    'Phrygian Mode',
    'Whole Tone Scale',
    'Japanese Hirajoshi',
  ];

  const scaleNotes = {
    'Pentatonic Major': ['E5', 'D5', 'C5', 'A4', 'G4', 'E4', 'D4', 'C4'],
    'Pentatonic Minor': ['F5', 'Eb5', 'C5', 'Bb4', 'G4', 'F4', 'Eb4', 'C4'],
    'Blues Scale': ['Eb5', 'C5', 'Bb4', 'G4', 'F#4', 'F4', 'Eb4', 'C4'],
    'Dorian Mode': ['C5', 'Bb4', 'A4', 'G4', 'F4', 'Eb4', 'D4', 'C4'],
    'Mixolydian Mode': ['C5', 'Bb4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'],
    'Harmonic Minor': ['C5', 'B4', 'Ab4', 'G4', 'F4', 'Eb4', 'D4', 'C4'],
    'Melodic Minor': ['C5', 'B4', 'A4', 'G4', 'F4', 'Eb4', 'D4', 'C4'],
    'Phrygian Mode': ['C5', 'Bb4', 'Ab4', 'G4', 'F4', 'Eb4', 'Db4', 'C4'],
    'Whole Tone Scale': ['D5', 'C5', 'A#4', 'G#4', 'F#4', 'E4', 'D4', 'C4'],
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

      rhythmInstrumentRef.current = new Tone.Sampler({
        urls: drumKits[selectedDrumKit], // Use selected drum kit
        baseUrl: "https://tonejs.github.io/audio/drum-samples/",  
        onload: () => {
          toast({
            title: "Drum samples loaded",
            description: "Ready to play",
          });
        },
      }).connect(masterVolumeRef.current);

      return () => {
        if (melodyInstrumentRef.current) {
          melodyInstrumentRef.current.dispose();
        }
        if (rhythmInstrumentRef.current) {
          rhythmInstrumentRef.current.dispose();
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
  }, [selectedSound, volume, toast, selectedDrumKit]); // Add selectedDrumKit to dependencies

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
      rhythmInstrumentRef.current.triggerAttackRelease(drumNotes[row], "8n");
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
            if (row[step] && rhythmInstrumentRef.current) {
              rhythmInstrumentRef.current.triggerAttackRelease(drumNotes[rowIndex], '8n', time);
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
  }, [isPlaying, melodyGrid, rhythmGrid, bpm, notes, numBars, toast]);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
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

        <Select value={selectedDrumKit} onValueChange={setSelectedDrumKit}> {/* Added Drum Kit Selector */}
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Drum Kit" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(drumKits).map((kit) => (
              <SelectItem key={kit} value={kit}>
                {kit}
              </SelectItem>
            ))}
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