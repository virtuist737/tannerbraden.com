
import { Helmet } from 'react-helmet-async';
import LoopMachine from '@/components/LoopMachine';

export default function LoopMachinePage() {
  return (
    <div className="container py-8">
      <Helmet>
        <title>Loop Machine | Tanner Braden</title>
        <meta 
          name="description"
          content="Create your own musical loops with this interactive sequencer."
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
