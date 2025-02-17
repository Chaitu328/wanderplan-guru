
import { ChatGroq } from "@langchain/groq";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

const groq = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "mixtral-8x7b-32768",
});

const parser = new StringOutputParser();

const promptTemplate = PromptTemplate.fromTemplate(`
You are a knowledgeable travel agent with expertise in creating personalized travel itineraries. 
Create a detailed travel plan based on the following information:

Departure City: {source}
Destination: {destination}
Travel Dates: {dates}
Budget: \${budget}
Number of Travelers: {travelers}
Interests: {interests}

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
`);

export const generateTripPlan = async ({
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
  const chain = promptTemplate.pipe(groq).pipe(parser);

  const response = await chain.invoke({
    source,
    destination,
    dates,
    budget,
    travelers,
    interests,
  });

  return response;
};
