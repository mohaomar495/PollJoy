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
import { pollService } from "@/lib/services/poll-service";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { QRCodeSVG } from "qrcode.react";

export default function PollPage({
  params,
}: {
  params: Promise<{ pollId: string }>;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const { pollId } = use(params);

  const [poll, setPoll] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

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
          poll_id: pollId,
          option_id: optionId,
          user_id: user?.id,
        });
      }
      toast({ title: "Success", description: "Your vote has been cast!" });
      // Optionally, you can refetch the poll data to show updated results
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

  const handleDelete = async () => {
    if (!user || user.id !== poll.user_id) return;

    if (confirm("Are you sure you want to delete this poll?")) {
      try {
        await pollService.deletePoll(pollId);
        toast({ title: "Success", description: "Poll deleted successfully" });
        router.push("/polls");
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
            {user && user.id === poll.user_id && (
              <div className="flex gap-2">
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
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {poll.options.map((option: any) => (
              <div
                key={option.id}
                className={`p-4 border rounded-md cursor-pointer ${
                  selectedOptions.includes(option.id) ? "border-primary" : ""
                }`}
                onClick={() => {
                  if (selectedOptions.includes(option.id)) {
                    setSelectedOptions(
                      selectedOptions.filter((id) => id !== option.id),
                    );
                  } else {
                    setSelectedOptions([...selectedOptions, option.id]);
                  }
                }}
              >
                {option.text}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/polls">
            <Button variant="outline">Back to Polls</Button>
          </Link>
          <div className="flex gap-2">
            {user && user.id === poll.user_id && (
              <Button
                onClick={() => setShowQR(true)}
                variant="outline"
                size="lg"
              >
                Share
              </Button>
            )}
            <Button onClick={handleVote} disabled={isSubmitting}>
              {isSubmitting ? "Voting..." : "Vote"}
            </Button>
          </div>
        </CardFooter>
      </Card>
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Share Poll</h2>
            <QRCodeSVG value={window.location.href} />
            <Button onClick={() => setShowQR(false)} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
