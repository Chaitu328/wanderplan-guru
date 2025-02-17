
import { generateTripPlan } from "@/lib/groq";
import { corsHeaders } from "@/lib/cors";

export async function POST(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = req.headers.get("X-GROQ-API-KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GROQ API key is required" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body = await req.json();
    const { source, destination, dates, budget, travelers, interests } = body;

    const plan = await generateTripPlan({
      source,
      destination,
      dates,
      budget,
      travelers,
      interests,
    });

    return new Response(JSON.stringify({ plan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-trip-plan function:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate trip plan" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}
