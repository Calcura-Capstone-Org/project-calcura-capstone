import { Sparkles, Plus, ArrowRight, Check, Minus, Dot, type LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import changelog from "../data/changelog.json";

interface ChangelogEntry {
  version: string;
  released_at: string;
  title?: string;
  sections: Record<string, string[]>;
}

const sectionAccent: Record<string, string> = {
  Added: "text-green-700 bg-green-50 border-green-200",
  Changed: "text-blue-700 bg-blue-50 border-blue-200",
  Fixed: "text-amber-700 bg-amber-50 border-amber-200",
  Removed: "text-red-700 bg-red-50 border-red-200",
};

const sectionIcon: Record<string, { Icon: LucideIcon; color: string }> = {
  Added: { Icon: Plus, color: "text-green-600" },
  Changed: { Icon: ArrowRight, color: "text-blue-600" },
  Fixed: { Icon: Check, color: "text-amber-600" },
  Removed: { Icon: Minus, color: "text-red-600" },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

interface WhatsNewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewAll?: () => void;
}

export function WhatsNewDialog({ open, onOpenChange, onViewAll }: WhatsNewDialogProps) {
  const entry: ChangelogEntry | undefined = changelog.entries?.[0];
  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "calc(100% - 2rem)",
          maxWidth: "32rem",
          maxHeight: "85vh",
          overflowY: "auto",
          zIndex: 50,
          backgroundColor: "white",
        }}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">{entry.title ?? "What's New"}</DialogTitle>
              <DialogDescription>
                v{entry.version} · {formatDate(entry.released_at)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {Object.entries(entry.sections).map(([section, items]) => {
            const { Icon, color } = sectionIcon[section] ?? { Icon: Dot, color: "text-gray-500" };
            return (
              <div key={section}>
                <span
                  className={`inline-block text-xs font-medium px-2 py-1 rounded border mb-3 ${
                    sectionAccent[section] ?? "text-gray-700 bg-gray-50 border-gray-200"
                  }`}
                >
                  {section}
                </span>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${color}`} aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          {onViewAll && (
            <Button variant="outline" onClick={onViewAll}>
              View all updates
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
