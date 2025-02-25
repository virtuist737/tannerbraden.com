
import { useState, useRef, useEffect } from "react";
import * as Tone from "tone";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const GRID_SIZE = 8;
const DEFAULT_BPM = 120;

export default function Loop() {
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
  const loopRef = useRef<any>();
  const notes = ['C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'];

  useEffect(() => {
    try {
      const vol = new Tone.Volume(volume).toDestination();
      instrumentRef.current?.disconnect();
      instrumentRef.current?.dispose();

      if (selectedSound === 'synth') {
        instrumentRef.current = new Tone.Synth().connect(vol);
      } else {
        instrumentRef.current = new Tone.Sampler({
          urls: {
            C4: `${selectedSound}.mp3`,
          },
          baseUrl: "/samples/",
        }).connect(vol);
      }
    } catch (error) {
      console.error('Error initializing instrument:', error);
      toast({
        title: "Error",
        description: "Failed to initialize audio. Please refresh the page.",
        variant: "destructive",
      });
    }
  }, [selectedSound, volume]);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  const togglePlay = async () => {
    await Tone.start();
    if (isPlaying) {
      Tone.Transport.stop();
      setIsPlaying(false);
      setCurrentStep(0);
      if (loopRef.current) {
        loopRef.current.dispose();
      }
    } else {
      setIsPlaying(true);
      const loop = new Tone.Sequence(
        (time, step) => {
          setCurrentStep(step);
          grid[step].forEach((isActive, noteIndex) => {
            if (isActive) {
              instrumentRef.current?.triggerAttackRelease(notes[noteIndex], "8n", time);
            }
          });
        },
        [...Array(GRID_SIZE).keys()],
        "8n"
      );
      loopRef.current = loop;
      loop.start(0);
      Tone.Transport.start();
    }
  };

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
      </div>
    </div>
  );
}
