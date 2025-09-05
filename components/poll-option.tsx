"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PollOptionProps {
  id: string;
  text: string;
  votes: number;
  totalVotes: number;
  selected?: boolean;
  onVote?: (id: string) => void;
  showResults?: boolean;
  multipleAllowed?: boolean;
}

export function PollOption({
  id,
  text,
  votes,
  totalVotes,
  selected = false,
  onVote,
  showResults = false,
  multipleAllowed = false,
}: PollOptionProps) {
  const percentage = Math.round((votes / (totalVotes || 1)) * 100);

  return (
    <div 
      className={`border rounded-md p-3 mb-2 transition-all ${selected ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5" : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/30"}`}
      onClick={() => !showResults && onVote?.(id)}
    >
      {showResults ? (
        <>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{text}</span>
            <span className="text-sm text-muted-foreground">
              {votes} votes ({percentage}%)
            </span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <div 
            className={`w-5 h-5 ${multipleAllowed ? 'rounded-sm' : 'rounded-full'} border ${selected ? "bg-primary border-primary" : "border-muted-foreground"} flex items-center justify-center`}
          >
            {selected && (
              multipleAllowed ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                  <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                </svg>
              ) : (
                <div className="w-2 h-2 rounded-full bg-white" />
              )
            )}
          </div>
          <span className="font-medium">{text}</span>
        </div>
      )}
    </div>
  );
}