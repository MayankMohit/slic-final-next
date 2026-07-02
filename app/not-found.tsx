import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you're looking for doesn't exist or has been moved.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-20 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="container-tight text-center">
          <h1 className="font-sans text-8xl md:text-9xl font-bold text-gradient mb-4">
            404
          </h1>
          <h2 className="font-sans text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Oops! Page not found
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&apos;s get you back on track.
          </p>
          <Button
            asChild
            size="default"
            className="bg-gradient-primary hover:opacity-90"
          >
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>

      <Footer />
    </main>
  );
}
