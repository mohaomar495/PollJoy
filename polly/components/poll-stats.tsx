'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PollWithOptionsAndVotes } from "@/lib/services/poll-service";

interface PollStatsProps {
  poll: PollWithOptionsAndVotes;
}

export function PollStats({ poll }: PollStatsProps) {
  const totalVotes = poll.votes.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">Total Votes: {totalVotes}</p>
        <div className="space-y-3">
          {poll.options.map((option) => {
            const voteCount = poll.votes.filter(
              (v) => v.option_id === option.id
            ).length;
            const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

            return (
              <div key={option.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{option.text}</span>
                  <span className="text-sm text-muted-foreground">
                    {voteCount} vote{voteCount !== 1 ? 's' : ''} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
