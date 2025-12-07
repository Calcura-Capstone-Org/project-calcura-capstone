import { MessageSquare } from "lucide-react";
import { Button } from "./ui/button";

export function FeedbackButton() {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
      <Button 
        className="bg-green-600 hover:bg-green-700 rounded-lg px-6 py-4 flex items-center gap-2 shadow-lg"
      >
        <MessageSquare className="w-5 h-5" />
        <span>Feedback</span>
      </Button>
    </div>
  );
}
