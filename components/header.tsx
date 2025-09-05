"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";

export function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold">
            ALX Polly
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/polls"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Public Polls
            </Link>
            {user && (
              <Link
                href="/my-polls"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                My Polls
              </Link>
            )}
            <Link
              href="/polls/new"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Create Poll
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button asChild>
                <Link href="/polls/new">Create Poll</Link>
              </Button>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?name=${user.email?.split("@")[0]}`}
                    alt={user.email || "User"}
                  />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
