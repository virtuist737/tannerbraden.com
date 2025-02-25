import { useEffect, useState, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Volume2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import LoopMachine from '@/components/LoopMachine';

const GRID_SIZE = 8;
const DEFAULT_BPM = 120;

export default function Loop() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Loop Machine</h1>
      <LoopMachine />
    </div>
  );
}