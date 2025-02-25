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

export default function Loop() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [volume, setVolume] = useState(-10); // Start at a moderate volume
  const [grid, setGrid] = useState(() => 
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))
  );
  const [selectedSound, setSelectedSound] = useState('synth');
  const { toast } = useToast();

  // Create refs for instruments and loop
  const instrumentRef = useRef<any>();
  const loopRef = useRef<any>();
  const notes = ['C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4']; // Reversed notes array

  // Initialize and update instruments based on selection
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
        default: // synth
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

      // Test sound on instrument change
      if (isPlaying) {
        instrumentRef.current?.triggerAttackRelease("C4", "8n");
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

  // Handle grid cell toggle
  const toggleCell = (row: number, col: number) => {
    const newGrid = grid.map((r, i) =>
      i === row ? r.map((cell: boolean, j: number) =>
        j === col ? !cell : cell
      ) : r
    );
    setGrid(newGrid);

    // Preview sound when toggling cell
    if (newGrid[row][col] && instrumentRef.current) {
      // Get all active notes in this column for chord preview
      const activeNotes = newGrid.map((r, idx) => r[col] ? notes[idx] : null).filter(Boolean);
      if (activeNotes.length) {
        instrumentRef.current.triggerAttackRelease(activeNotes, "8n");
      }
    }
  };

  // Start/Stop sequence
  const togglePlay = useCallback(async () => {
    try {
      if (!isPlaying) {
        // Ensure audio context is running
        await Tone.start();
        console.log('Tone.js started');

        Tone.Transport.bpm.value = bpm;

        // Clear any existing loop
        if (loopRef.current) {
          loopRef.current.dispose();
        }

        // Create new loop
        loopRef.current = new Tone.Loop((time) => {
          setCurrentStep((prev) => {
            const nextStep = (prev + 1) % GRID_SIZE;
            // Get all active notes for this step
            const activeNotes = grid.map((row, noteIndex) => 
              row[prev] ? notes[noteIndex] : null
            ).filter(Boolean);

            // Play all active notes simultaneously
            if (activeNotes.length && instrumentRef.current) {
              instrumentRef.current.triggerAttackRelease(activeNotes, '8n', time);
            }
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
  }, [isPlaying, grid, bpm, toast]);

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
      if (instrumentRef.current) {
        instrumentRef.current.dispose();
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
            <SelectItem value="drums">Drums</SelectItem>
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
            <div key={i} className="flex gap-1">
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