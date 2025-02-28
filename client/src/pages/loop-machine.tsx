import { motion } from "framer-motion";
import { Helmet } from 'react-helmet-async';
import LoopMachine from '@/components/LoopMachine';

export default function LoopMachinePage() {
  return (
    <div className="container py-8">
      <Helmet>
        <title>Loop Machine - Tanner Braden</title>
        <meta 
          name="description"
          content="Interactive music creation tool."
        />
        <meta 
          name="keywords" 
          content="loop machine, music creation, consciousness expansion, sound patterns, digital music, interactive sound, mindfulness"
        />
        <meta property="og:title" content="Loop Machine - Tanner Braden" />
        <meta 
          property="og:description" 
          content="Interactive music creation tool."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="https://res.cloudinary.com/dvk20sglr/image/upload/v1739851169/tanner2.0_dark-500x500_f0dznv.png" />
        <meta name="twitter:title" content="Loop Machine - Tanner Braden" />
        <meta 
          name="twitter:description"
          content="Interactive music creation tool."
        />
        <meta name="twitter:image" content="https://res.cloudinary.com/dvk20sglr/image/upload/v1739851169/tanner2.0_dark-500x500_f0dznv.png" />
      </Helmet>

        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                <span className="inline-block text-primary animate-pulse">♫</span> Loop Machine <span className="inline-block text-primary animate-pulse">♫</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Create your own musical loops with this interactive sequencer.
                Click on the grid cells to create melodies and rhythms!
              </p>
            </div>
            
            <div className="bg-card rounded-xl shadow-lg p-4 md:p-8 border border-primary/10">
                  <LoopMachine />
                </div>
              </motion.div>
            </div>
      </div>
  );
}