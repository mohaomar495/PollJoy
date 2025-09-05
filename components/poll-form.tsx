"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Calendar } from "lucide-react";

interface PollFormProps {
  initialData?: {
    title: string;
    description: string;
    options: string[];
  };
  onSubmit: (data: {
    title: string;
    description: string;
    options: string[];
  }) => void;
  isSubmitting?: boolean;
}

export function PollForm({
  initialData = { title: "", description: "", options: ["Option 1", "Option 2"] },
  onSubmit,
  isSubmitting = false,
}: PollFormProps) {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [options, setOptions] = useState<string[]>(initialData.options);

  const addOption = () => {
    setOptions([...options, `Option ${options.length + 1}`]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return; // Minimum 2 options
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, options });
  };

  return (
    <Card className="border-none shadow-md">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium leading-none">
                  Poll Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="What's your favorite programming language?"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium leading-none">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Provide a brief description of your poll"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium leading-none">Poll Options</label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addOption}
                    className="gap-1"
                  >
                    <span>+</span> Add Option
                  </Button>
                </div>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                        disabled={options.length <= 2}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Poll Duration</label>
                  <div className="flex items-center gap-2 p-3 border rounded-md">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">No end date (runs indefinitely)</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Privacy Settings</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border rounded-md p-3 cursor-pointer bg-primary/5 border-primary">
                      <div className="font-medium">Public</div>
                      <div className="text-sm text-muted-foreground">Anyone can view and vote</div>
                    </div>
                    <div className="border rounded-md p-3 cursor-pointer">
                      <div className="font-medium">Private</div>
                      <div className="text-sm text-muted-foreground">Only people with the link</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" type="button" asChild>
              <Link href="/polls">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Poll"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}