
interface FlightSearchParams {
  source: string;
  destination: string;
  date: string;
  apiKey: string;
}

export const searchFlights = async ({
  source,
  destination,
  date,
  apiKey,
}: FlightSearchParams) => {
  const response = await fetch(
    `https://serpapi.com/search.json?engine=google_flights&departure_id=${source}&arrival_id=${destination}&outbound_date=${date}&api_key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error("Failed to search flights");
  }

  const data = await response.json();
  return data.flights || [];
};
