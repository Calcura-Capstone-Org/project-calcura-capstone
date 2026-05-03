/* Jonathan Torres wrote all 111 lines of code for this file */
import { useEffect } from "react";
import { Card } from "./ui/card";
import { Sparkles, Plus, ArrowRight, Check, Minus, Dot, type LucideIcon } from "lucide-react";
import changelog from "../data/changelog.json";

const SEEN_KEY = "calcura.changelogSeen";

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

export function ChangelogPage() {
  const entries: ChangelogEntry[] = changelog.entries ?? [];

  useEffect(() => {
    // Visiting the page acknowledges the current release — clears the footer
    // "new" dot for this browser. Re-armed automatically when changelog.version
    // changes on the next release build.
    try {
      if (changelog.version) localStorage.setItem(SEEN_KEY, changelog.version);
    } catch {
      // localStorage unavailable — silently no-op.
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-4xl text-gray-900 mb-2">What's New</h1>
          <p className="text-gray-600">Recent updates and improvements to Calcura.</p>
        </div>

        {entries.length === 0 ? (
          <Card className="p-8 text-center text-gray-600">
            No updates yet. Check back after the next release.
          </Card>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => (
              <Card key={entry.version} className="p-8 border-l-4 border-l-indigo-400">
                <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
                  <div>
                    <h2 className="text-2xl text-gray-900">
                      {entry.title ?? `Version ${entry.version}`}
                    </h2>
                    <p className="text-sm text-gray-500">
                      v{entry.version} · {formatDate(entry.released_at)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(entry.sections).map(([section, items]) => {
                    const { Icon, color } = sectionIcon[section] ?? { Icon: Dot, color: "text-gray-500" };
                    return (
                      <div key={section}>
                        <span
                          className={`inline-block text-xs font-medium px-2 py-1 rounded border ${
                            sectionAccent[section] ?? "text-gray-700 bg-gray-50 border-gray-200"
                          }`}
                        >
                          {section}
                        </span>
                        <ul className="mt-8 space-y-2 text-gray-700">
                          {items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <Icon className={`w-4 h-4 mt-1 shrink-0 ${color}`} aria-hidden />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
