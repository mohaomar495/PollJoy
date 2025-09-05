import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PollCardProps {
  id: string;
  title: string;
  description: string;
  optionsCount: number;
  votesCount: number;
  createdAt: string;
}

export function PollCard({
  id,
  title,
  description,
  optionsCount,
  votesCount,
  createdAt,
}: PollCardProps) {
  return (
    <Link href={`/polls/${id}`} className="block h-full">
      <Card className="h-full flex flex-col hover:border-primary/50 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <CardDescription className="line-clamp-2 text-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <p>{optionsCount} options</p>
            <p>{votesCount} total votes</p>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <p className="text-xs text-muted-foreground">
            Created on {createdAt}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}