import { Helmet } from 'react-helmet-async';
import LoopMachine from '@/components/LoopMachine';

export default function LoopMachinePage() {
  return (
    <div className="container py-8">
      <Helmet>
        <title>Loop Machine - Tanner Braden</title>
        <meta 
          name="description"
          content="Interactive music creation tool designed to enhance creativity and consciousness through sound patterns."
        />
        <meta 
          name="keywords" 
          content="loop machine, music creation, consciousness expansion, sound patterns, digital music, interactive sound, mindfulness"
        />
        <meta property="og:title" content="Loop Machine - Tanner Braden" />
        <meta 
          property="og:description" 
          content="Interactive music creation tool designed to enhance creativity and consciousness through sound patterns."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:title" content="Loop Machine - Tanner Braden" />
        <meta 
          name="twitter:description"
          content="Interactive music creation tool designed to enhance creativity and consciousness through sound patterns."
        />
      </Helmet>

      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter">
            Loop Machine
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create your own musical loops with this interactive sequencer.
            Click on the grid cells to create melodies and rhythms!
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-4 md:p-8 border border-primary/10">
          <LoopMachine />
        </div>
      </div>
    </div>
  );
}