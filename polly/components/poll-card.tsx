"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

interface PollCardProps {
  id: string;
  title: string;
  description: string;
  optionsCount: number;
  votesCount: number;
  createdAt: string;
  createdBy?: string;
  endsAt?: string | null;
}

const formatTimeRemaining = (endDate: Date): string => {
  const now = new Date();
  const difference = endDate.getTime() - now.getTime();

  if (difference <= 0) {
    return "Poll has ended";
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  let remaining = "";
  if (days > 0) remaining += `${days}d `;
  if (hours > 0) remaining += `${hours}h `;
  if (minutes > 0) remaining += `${minutes}m `;
  if (days === 0 && hours === 0 && minutes < 30) remaining += `${seconds}s `;

  return remaining.trim() + " left";
};

export function PollCard({
  id,
  title,
  description,
  optionsCount,
  votesCount,
  createdAt,
  createdBy,
  endsAt,
}: PollCardProps) {
  const [timeRemaining, setTimeRemaining] = useState<string | null>(
    endsAt ? formatTimeRemaining(new Date(endsAt)) : null,
  );

  useEffect(() => {
    if (!endsAt) return;

    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(new Date(endsAt)));
    }, 1000);

    return () => clearInterval(interval);
  }, [endsAt]);

  return (
    <Link href={`/polls/${id}`} className="block h-full">
      <Card className="h-full flex flex-col hover:border-primary/50 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <CardDescription className="line-clamp-2 text-sm">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2 flex-grow">
          <div className="flex justify-between text-sm text-muted-foreground">
            <p>{optionsCount} options</p>
            <p>{votesCount} total votes</p>
          </div>
          {timeRemaining && (
            <p className="text-sm font-medium text-primary mt-2">
              {timeRemaining}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex-col items-start pt-0 mt-auto">
          <p className="text-xs text-muted-foreground">
            Created on {createdAt}
          </p>
          {createdBy && (
            <p className="text-xs text-muted-foreground">
              Created by {createdBy}
            </p>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
