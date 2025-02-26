import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import * as Tone from 'tone';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Volume2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const GRID_SIZE = 8;
const DEFAULT_BPM = 120;

export default function LoopMachine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [volume, setVolume] = useState(-10);
  const [grid, setGrid] = useState(() => 
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))
  );
  const [selectedSound, setSelectedSound] = useState('synth');
  const { toast } = useToast();

  const instrumentRef = useRef<any>();
  const sequenceRef = useRef<any>();

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
  };

  const [selectedScale, setSelectedScale] = useState('Pentatonic Major');
  const notes = useMemo(() => scaleNotes[selectedScale], [selectedScale]);

  useEffect(() => {
    try {
      const vol = new Tone.Volume(volume).toDestination();

      switch (selectedSound) {
        case 'piano':
          instrumentRef.current = new Tone.Sampler({
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
        case 'drums':
          instrumentRef.current = new Tone.MembraneSynth({
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
          break;
        default:
          instrumentRef.current = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'triangle8' },
            envelope: {
              attack: 0.02,
              decay: 0.1,
              sustain: 0.2,
              release: 0.5,
            }
          }).connect(vol);
      }

      return () => {
        if (instrumentRef.current) {
          instrumentRef.current.dispose();
        }
      };
    } catch (error) {
      console.error('Error initializing instrument:', error);
      toast({
        title: "Error",
        description: "Failed to initialize audio instrument",
        variant: "destructive",
      });
    }
  }, [selectedSound, volume, toast]);

  const toggleCell = (row: number, col: number) => {
    const newGrid = grid.map((r, i) =>
      i === row ? r.map((cell: boolean, j: number) =>
        j === col ? !cell : cell
      ) : r
    );
    setGrid(newGrid);

    if (newGrid[row][col] && instrumentRef.current) {
      instrumentRef.current.triggerAttackRelease(notes[row], "8n");
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
          grid.forEach((row, rowIndex) => {
            if (row[step]) {
              instrumentRef.current?.triggerAttackRelease(notes[rowIndex], '8n', time);
            }
          });
        }, Array.from({ length: GRID_SIZE }, (_, i) => i), '8n').start(0);

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
  }, [isPlaying, grid, bpm, notes, toast]);

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
      if (instrumentRef.current) {
        instrumentRef.current.dispose();
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
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
            <SelectItem value="drums">Drums</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedScale} onValueChange={setSelectedScale}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Scale" />
          </SelectTrigger>
          <SelectContent>
            {scales.map((scale) => (
              <SelectItem key={scale} value={scale}>
                {scale}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          variant="outline"
          onClick={() => setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false)))}
        >
          Clear
        </Button>
      </div>

      <Card className="p-6">
        <div className="grid gap-1">
          {grid.map((row, i) => (
            <div key={i} className="flex gap-1 justify-center">
              {row.map((cell, j) => (
                <button
                  key={`${i}-${j}`}
                  onClick={() => toggleCell(i, j)}
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
  );
}
