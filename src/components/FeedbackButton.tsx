/*Jonathan Torres wrote all 15 lines of code for this file */
import { MessageSquare } from "lucide-react";
import { Button } from "./ui/button";

/* API URL */
const API_URL = import.meta.env.VITE_API_URL;

//remove later
console.log("API_URL =", API_URL);

export function FeedbackButton() {
  return (
    <div className="fixed z-50" style={{ right: "1rem", bottom: "1rem" }}>
      <Button 
        className="bg-green-600 hover:bg-green-700 rounded-lg px-6 py-4 flex items-center gap-2 shadow-lg"
      >
        <MessageSquare className="w-5 h-5" />
        <span>Feedback</span>
      </Button>
    </div>
  );
}
