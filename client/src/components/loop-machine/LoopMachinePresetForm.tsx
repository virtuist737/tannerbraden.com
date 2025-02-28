import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { InsertLoopMachinePreset, LoopMachinePreset } from "@shared/schema";

// Form schema for loop machine presets
const loopMachinePresetFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  bpm: z.number().int().min(60).max(200).default(120),
  volume: z.number().int().min(-40).max(0).default(-10),
  selectedSound: z.enum(["synth", "piano"]).default("synth"),
  selectedScale: z.enum([
    "Pentatonic Major",
    "Pentatonic Minor",
    "Ionian Mode",
    "Harmonic Minor",
    "Melodic Minor",
    "Blues Scale",
    "Dorian Mode",
    "Mixolydian Mode",
    "Phrygian Mode",
    "Japanese Hirajoshi"
  ]).default("Pentatonic Major"),
  numBars: z.number().int().min(1).max(4).default(2),
  melodyGrid: z.array(z.array(z.boolean())),
  rhythmGrid: z.array(z.array(z.boolean())),
  isDefault: z.boolean().default(false),
});

type LoopMachinePresetFormValues = z.infer<typeof loopMachinePresetFormSchema>;

interface LoopMachinePresetFormProps {
  initialData?: LoopMachinePreset;
  onSubmit: (data: LoopMachinePresetFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export default function LoopMachinePresetForm({ 
  initialData, 
  onSubmit, 
  isSubmitting = false 
}: LoopMachinePresetFormProps) {
  // Create empty grid based on number of bars
  const createEmptyMelodyGrid = (bars: number) => 
    Array(8).fill(null).map(() => Array(8 * bars).fill(false));
  
  const createEmptyRhythmGrid = (bars: number) => 
    Array(3).fill(null).map(() => Array(8 * bars).fill(false));

  // Set default values based on initial data or defaults
  const defaultValues: Partial<LoopMachinePresetFormValues> = initialData ? {
    ...initialData,
  } : {
    name: "",
    description: "",
    bpm: 120,
    volume: -10,
    selectedSound: "synth",
    selectedScale: "Pentatonic Major",
    numBars: 2,
    melodyGrid: createEmptyMelodyGrid(2),
    rhythmGrid: createEmptyRhythmGrid(2),
    isDefault: false,
  };

  const form = useForm<LoopMachinePresetFormValues>({
    resolver: zodResolver(loopMachinePresetFormSchema),
    defaultValues,
  });

  // Watch numBars to update grid size
  const numBars = form.watch("numBars");

  // Handle submission
  const handleSubmit = async (data: LoopMachinePresetFormValues) => {
    try {
      await onSubmit(data);
      form.reset(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="My awesome preset" {...field} />
                </FormControl>
                <FormDescription>
                  A descriptive name for this preset
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="A short description of this preset" 
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Optional description for your preset
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="bpm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BPM: {field.value}</FormLabel>
                <FormControl>
                  <Slider
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    min={60}
                    max={200}
                    step={1}
                  />
                </FormControl>
                <FormDescription>
                  Beats per minute (tempo)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="volume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volume: {field.value} dB</FormLabel>
                <FormControl>
                  <Slider
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    min={-40}
                    max={0}
                    step={1}
                  />
                </FormControl>
                <FormDescription>
                  Master volume level
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="selectedSound"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sound</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sound" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="synth">Synth</SelectItem>
                    <SelectItem value="piano">Piano</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Instrument sound for melody
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="selectedScale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scale</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a scale" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pentatonic Major">Pentatonic Major</SelectItem>
                    <SelectItem value="Pentatonic Minor">Pentatonic Minor</SelectItem>
                    <SelectItem value="Ionian Mode">Ionian Mode</SelectItem>
                    <SelectItem value="Harmonic Minor">Harmonic Minor</SelectItem>
                    <SelectItem value="Melodic Minor">Melodic Minor</SelectItem>
                    <SelectItem value="Blues Scale">Blues Scale</SelectItem>
                    <SelectItem value="Dorian Mode">Dorian Mode</SelectItem>
                    <SelectItem value="Mixolydian Mode">Mixolydian Mode</SelectItem>
                    <SelectItem value="Phrygian Mode">Phrygian Mode</SelectItem>
                    <SelectItem value="Japanese Hirajoshi">Japanese Hirajoshi</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Musical scale for melody notes
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numBars"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Bars</FormLabel>
                <Select
                  value={field.value.toString()}
                  onValueChange={(value) => {
                    const newBars = parseInt(value);
                    field.onChange(newBars);
                    
                    // Update the grid size when number of bars changes
                    form.setValue("melodyGrid", createEmptyMelodyGrid(newBars));
                    form.setValue("rhythmGrid", createEmptyRhythmGrid(newBars));
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of bars" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1 Bar</SelectItem>
                    <SelectItem value="2">2 Bars</SelectItem>
                    <SelectItem value="3">3 Bars</SelectItem>
                    <SelectItem value="4">4 Bars</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Number of bars in the loop
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Set as Default</FormLabel>
                <FormDescription>
                  Make this the default preset that loads when users open the Loop Machine
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="p-4">
            <h3 className="font-medium mb-2">Melody Grid</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You can edit the grid pattern in the Loop Machine interface after saving this preset.
            </p>
            {/* Hidden field for melodyGrid */}
            <input 
              type="hidden" 
              {...form.register("melodyGrid")} 
            />
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-2">Rhythm Grid</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You can edit the drum pattern in the Loop Machine interface after saving this preset.
            </p>
            {/* Hidden field for rhythmGrid */}
            <input 
              type="hidden" 
              {...form.register("rhythmGrid")} 
            />
          </Card>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Update Preset" : "Create Preset"}
          </Button>
        </div>
      </form>
    </Form>
  );
}