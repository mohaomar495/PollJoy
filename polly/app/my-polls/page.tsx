"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PollCard } from "@/components/poll-card";
import { useAuth } from "@/contexts/auth-context";
import { pollService, PollWithOptions } from "@/lib/services/poll-service";

export default function MyPollsPage() {
  const { user } = useAuth();
  const [polls, setPolls] = useState<PollWithOptions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolls = async () => {
      if (!user) return;
      try {
        const userPolls = await pollService.getUserPolls(user.id);
        setPolls(userPolls);
      } catch (err) {
        console.error(
          "Error fetching polls:",
          err instanceof Error ? err.message : JSON.stringify(err),
        );
        setError("Failed to load polls. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, [user]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Polls</h1>
        <Button asChild>
          <Link href="/polls/new">Create New Poll</Link>
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="p-4 mb-6 text-sm bg-destructive/15 text-destructive rounded-md">
          {error}
        </div>
      )}

      {!loading && polls.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">
            You haven't created any polls yet
          </h2>
          <p className="text-muted-foreground mb-6">
            Create your first poll to get started
          </p>
          <Button asChild>
            <Link href="/polls/new">Create Your First Poll</Link>
          </Button>
        </div>
      )}

      {!loading && polls.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <PollCard
              key={poll.id}
              id={poll.id}
              title={poll.title}
              description={poll.description || ""}
              optionsCount={poll.options.length}
              votesCount={poll.votes_count}
              createdAt={
                poll.created_at
                  ? new Date(poll.created_at).toLocaleDateString()
                  : ""
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
