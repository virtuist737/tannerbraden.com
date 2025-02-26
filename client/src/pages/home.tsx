import { motion } from "framer-motion";
import { ArrowRight, AtSign, Volume2 } from "lucide-react";
import { Link } from "wouter";
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Projects from "@/components/home/Projects";
import BlogCard from "@/components/blog/BlogCard";
import { useQuery } from "@tanstack/react-query";
import type { BlogPost } from "@shared/schema";
import { useEffect, useState, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import { useToast } from "@/hooks/use-toast";
import LoopMachine from '@/components/LoopMachine';

const GRID_SIZE = 8;
const DEFAULT_BPM = 120;

const Home = () => {
  // Blog posts query
  const { data: latestPosts, isLoading: isLoadingPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
    select: (posts) => posts
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 3)
  });

  // Loop Machine State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [volume, setVolume] = useState(-10);
  const [grid, setGrid] = useState(() => 
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))
  );
  const [selectedSound, setSelectedSound] = useState('synth');
  const { toast } = useToast();

  // Instrument and loop refs
  const instrumentRef = useRef<any>();
  const loopRef = useRef<any>();
  const notes = ['C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'];

  // Initialize and update instruments
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

    if (newGrid[row][col] && instrumentRef.current) {
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
        await Tone.start();
        Tone.Transport.bpm.value = bpm;

        if (loopRef.current) {
          loopRef.current.dispose();
        }

        loopRef.current = new Tone.Loop((time) => {
          setCurrentStep((prev) => {
            const nextStep = (prev + 1) % GRID_SIZE;
            const activeNotes = grid.map((row, noteIndex) => 
              row[prev] ? notes[noteIndex] : null
            ).filter(Boolean);

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
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Tanner Braden</title>
        <meta 
          name="description"
          content="Creating apps and content to reducing human suffering and increase the quality of human consciousness."
        />
        <meta 
          name="keywords" 
          content="consciousness, suffering, virtues, virtuist, neurodivergence, partnerships, growth, digital marketing, program development, partner programs" 
        />
        <meta property="og:title" content="Tanner Braden" />
        <meta 
          property="og:description" 
          content="Creating apps and content to reducing human suffering and increase the quality of human consciousness."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:title" content="Tanner Braden" />
        <meta 
          name="twitter:description"
          content="Creating apps and content to reducing human suffering and increase the quality of human consciousness."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="container py-24 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-8"
          >
            <Avatar className="h-32 w-32 mx-auto ring-2 ring-primary/10 ring-offset-2 ring-offset-background shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <AvatarImage src="/images/tanner2.0_dark-500x500.png" alt="Tanner Braden" />
              <AvatarFallback>TB</AvatarFallback>
            </Avatar>
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Hi, I'm <span className="text-primary">Tanner</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            I create apps and content to reduce human suffering and increase the quality of human consciousness.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link href="/solarislabs">
              <Button className="gap-2">
                Solaris Labs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">
                Let's Connect
                <AtSign className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Loop Machine Section */}
      <section className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter">Loop Machine</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create your own musical loops with this interactive sequencer.
            </p>
          </div>
          <LoopMachine />
        </motion.div>
      </section>

      {/* Featured Projects Section */}
      <Projects />

      {/* Latest Blog Posts */}
      <section className="container py-24 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter">Latest Articles</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore my latest thoughts and insights on technology, partnerships, and human consciousness.
            </p>
          </div>

          {isLoadingPosts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-video bg-muted rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-8 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts?.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/blog">
              <Button variant="outline" className="gap-2">
                View All Articles
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;