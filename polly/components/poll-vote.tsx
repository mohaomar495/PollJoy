"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  pollService,
  PollWithOptionsAndVotes,
} from "@/lib/services/poll-service";
import { User } from "@supabase/supabase-js";

interface PollVoteProps {
  poll: PollWithOptionsAndVotes;
  user: User | null;
  hasVoted: boolean;
  voterFingerprint: string | null;
}

export function PollVote({
  poll,
  user,
  hasVoted: initialHasVoted,
  voterFingerprint,
}: PollVoteProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(initialHasVoted);

  useEffect(() => {
    setHasVoted(initialHasVoted);
  }, [initialHasVoted]);

  const handleVote = async () => {
    if (!user && poll.require_login_to_vote) {
      toast({
        title: "Error",
        description: "You must be logged in to vote.",
        variant: "destructive",
      });
      return;
    }

    if (selectedOptions.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one option to vote.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      for (const optionId of selectedOptions) {
        await pollService.vote({
          poll_id: poll.id,
          option_id: optionId,
          user_id: user?.id,
          voter_fingerprint: user ? null : voterFingerprint,
        });
      }
      toast({ title: "Success", description: "Your vote has been cast!" });
      setHasVoted(true);
    } catch (err) {
      console.error("Error casting vote:", err);
      toast({
        title: "Error",
        description: "Failed to cast your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {poll.options.map((option: any) => (
          <div
            key={option.id}
            className={`p-4 border rounded-md cursor-pointer ${
              selectedOptions.includes(option.id) ? "border-primary" : ""
            } ${hasVoted ? "cursor-not-allowed opacity-50" : ""}`}
            onClick={() => {
              if (hasVoted) return;
              if (poll.allow_multiple_votes) {
                if (selectedOptions.includes(option.id)) {
                  setSelectedOptions(
                    selectedOptions.filter((id) => id !== option.id),
                  );
                } else {
                  setSelectedOptions([...selectedOptions, option.id]);
                }
              } else {
                setSelectedOptions([option.id]);
              }
            }}
          >
            {option.text}
          </div>
        ))}
      </div>
      <Button
        onClick={handleVote}
        disabled={isSubmitting || hasVoted}
        className="w-full"
      >
        {hasVoted ? "Voted" : isSubmitting ? "Voting..." : "Vote"}
      </Button>
    </div>
  );
}
