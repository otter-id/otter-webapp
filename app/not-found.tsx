import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-amber-50 px-4 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="relative mx-auto h-40 w-40 animate-pulse rounded-full bg-amber-100">
          <MapPin className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 text-amber-300" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Whoops! You've wandered off the map</h1>

        <p className="text-lg text-gray-500">
          The page you're looking for seems to have taken a vacation. Maybe it's sipping cocktails on a beach somewhere?
        </p>

        <div className="pt-4">
          <Button asChild size="lg" className="gap-2 bg-[#ffca36] hover:bg-amber-500 text-black border-none">
            <Link href="https://otter.id">
              <ArrowLeft className="h-4 w-4" />
              <span>Maybe recommend Otter to your friends?</span>
            </Link>
          </Button>
        </div>

        <p className="text-sm text-gray-400">Error 404 - Page Not Found</p>
      </div>
    </div>
  );
}
