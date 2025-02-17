
const generateTripPlan = async ({
  source,
  destination,
  dates,
  budget,
  travelers,
  interests,
}: {
  source: string;
  destination: string;
  dates: string;
  budget: string;
  travelers: string;
  interests: string;
}) => {
  const apiKey = localStorage.getItem("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("Gemini API key not found");
  }

  const prompt = `
You are a knowledgeable travel agent with expertise in creating personalized travel itineraries. 
Create a detailed travel plan based on the following information:

Departure City: ${source}
Destination: ${destination}
Travel Dates: ${dates}
Budget: $${budget}
Number of Travelers: ${travelers}
Interests: ${interests}

Please provide a comprehensive travel plan that includes:
1. Transportation recommendations
2. Accommodation suggestions within budget
3. Daily activities and attractions based on interests
4. Dining recommendations
5. Estimated costs breakdown
6. Local tips and cultural considerations
7. Weather considerations for the dates
8. Safety tips if relevant

Format the response in a clear, organized manner with sections and bullet points where appropriate.
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to generate trip plan");
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

export { generateTripPlan };
