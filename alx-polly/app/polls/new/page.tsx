"use client";

import { useState, useEffect } from "react";
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

export default function NewPollPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<string[]>(["Option 1", "Option 2"]);
  const [isPublic, setIsPublic] = useState(true);
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false);
  const [requireLogin, setRequireLogin] = useState(false);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to create a poll");
      return;
    }

    if (!title.trim()) {
      setError("Poll title is required");
      return;
    }

    const validOptions = options.filter((opt) => opt.trim() !== "");

    if (validOptions.length < 2) {
      setError("You need at least 2 valid options");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const poll = {
        title,
        description: description || null,
        user_id: user.id,
        is_public: isPublic,
        allow_multiple_votes: allowMultipleVotes,
        require_login_to_vote: requireLogin,
        ends_at: endDate,
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
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl">Create a New Poll</CardTitle>
            <CardDescription>
              {step === 1
                ? "Fill out the form below to create a new poll"
                : "Optional settings for your poll"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-destructive/15 text-destructive rounded-md">
                {error}
              </div>
            )}
            {step === 1 && (
              <>
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
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="What's your favorite programming language?"
                  />
                </div>
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
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Provide a brief description of your poll"
                  />
                </div>
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
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(index, e.target.value)
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder={`Option ${index + 1}`}
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
                <h3 className="text-sm font-medium leading-none mb-3">
                  Poll Settings
                </h3>

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
                    className="text-sm font--medium leading-none"
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
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" asChild>
              <Link href="/polls">Cancel</Link>
            </Button>
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
                    {isSubmitting ? "Creating..." : "Create Poll"}
                  </Button>
                  <Button
                    type="submit"
                    variant="secondary"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                  >
                    Skip for now
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
