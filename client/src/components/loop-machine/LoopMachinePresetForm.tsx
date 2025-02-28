
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoopMachinePreset, InsertLoopMachinePreset } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

// This schema should mirror the server-side schema but can add client-side validations
const loopMachinePresetFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  bpm: z.number().int().min(60, "Minimum BPM is 60").max(200, "Maximum BPM is 200"),
  volume: z.number().int().min(-40, "Minimum volume is -40").max(0, "Maximum volume is 0"),
  selectedSound: z.enum(["synth", "piano"]),
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
  ]),
  numBars: z.number().int().min(1, "Minimum bars is 1").max(4, "Maximum bars is 4"),
  melodyGrid: z.array(z.array(z.boolean())),
  rhythmGrid: z.array(z.array(z.boolean())),
  isDefault: z.boolean().default(false),
});

type LoopMachinePresetFormValues = z.infer<typeof loopMachinePresetFormSchema>;

// Helper to create empty grids
const createEmptyGrid = (rows: number, cols: number): boolean[][] => {
  return Array(rows).fill(0).map(() => Array(cols).fill(false));
};

interface LoopMachinePresetFormProps {
  initialValues?: LoopMachinePreset;
  onSubmit: (data: LoopMachinePresetFormValues) => void;
  isSubmitting?: boolean;
}

export default function LoopMachinePresetForm({ 
  initialValues, 
  onSubmit,
  isSubmitting = false
}: LoopMachinePresetFormProps) {
  const [activeTab, setActiveTab] = useState("basic");

  // Generate default values if not editing
  const defaultValues: LoopMachinePresetFormValues = {
    name: "",
    description: "",
    bpm: 120,
    volume: -10,
    selectedSound: "synth",
    selectedScale: "Pentatonic Major",
    numBars: 2,
    melodyGrid: createEmptyGrid(8, 32), // 8 notes, 16 steps per bar × 2 bars
    rhythmGrid: createEmptyGrid(4, 32), // 4 drum parts, 16 steps per bar × 2 bars
    isDefault: false,
  };

  // Get values from initialValues if provided (for editing) or use defaults
  const formValues = initialValues ? {
    ...initialValues,
    // Make sure any JSON fields are properly parsed
    melodyGrid: Array.isArray(initialValues.melodyGrid) 
      ? initialValues.melodyGrid 
      : typeof initialValues.melodyGrid === 'string' 
        ? JSON.parse(initialValues.melodyGrid as unknown as string)
        : defaultValues.melodyGrid,
    rhythmGrid: Array.isArray(initialValues.rhythmGrid) 
      ? initialValues.rhythmGrid 
      : typeof initialValues.rhythmGrid === 'string' 
        ? JSON.parse(initialValues.rhythmGrid as unknown as string) 
        : defaultValues.rhythmGrid,
  } : defaultValues;

  const form = useForm<LoopMachinePresetFormValues>({
    resolver: zodResolver(loopMachinePresetFormSchema),
    defaultValues: formValues,
  });

  // Shorthand for the form fields
  const { control, handleSubmit, watch, setValue } = form;
  
  // Watch for numBars changes to update grid sizes
  const numBars = watch("numBars");

  // Handle grid cell toggles
  const toggleMelodyCell = (row: number, col: number) => {
    const currentGrid = [...form.getValues("melodyGrid")];
    currentGrid[row][col] = !currentGrid[row][col];
    setValue("melodyGrid", currentGrid);
  };

  const toggleRhythmCell = (row: number, col: number) => {
    const currentGrid = [...form.getValues("rhythmGrid")];
    currentGrid[row][col] = !currentGrid[row][col];
    setValue("rhythmGrid", currentGrid);
  };

  // Calculate grid dimensions based on number of bars
  const gridCols = numBars * 16; // 16 steps per bar

  // Resize grids when numBars changes
  const resizeGrids = () => {
    const newCols = numBars * 16;
    
    // Resize melody grid
    const currentMelodyGrid = form.getValues("melodyGrid");
    const newMelodyGrid = currentMelodyGrid.map(row => {
      if (row.length < newCols) {
        // Add new columns
        return [...row, ...Array(newCols - row.length).fill(false)];
      } else {
        // Remove excess columns
        return row.slice(0, newCols);
      }
    });
    
    // Resize rhythm grid
    const currentRhythmGrid = form.getValues("rhythmGrid");
    const newRhythmGrid = currentRhythmGrid.map(row => {
      if (row.length < newCols) {
        // Add new columns
        return [...row, ...Array(newCols - row.length).fill(false)];
      } else {
        // Remove excess columns
        return row.slice(0, newCols);
      }
    });
    
    setValue("melodyGrid", newMelodyGrid);
    setValue("rhythmGrid", newRhythmGrid);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs 
          defaultValue="basic" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="melody">Melody Grid</TabsTrigger>
            <TabsTrigger value="rhythm">Rhythm Grid</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preset Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Preset" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Default Preset</FormLabel>
                      <FormDescription>
                        Make this the default preset for the Loop Machine
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
            </div>
            
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your preset..." 
                      className="resize-none" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="bpm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo (BPM): {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={60}
                        max={200}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={control}
                name="volume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volume: {field.value} dB</FormLabel>
                    <FormControl>
                      <Slider
                        min={-40}
                        max={0}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="selectedSound"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sound</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={control}
                name="selectedScale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scale</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={control}
              name="numBars"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Bars: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={4}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => {
                        field.onChange(value[0]);
                        // Resize grids when numBars changes
                        setTimeout(resizeGrids, 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="melody">
            <div className="space-y-4">
              <Label>Melody Grid</Label>
              <div className="overflow-x-auto pb-4">
                <div className="grid-container" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: `repeat(${gridCols}, 30px)`,
                  gap: '2px'
                }}>
                  {watch("melodyGrid").map((row, rowIndex) => (
                    row.slice(0, gridCols).map((cell, colIndex) => (
                      <Button
                        key={`m-${rowIndex}-${colIndex}`}
                        type="button"
                        variant={cell ? "default" : "outline"}
                        className="w-[30px] h-[30px] p-0"
                        onClick={() => toggleMelodyCell(rowIndex, colIndex)}
                      >
                        {cell ? "●" : ""}
                      </Button>
                    ))
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="rhythm">
            <div className="space-y-4">
              <Label>Rhythm Grid</Label>
              <div className="overflow-x-auto pb-4">
                <div className="grid-container" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: `repeat(${gridCols}, 30px)`,
                  gap: '2px'
                }}>
                  {watch("rhythmGrid").map((row, rowIndex) => (
                    row.slice(0, gridCols).map((cell, colIndex) => (
                      <Button
                        key={`r-${rowIndex}-${colIndex}`}
                        type="button"
                        variant={cell ? "default" : "outline"}
                        className="w-[30px] h-[30px] p-0"
                        onClick={() => toggleRhythmCell(rowIndex, colIndex)}
                      >
                        {cell ? "●" : ""}
                      </Button>
                    ))
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? "Saving..." : initialValues ? "Update Preset" : "Create Preset"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
