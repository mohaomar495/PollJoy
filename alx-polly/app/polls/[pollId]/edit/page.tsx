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

export default function EditPollPage({
  params,
}: {
  params: Promise<{ pollId: string }>;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const { pollId } = use(params); // Unwrap params properly

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<Array<{ id?: string; text: string }>>(
    [],
  );
  const [isPublic, setIsPublic] = useState(true);
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false);
  const [requireLogin, setRequireLogin] = useState(false);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  // Fetch poll data
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchPoll = async () => {
      try {
        const pollData = await pollService.getPollById(pollId);

        if (!pollData) {
          setError("Poll not found");
          return;
        }

        if (pollData.user_id !== user.id) {
          setError("You don't have permission to edit this poll");
          return;
        }

        setTitle(pollData.title);
        setDescription(pollData.description || "");
        setIsPublic(pollData.is_public);
        setAllowMultipleVotes(pollData.allow_multiple_votes);
        setRequireLogin(pollData.require_login_to_vote);
        setEndDate(pollData.ends_at ? new Date(pollData.ends_at) : null);
        setOptions(
          pollData.options.map((opt) => ({ id: opt.id, text: opt.text })),
        );
      } catch (err: unknown) {
        // Properly handle unknown error types
        const message =
          err instanceof Error
            ? err.message
            : err && typeof err === "object" && "message" in err
              ? (err as any).message
              : JSON.stringify(err);

        console.error("Error fetching poll:", message);
        setError("Failed to load poll data");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [pollId, user, router]);

  // Option handlers
  const addOption = () =>
    setOptions([...options, { text: `Option ${options.length + 1}` }]);
  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], text: value };
    setOptions(newOptions);
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return setError("You must be logged in to edit a poll");
    if (!title.trim()) return setError("Poll title is required");

    const validOptions = options.filter((opt) => opt.text.trim() !== "");
    if (validOptions.length < 2)
      return setError("You need at least 2 valid options");

    setIsSubmitting(true);
    setError(null);

    try {
      await pollService.updatePoll(
        {
          id: pollId,
          title,
          description: description || null,
          user_id: user.id,
          is_public: isPublic,
          allow_multiple_votes: allowMultipleVotes,
          require_login_to_vote: requireLogin,
          ends_at: endDate,
        },
        validOptions,
      );
      toast({ title: "Success", description: "Poll updated successfully" });
      router.push(`/polls/${pollId}`);
    } catch (err) {
      console.error("Error updating poll:", err);
      setError("Failed to update poll. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading poll...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto py-8">
        <div className="mb-4">
          <Link href={`/polls/${pollId}`} className="text-primary">
            <Button variant="ghost" size="sm">
              ← Back to Poll
            </Button>
          </Link>
        </div>
        <Card className="max-w-3xl mx-auto">
          <CardContent className="py-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <Link href="/polls">
              <Button className="mt-4">Go to My Polls</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="container mx-auto py-8">
      <Toaster />
      <Card className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Poll</CardTitle>
            <CardDescription>Update your poll details below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-destructive/15 text-destructive rounded-md">
                {error}
              </div>
            )}
            {step === 1 && (
              <>
                {/* Poll title */}
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium leading-none"
                  >
                    Poll Title
                  </label>
                  <input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    type="text"
                    placeholder="Enter the title of your poll"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium leading-none"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a brief description of your poll"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                {/* Options */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium leading-none">
                      Poll Options
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                    >
                      Add Option
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add at least 2 options for your poll
                  </p>
                  <div className="space-y-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) =>
                            handleOptionChange(index, e.target.value)
                          }
                          placeholder={`Option ${index + 1}`}
                          className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(index)}
                          disabled={options.length <= 2}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            {step === 2 && (
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="isPublic"
                    className="text-sm font-medium leading-none"
                  >
                    Make this poll public
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allowMultipleVotes"
                    checked={allowMultipleVotes}
                    onChange={(e) => setAllowMultipleVotes(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="allowMultipleVotes"
                    className="text-sm font-medium leading-none"
                  >
                    Allow users to vote for multiple options
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requireLogin"
                    checked={requireLogin}
                    onChange={(e) => setRequireLogin(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="requireLogin"
                    className="text-sm font-medium leading-none"
                  >
                    Require users to be logged in to vote
                  </label>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="endDate"
                    className="text-sm font-medium leading-none"
                  >
                    Poll End Date (Optional)
                  </label>
                  <input
                    id="endDate"
                    type="datetime-local"
                    onChange={(e) => setEndDate(e.target.valueAsDate)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            )}
          </CardContent>

          {/* Footer */}
          <CardFooter className="flex justify-between">
            <Link href={`/polls/${pollId}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <div className="flex gap-2">
              {step === 1 && (
                <Button type="button" onClick={() => setStep(2)}>
                  Next
                </Button>
              )}
              {step === 2 && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Previous
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              )}
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
