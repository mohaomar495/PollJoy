import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PollCard } from "@/components/poll-card";

// Mock data for recent polls
const recentPolls = [
  {
    id: "1",
    title: "Favorite Programming Language",
    description: "What programming language do you prefer to use?",
    optionsCount: 5,
    votesCount: 140,
    createdAt: "10/15/2023",
  },
  {
    id: "2",
    title: "Best Frontend Framework",
    description: "Which frontend framework do you think is the best?",
    optionsCount: 4,
    votesCount: 98,
    createdAt: "10/12/2023",
  },
  {
    id: "3",
    title: "Preferred Database",
    description: "What database do you prefer for your projects?",
    optionsCount: 6,
    votesCount: 75,
    createdAt: "10/10/2023",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Polly</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Create and share polls with your friends and colleagues
        </p>
        <Button asChild size="lg">
          <Link href="/polls/new">Create Your First Poll</Link>
        </Button>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Polls</h2>
          <Button variant="outline" asChild>
            <Link href="/polls">View All Polls</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentPolls.map((poll) => (
            <PollCard
              key={poll.id}
              id={poll.id}
              title={poll.title}
              description={poll.description}
              optionsCount={poll.optionsCount}
              votesCount={poll.votesCount}
              createdAt={poll.createdAt}
            />
          ))}
        </div>
      </div>

      <div className="bg-muted p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-4">
            <div className="text-3xl font-bold text-primary mb-2">1</div>
            <h3 className="text-lg font-medium mb-2">Create a Poll</h3>
            <p className="text-muted-foreground">Design your poll with multiple options and a clear description</p>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-primary mb-2">2</div>
            <h3 className="text-lg font-medium mb-2">Share with Others</h3>
            <p className="text-muted-foreground">Send the poll link to friends, colleagues, or social media</p>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-primary mb-2">3</div>
            <h3 className="text-lg font-medium mb-2">Collect Responses</h3>
            <p className="text-muted-foreground">Watch the results come in real-time with detailed analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
