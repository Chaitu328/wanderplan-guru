
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function SettingsDialog() {
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [serpApiKey, setSerpApiKey] = useState("");

  useEffect(() => {
    const savedGeminiKey = localStorage.getItem("GEMINI_API_KEY");
    const savedSerpKey = localStorage.getItem("SERP_API_KEY");
    if (savedGeminiKey) setGeminiApiKey(savedGeminiKey);
    if (savedSerpKey) setSerpApiKey(savedSerpKey);
  }, []);

  const handleSave = () => {
    localStorage.setItem("GEMINI_API_KEY", geminiApiKey);
    localStorage.setItem("SERP_API_KEY", serpApiKey);
    toast.success("API keys saved successfully!");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="gemini-api-key">Gemini API Key</Label>
            <Input
              id="gemini-api-key"
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
            />
            <p className="text-sm text-muted-foreground">
              Get your API key from{" "}
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="serp-api-key">SerpAPI Key</Label>
            <Input
              id="serp-api-key"
              type="password"
              value={serpApiKey}
              onChange={(e) => setSerpApiKey(e.target.value)}
              placeholder="Enter your SerpAPI key"
            />
            <p className="text-sm text-muted-foreground">
              Get your API key from{" "}
              <a
                href="https://serpapi.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                SerpAPI Dashboard
              </a>
            </p>
          </div>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
