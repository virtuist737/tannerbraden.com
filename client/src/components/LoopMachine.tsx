import { useEffect, useState, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as Tone from 'tone';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { 
  Volume2, 
  Play, 
  Square, 
  Music, 
  Drum, 
  BookMarked, 
  ZoomIn, 
  ZoomOut, 
  Music2,
  Disc3
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { LoopMachinePreset } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

const BEATS_PER_BAR = 8;
const DEFAULT_BPM = 120;

// Drum configuration
const drumLabels = ['Kick', 'Snare', 'Hi-Hat'];

// Define scale notes
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

type ScaleType = keyof typeof scaleNotes;

export default function LoopMachine() {
  const [numBars, setNumBars] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [volume, setVolume] = useState(-10);
  const [melodyGrid, setMelodyGrid] = useState(() => 
    Array(BEATS_PER_BAR).fill(null).map(() => Array(BEATS_PER_BAR*2).fill(false))
  );
  const [rhythmGrid, setRhythmGrid] = useState(() => 
    Array(3).fill(null).map(() => Array(BEATS_PER_BAR*2).fill(false))
  );
  const [selectedSound, setSelectedSound] = useState('synth');
  const [selectedPresetId, setSelectedPresetId] = useState<number | null>(null);

  // State for drag operations
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(false);
  const [dragTarget, setDragTarget] = useState<'melody' | 'rhythm' | null>(null);

  const { toast } = useToast();
  const [isDrumLoaded, setIsDrumLoaded] = useState(false); // Add loading state

  const melodyInstrumentRef = useRef<any>();
  const rhythmInstrumentRef = useRef<any>();
  const sequenceRef = useRef<any>();
  const masterVolumeRef = useRef<any>();

  // Fetch default preset
  const { data: defaultPreset, isLoading: isLoadingPreset } = useQuery<LoopMachinePreset>({
    queryKey: ['/api/loop-presets/default'],
    enabled: true,
    retry: false
  });
  
  // Handle successful preset loading
  useEffect(() => {
    if (defaultPreset) {
      setSelectedPresetId(defaultPreset.id);
      loadPreset(defaultPreset);
    }
  }, [defaultPreset]);
  
  // Fetch all presets for the dropdown
  const { data: presets } = useQuery<LoopMachinePreset[]>({
    queryKey: ['/api/loop-presets'],
    enabled: true,
    retry: false
  });

  // Function to load a preset
  const loadPreset = (preset: LoopMachinePreset) => {
    setBpm(preset.bpm);
    setVolume(preset.volume);
    setSelectedSound(preset.selectedSound);
    setSelectedScale(preset.selectedScale as ScaleType);
    setNumBars(preset.numBars);
    
    try {
      // Only set grids if they are valid arrays
      if (Array.isArray(preset.melodyGrid) && 
          preset.melodyGrid.length > 0 && 
          Array.isArray(preset.melodyGrid[0])) {
        setMelodyGrid(preset.melodyGrid as boolean[][]);
      }
      
      if (Array.isArray(preset.rhythmGrid) && 
          preset.rhythmGrid.length > 0 && 
          Array.isArray(preset.rhythmGrid[0])) {
        setRhythmGrid(preset.rhythmGrid as boolean[][]);
      }
    } catch (error) {
      console.error("Error loading grid data from preset:", error);
    }
    
    toast({
      title: "Preset loaded",
      description: `Loaded preset: ${preset.name}`,
    });
  };

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
          envelope: { attack: 0.001, decay: 0.4, sustain: 0.1 }
        }).connect(masterVolumeRef.current),

        hihat: new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: { attack: 0.001, decay: 0.05, sustain: 0 }
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

  // Handle single cell toggle
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

  // Drag selection handlers for melody grid
  const handleMelodyDragStart = (row: number, col: number) => {
    setIsDragging(true);
    setDragTarget('melody');
    setDragValue(!melodyGrid[row][col]); // Set to opposite of current state

    // Apply to the initial cell
    const newGrid = [...melodyGrid];
    newGrid[row][col] = !melodyGrid[row][col];
    setMelodyGrid(newGrid);

    // Play sound if activating
    if (!melodyGrid[row][col] && melodyInstrumentRef.current) {
      melodyInstrumentRef.current.triggerAttackRelease(notes[row], "8n");
    }
  };

  const handleMelodyDragEnter = (row: number, col: number) => {
    if (isDragging && dragTarget === 'melody') {
      const newGrid = [...melodyGrid];
      newGrid[row][col] = dragValue;
      setMelodyGrid(newGrid);

      // Play sound if activating
      if (dragValue && melodyInstrumentRef.current) {
        melodyInstrumentRef.current.triggerAttackRelease(notes[row], "8n");
      }
    }
  };

  // Drag selection handlers for rhythm grid
  const handleRhythmDragStart = (row: number, col: number) => {
    setIsDragging(true);
    setDragTarget('rhythm');
    setDragValue(!rhythmGrid[row][col]); // Set to opposite of current state

    // Apply to the initial cell
    const newGrid = [...rhythmGrid];
    newGrid[row][col] = !rhythmGrid[row][col];
    setRhythmGrid(newGrid);

    // Play sound if activating
    if (!rhythmGrid[row][col] && rhythmInstrumentRef.current && isDrumLoaded) {
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

  const handleRhythmDragEnter = (row: number, col: number) => {
    if (isDragging && dragTarget === 'rhythm') {
      const newGrid = [...rhythmGrid];
      newGrid[row][col] = dragValue;
      setRhythmGrid(newGrid);

      // Play sound if activating
      if (dragValue && rhythmInstrumentRef.current && isDrumLoaded) {
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
    }
  };

  // End drag operation
  const handleDragEnd = () => {
    setIsDragging(false);
    setDragTarget(null);
  };

  // Global mouse/touch event handlers
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging]);

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

  // Animation variants for cells
  const cellVariants = {
    inactive: { scale: 1 },
    active: { scale: 1.1, transition: { type: "spring", stiffness: 500 } },
    pulse: { 
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: { duration: 0.3 }
    },
    initialLoad: (delayIndex: number) => ({
      scale: [0, 1.1, 1],
      opacity: [0, 1],
      transition: { 
        delay: delayIndex * 0.01,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Add state for preset loading animation
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Handle initial preset loading animation
  useEffect(() => {
    if (defaultPreset && isInitialLoad) {
      // Set a timer to turn off initial load animation
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [defaultPreset, isInitialLoad]);

  // Add notification feedback
  const notifyChange = (message: string) => {
    toast({
      title: message,
      duration: 1000,
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid gap-8"
      >
        {/* Title Section */}
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-3"
          >
            <Disc3 className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold">Loop Machine</h2>
          </motion.div>
          
          {presets && (
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-2"
            >
              <Select 
                value={selectedPresetId?.toString() || ''} 
                onValueChange={(value) => {
                  if (value) {
                    const preset = presets.find(p => p.id === parseInt(value));
                    if (preset) {
                      setSelectedPresetId(preset.id);
                      loadPreset(preset);
                    }
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Preset" />
                </SelectTrigger>
                <SelectContent>
                  {presets.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id.toString()}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </div>

        {/* Controls Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <Card className="p-4 bg-card flex flex-col">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Play className="h-4 w-4" /> Playback
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <Button 
                onClick={togglePlay}
                variant={isPlaying ? "destructive" : "default"}
                className="flex-grow flex items-center justify-center gap-2"
                size="lg"
              >
                {isPlaying ? (
                  <>
                    <Square className="h-4 w-4" /> Stop
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" /> Play
                  </>
                )}
              </Button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm whitespace-nowrap min-w-[60px]">BPM: {bpm}</span>
              <Slider
                value={[bpm]}
                onValueChange={(value) => {
                  setBpm(value[0]);
                  notifyChange(`BPM: ${value[0]}`);
                }}
                min={60}
                max={200}
                step={1}
                className="flex-grow"
              />
            </div>
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 min-w-[24px]" />
              <Slider
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                min={-40}
                max={0}
                step={1}
                className="flex-grow"
              />
            </div>
          </Card>
          
          <Card className="p-4 bg-card flex flex-col">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Music className="h-4 w-4" /> Sound
            </h3>
            <div className="grid gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm min-w-[60px]">Instrument:</span>
                <div className="flex-grow">
                  <Select value={selectedSound} onValueChange={setSelectedSound}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sound" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="synth">Synth</SelectItem>
                      <SelectItem value="piano">Piano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm min-w-[60px]">Scale:</span>
                <div className="flex-grow">
                  <Select 
                    value={selectedScale} 
                    onValueChange={(value: ScaleType) => setSelectedScale(value)}
                  >
                    <SelectTrigger>
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
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-card flex flex-col">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Music2 className="h-4 w-4" /> Grid Setup
            </h3>
            <div className="grid gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm min-w-[60px]">Bars:</span>
                <div className="flex-grow">
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
                      notifyChange(`Grid set to ${newBars} ${newBars === 1 ? 'bar' : 'bars'}`);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Bars" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Bar</SelectItem>
                      <SelectItem value="2">2 Bars</SelectItem>
                      <SelectItem value="3">3 Bars</SelectItem>
                      <SelectItem value="4">4 Bars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                variant="outline"
                onClick={() => {
                  setMelodyGrid(Array(BEATS_PER_BAR).fill(null).map(() => Array(BEATS_PER_BAR * numBars).fill(false)));
                  setRhythmGrid(Array(3).fill(null).map(() => Array(BEATS_PER_BAR * numBars).fill(false)));
                  notifyChange("Grid cleared");
                }}
                className="w-full"
              >
                Clear Grid
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Grid Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Music className="h-5 w-5" /> 
                  Melody
                </h3>
              </div>
              
              <div className="grid gap-2">
                {melodyGrid.map((row, i) => (
                  <div key={i} className="flex gap-1 items-center">
                    <span className="w-12 text-sm font-medium text-right mr-2">{notes[i]}</span>
                    <div className="flex gap-1">
                      {row.map((cell, j) => (
                        <motion.button
                          key={`${i}-${j}`}
                          custom={i * BEATS_PER_BAR + j} // Custom prop for staggered animation
                          variants={cellVariants}
                          initial={isInitialLoad ? "initialLoad" : "inactive"}
                          animate={
                            currentStep === j 
                              ? "pulse" 
                              : cell 
                                ? "active" 
                                : "inactive"
                          }
                          onMouseDown={() => handleMelodyDragStart(i, j)}
                          onMouseEnter={() => handleMelodyDragEnter(i, j)}
                          onTouchStart={() => handleMelodyDragStart(i, j)}
                          onTouchMove={(e) => {
                            const touch = e.touches[0];
                            const element = document.elementFromPoint(touch.clientX, touch.clientY);
                            const key = element?.getAttribute('data-key');
                            if (key) {
                              const [row, col] = key.split('-').map(Number);
                              if (row !== undefined && col !== undefined) {
                                handleMelodyDragEnter(row, col);
                              }
                            }
                          }}
                          data-key={`${i}-${j}`}
                          className={`
                            w-11 h-11 rounded-md transition-colors
                            ${cell ? 'bg-primary shadow-lg' : 'bg-secondary hover:bg-secondary/80'}
                            ${currentStep === j ? 'ring-2 ring-primary-foreground' : ''}
                            touch-none
                          `}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Drum className="h-5 w-5" /> 
                  Rhythm
                </h3>
              </div>
              
              <div className="grid gap-4">
                {rhythmGrid.map((row, i) => (
                  <div key={i} className="flex gap-1 items-center">
                    <span className="w-14 text-sm font-medium text-right mr-2">{drumLabels[i]}</span>
                    <div className="flex gap-1">
                      {row.map((cell, j) => (
                        <motion.button
                          key={`${i}-${j}`}
                          custom={(i+BEATS_PER_BAR) * BEATS_PER_BAR + j} // Custom prop for staggered animation
                          variants={cellVariants}
                          initial={isInitialLoad ? "initialLoad" : "inactive"}
                          animate={
                            currentStep === j 
                              ? "pulse" 
                              : cell 
                                ? "active" 
                                : "inactive"
                          }
                          onMouseDown={() => handleRhythmDragStart(i, j)}
                          onMouseEnter={() => handleRhythmDragEnter(i, j)}
                          onTouchStart={() => handleRhythmDragStart(i, j)}
                          onTouchMove={(e) => {
                            const touch = e.touches[0];
                            const element = document.elementFromPoint(touch.clientX, touch.clientY);
                            const key = element?.getAttribute('data-key');
                            if (key) {
                              const [row, col] = key.split('-').map(Number);
                              if (row !== undefined && col !== undefined) {
                                handleRhythmDragEnter(row, col);
                              }
                            }
                          }}
                          data-key={`${i}-${j}`}
                          className={`
                            w-11 h-11 rounded-md transition-colors
                            ${cell ? 'bg-primary shadow-lg' : 'bg-secondary hover:bg-secondary/80'}
                            ${currentStep === j ? 'ring-2 ring-primary-foreground' : ''}
                            touch-none
                          `}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}