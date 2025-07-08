import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, Keyboard, Grid3X3, Activity, Volume2, Settings } from 'lucide-react';
import GridSequencer from '@/components/sequencer/GridSequencer';
import Synthesizer from '@/components/synthesizer/Synthesizer';
import { motion } from 'framer-motion';

const MusicStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState('studio');

  const features = [
    {
      icon: <Keyboard className="w-6 h-6" />,
      title: 'Virtual Synthesizer',
      description: 'Professional-grade synthesizer with ADSR envelope, filters, and effects'
    },
    {
      icon: <Grid3X3 className="w-6 h-6" />,
      title: 'Grid Sequencer',
      description: '16-step drum sequencer with multiple tracks and real-time control'
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: 'Audio Synthesis',
      description: 'Web Audio API powered sound generation with Tone.js integration'
    },
    {
      icon: <Volume2 className="w-6 h-6" />,
      title: 'Real-time Audio',
      description: 'Low-latency audio processing for responsive music creation'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Music className="w-8 h-8 text-purple-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Music Creation Studio
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Create, compose, and explore music with our web-based audio production platform. 
              Featuring real-time synthesis, sequencing, and sound manipulation tools.
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Activity className="w-3 h-3 mr-1" />
                Web Audio API
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Volume2 className="w-3 h-3 mr-1" />
                Tone.js
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Settings className="w-3 h-3 mr-1" />
                Real-time
              </Badge>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/30">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Main Studio Interface */}
          <motion.div variants={itemVariants}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
                <TabsTrigger value="studio" className="flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  Studio
                </TabsTrigger>
                <TabsTrigger value="synthesizer" className="flex items-center gap-2">
                  <Keyboard className="w-4 h-4" />
                  Synth
                </TabsTrigger>
                <TabsTrigger value="sequencer" className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4" />
                  Sequencer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="studio" className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Synthesizer className="mb-8" />
                  <GridSequencer />
                </motion.div>
              </TabsContent>

              <TabsContent value="synthesizer">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Synthesizer />
                </motion.div>
              </TabsContent>

              <TabsContent value="sequencer">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <GridSequencer />
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Instructions */}
          <motion.div variants={itemVariants} className="mt-16">
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200">
              <CardHeader>
                <CardTitle className="text-center text-xl">Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Keyboard className="w-4 h-4" />
                      Synthesizer
                    </h3>
                    <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                      <li>• Use computer keyboard or click virtual keys to play notes</li>
                      <li>• Adjust oscillator type for different waveforms</li>
                      <li>• Modify ADSR envelope for sound shaping</li>
                      <li>• Apply filters and effects for sound design</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Grid3X3 className="w-4 h-4" />
                      Sequencer
                    </h3>
                    <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                      <li>• Click grid squares to create drum patterns</li>
                      <li>• Use play/pause controls to hear your sequence</li>
                      <li>• Adjust BPM and volume for tempo control</li>
                      <li>• Clear pattern to start fresh</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default MusicStudio;