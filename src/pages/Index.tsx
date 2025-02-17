
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { PlaneTakeoff, Calendar, Users, Heart } from "lucide-react";
import { SettingsDialog } from "@/components/SettingsDialog";

interface TripDetails {
  source: string;
  destination: string;
  dates: string;
  budget: string;
  travelers: string;
  interests: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState<string>("");
  const [formData, setFormData] = useState<TripDetails>({
    source: "",
    destination: "",
    dates: "",
    budget: "",
    travelers: "1",
    interests: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiKey = localStorage.getItem("GROQ_API_KEY");
    
    if (!apiKey) {
      toast.error("Please set your GROQ API key in settings first");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-trip-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-GROQ-API-KEY": apiKey,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate trip plan");
      }

      const data = await response.json();
      setTripPlan(data.plan);
      toast.success("Trip plan generated successfully!");
    } catch (error) {
      toast.error("Failed to generate trip plan. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof TripDetails,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              WanderPlan
            </h1>
            <p className="text-gray-600">
              Plan your perfect journey with our AI travel assistant
            </p>
          </div>
          <SettingsDialog />
        </div>

        <Card className="p-6 shadow-lg bg-white/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="source" className="flex items-center gap-2">
                  <PlaneTakeoff className="w-4 h-4" />
                  Departure City
                </Label>
                <Input
                  id="source"
                  placeholder="Enter your departure city"
                  value={formData.source}
                  onChange={(e) => handleInputChange("source", e.target.value)}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination" className="flex items-center gap-2">
                  <PlaneTakeoff className="w-4 h-4 rotate-90" />
                  Destination
                </Label>
                <Input
                  id="destination"
                  placeholder="Where do you want to go?"
                  value={formData.destination}
                  onChange={(e) => handleInputChange("destination", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dates" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Travel Dates
                </Label>
                <Input
                  id="dates"
                  type="text"
                  placeholder="When do you plan to travel?"
                  value={formData.dates}
                  onChange={(e) => handleInputChange("dates", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="flex items-center gap-2">
                  <span className="text-sm">$</span>
                  Budget
                </Label>
                <Input
                  id="budget"
                  placeholder="Your budget in USD"
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="travelers" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Number of Travelers
                </Label>
                <Select
                  value={formData.travelers}
                  onValueChange={(value) => handleInputChange("travelers", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of travelers" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Traveler" : "Travelers"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests" className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Interests
                </Label>
                <Input
                  id="interests"
                  placeholder="e.g., Culture, Food, Adventure"
                  value={formData.interests}
                  onChange={(e) => handleInputChange("interests", e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Generating your plan..." : "Plan My Trip"}
            </Button>
          </form>
        </Card>

        {tripPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <Card className="p-6 shadow-lg bg-white/80 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-4">Your Trip Plan</h2>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap">{tripPlan}</pre>
              </div>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Index;
