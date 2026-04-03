import { MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";

export function FeedbackButton() {
  const handleFeedback = () => {
    toast.info("Thank you for your interest! Our feedback form is being prepared. For now, please use the Contact page to share your thoughts.");
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
      <Button 
        className="bg-green-600 hover:bg-green-700 rounded-lg px-6 py-4 flex items-center gap-2 shadow-lg"
        onClick={handleFeedback}
      >
        <MessageSquare className="w-5 h-5" />
        <span>Feedback</span>
      </Button>
    </div>
  );
}