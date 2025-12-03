import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-amber-50 px-4 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="relative mx-auto h-40 w-40 animate-pulse rounded-full bg-amber-100">
          <MapPin className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-20 w-20 text-amber-300" />
        </div>

        <h1 className="font-extrabold text-4xl tracking-tight sm:text-5xl">Whoops! You've wandered off the map</h1>

        <p className="text-gray-500 text-lg">
          The page you're looking for seems to have taken a vacation. Maybe it's sipping cocktails on a beach somewhere?
        </p>

        <div className="pt-4">
          <Button asChild size="lg" className="gap-2 border-none bg-[#ffca36] text-black hover:bg-amber-500">
            <Link href="https://otter.id">
              <ArrowLeft className="h-4 w-4" />
              <span>Maybe recommend Otter to your friends?</span>
            </Link>
          </Button>
        </div>

        <p className="text-gray-400 text-sm">Error 404 - Page Not Found</p>
      </div>
    </div>
  );
}
