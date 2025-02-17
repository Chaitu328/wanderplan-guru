
interface TripDetails {
  source: string;
  destination: string;
  dates: string;
  budget: string;
  travelers: string;
  interests: string;
}

export const generateTripPlan = async (formData: TripDetails, apiKey: string) => {
  const prompt = `
You are a knowledgeable travel agent with expertise in creating personalized travel itineraries. 
Create a detailed travel plan based on the following information:

Departure City: ${formData.source}
Destination: ${formData.destination}
Travel Dates: ${formData.dates}
Budget: $${formData.budget}
Number of Travelers: ${formData.travelers}
Interests: ${formData.interests}

Please provide a comprehensive travel plan that includes:

## Transportation
- Detailed transportation recommendations including flights, local transport options

## Accommodation
- Accommodation suggestions within the specified budget
- Recommended areas to stay

## Daily Activities
- Day-by-day breakdown of activities based on interests
- Must-visit attractions
- Hidden gems and local experiences

## Dining
- Restaurant recommendations for different budgets
- Local cuisine highlights
- Special dining experiences

## Budget Breakdown
- Estimated costs for:
  * Transportation
  * Accommodation
  * Activities
  * Food & Dining
  * Miscellaneous

## Local Tips
- Cultural considerations
- Local customs and etiquette
- Language tips if relevant

## Weather & Packing
- Weather forecast for the dates
- Packing recommendations

## Safety Tips
- Important safety information
- Emergency contacts
- Areas to avoid if any

Format the response using proper markdown with headers, bullet points, and clear sections.
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
