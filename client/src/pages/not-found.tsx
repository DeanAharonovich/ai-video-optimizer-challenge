import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Page Not Found</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          We couldn't find the page you were looking for. It might have been moved or doesn't exist.
        </p>

        <Link href="/">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
