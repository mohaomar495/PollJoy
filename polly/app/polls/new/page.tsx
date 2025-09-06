"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { pollService } from "@/lib/services/poll-service";
import { PollForm } from "@/components/poll-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewPollPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleSubmit = async (data: {
    title: string;
    description: string;
    options: string[];
    endsAt?: Date;
    isPublic: boolean;
  }) => {
    if (!user) {
      setError("You must be logged in to create a poll");
      return;
    }

    if (!data.title.trim()) {
      setError("Poll title is required");
      return;
    }

    const validOptions = data.options.filter((opt) => opt.trim() !== "");

    if (validOptions.length < 2) {
      setError("You need at least 2 valid options");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const poll = {
        title: data.title,
        description: data.description || null,
        user_id: user.id,
        is_public: data.isPublic,
        allow_multiple_votes: false, // Default to false
        require_login_to_vote: false, // Default to false
        ends_at: data.endsAt ? data.endsAt.toISOString() : null,
      };

      const result = await pollService.createPoll(poll, validOptions);
      router.push(`/polls/${result.id}`);
    } catch (err) {
      console.error("Error creating poll:", err);
      setError("Failed to create poll. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create a New Poll</CardTitle>
          <CardDescription>
            Fill out the form below to create a new poll
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-3 text-sm bg-destructive/15 text-destructive rounded-md mb-4">
              {error}
            </div>
          )}
          <PollForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}
