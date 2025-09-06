"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import {
  pollService,
  PollWithOptionsAndVotes,
} from "@/lib/services/poll-service";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { QRCodeSVG } from "qrcode.react";
import { PollStats } from "@/components/poll-stats";
import { PollVote } from "@/components/poll-vote";

const getVoterFingerprint = (): string => {
  const fingerprint = localStorage.getItem("voter_fingerprint");
  if (fingerprint) {
    return fingerprint;
  }
  const newFingerprint = crypto.randomUUID();
  localStorage.setItem("voter_fingerprint", newFingerprint);
  return newFingerprint;
};

export default function PollPage({
  params,
}: {
  params: Promise<{ pollId: string }>;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const { pollId } = use(params);

  const [poll, setPoll] = useState<PollWithOptionsAndVotes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [voterFingerprint, setVoterFingerprint] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const pollData = await pollService.getPollById(pollId);
        if (!pollData) {
          setError("Poll not found");
          return;
        }
        setPoll(pollData);
      } catch (err) {
        console.error("Error fetching poll:", err);
        setError("Failed to load poll data");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [pollId]);

  useEffect(() => {
    if (!poll) return;

    const checkVotedStatus = async () => {
      let fingerprint: string | null = null;
      if (!user) {
        fingerprint = getVoterFingerprint();
        setVoterFingerprint(fingerprint);
      }

      const voted = await pollService.hasVoted(
        poll.id,
        user?.id,
        fingerprint || undefined,
      );
      setHasVoted(voted);
    };

    checkVotedStatus();
  }, [poll, user]);

  const handleDelete = async () => {
    if (!user || !poll || user.id !== poll.user_id) return;

    if (confirm("Are you sure you want to delete this poll?")) {
      try {
        await pollService.deletePoll(pollId);
        toast({ title: "Success", description: "Poll deleted successfully" });
        router.push("/my-polls");
      } catch (err) {
        console.error("Error deleting poll:", err);
        toast({
          title: "Error",
          description: "Failed to delete poll. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading poll...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="py-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <Link href="/polls">
              <Button className="mt-4">Go to Polls</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!poll) {
    return null; // Should not happen if error is handled, but good practice
  }

  const isOwner = user?.id === poll.user_id;

  return (
    <div className="container mx-auto py-8">
      <Toaster />
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{poll.title}</CardTitle>
              <CardDescription>{poll.description}</CardDescription>
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <Button onClick={() => setShowQR(true)} variant="outline">
                  Share
                </Button>
                <Link href={`/polls/${pollId}/edit`}>
                  <Button variant="outline">Edit</Button>
                </Link>
                <Button onClick={handleDelete} variant="destructive">
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isOwner ? (
            <PollStats poll={poll} />
          ) : (
            <PollVote
              user={user}
              poll={poll}
              hasVoted={hasVoted}
              voterFingerprint={voterFingerprint}
            />
          )}
        </CardContent>
        <CardFooter>
          <Link href="/polls">
            <Button variant="outline">Back to Polls</Button>
          </Link>
        </CardFooter>
      </Card>
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-8 rounded-lg shadow-lg relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowQR(false)}
              className="absolute top-2 right-2"
            >
              &times;
            </Button>
            <h2 className="text-2xl font-bold mb-4 text-center">Share Poll</h2>
            <div className="p-4 bg-white rounded-md">
              <QRCodeSVG value={window.location.href} size={256} />
            </div>
            <p className="text-center text-muted-foreground mt-4 break-all">
              {window.location.href}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
