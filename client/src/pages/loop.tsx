import { useEffect, useState, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Volume2 } from 'lucide-react';

const GRID_SIZE = 8;
const DEFAULT_BPM = 120;

export default function Loop() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [volume, setVolume] = useState(0);
  const [grid, setGrid] = useState(() => 
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))
  );
  const [selectedSound, setSelectedSound] = useState('synth');

  // Create refs for instruments to prevent recreation
  const instrumentRef = useRef<any>();
  const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

  // Initialize and update instruments based on selection
  useEffect(() => {
    const vol = new Tone.Volume(volume).toDestination();

    switch (selectedSound) {
      case 'piano':
        instrumentRef.current = new Tone.Sampler({
          urls: {
            C4: "piano-c4.mp3",
          },
          baseUrl: "https://tonejs.github.io/audio/salamander/",
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
        instrumentRef.current = new Tone.Synth({
          oscillator: { type: 'triangle' },
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
  }, [selectedSound, volume]);

  // Handle grid cell toggle
  const toggleCell = (row: number, col: number) => {
    const newGrid = grid.map((r, i) =>
      i === row ? r.map((cell: boolean, j: number) =>
        j === col ? !cell : cell
      ) : r
    );
    setGrid(newGrid);
  };

  // Start/Stop sequence
  const togglePlay = useCallback(() => {
    if (!isPlaying) {
      Tone.start();
      Tone.Transport.bpm.value = bpm;
      Tone.Transport.scheduleRepeat((time) => {
        setCurrentStep((prev) => (prev + 1) % GRID_SIZE);
        grid.forEach((row, i) => {
          if (row[currentStep] && instrumentRef.current) {
            instrumentRef.current.triggerAttackRelease(notes[i], '8n', time);
          }
        });
      }, '8n');
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, grid, currentStep, bpm]);

  // Update BPM
  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  // Cleanup
  useEffect(() => {
    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
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
              min={-20}
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