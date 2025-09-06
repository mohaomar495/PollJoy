"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PollCard } from "@/components/poll-card";
import { useAuth } from "@/contexts/auth-context";
import { pollService, PollWithOptions } from "@/lib/services/poll-service";
import Fuse from "fuse.js";

export default function PollsPage() {
  const { user } = useAuth();
  const [polls, setPolls] = useState<PollWithOptions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPublicPolls = async () => {
      try {
        const publicPolls = await pollService.getPublicPolls();
        setPolls(publicPolls);
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

    fetchPublicPolls();
  }, []);

  const fuse = new Fuse(polls, {
    keys: ["title", "description"],
    includeScore: true,
    threshold: 0.4,
  });

  const searchResults = searchQuery
    ? fuse.search(searchQuery).map((result) => result.item)
    : polls;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Public Polls</h1>
        {user && (
          <Button asChild>
            <Link href="/polls/new">Create New Poll</Link>
          </Button>
        )}
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search polls..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
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

      {!loading && searchResults.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">
            {searchQuery
              ? `No results found for "${searchQuery}"`
              : "No public polls available"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "Try searching for something else."
              : "Check back later for more polls"}
          </p>
        </div>
      )}

      {!loading && searchResults.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {searchResults.map((poll) => (
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
              createdBy={poll.username ?? undefined}
              endsAt={poll.ends_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}
