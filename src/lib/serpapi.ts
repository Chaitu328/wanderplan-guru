
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
  
  // Transform the API response to match our Flight interface
  const flights = (data.best_flights || []).map((bestFlight: any) => {
    const firstFlight = bestFlight.flights[0]; // Get the first flight segment
    return {
      departure_airport: {
        name: firstFlight.departure_airport.name,
        code: firstFlight.departure_airport.id,
      },
      arrival_airport: {
        name: firstFlight.arrival_airport.name,
        code: firstFlight.arrival_airport.id,
      },
      departure: {
        time: firstFlight.departure_airport.time,
        date: date,
      },
      arrival: {
        time: firstFlight.arrival_airport.time,
        date: date,
      },
      airline: {
        name: firstFlight.airline,
        logo: firstFlight.airline_logo,
      },
      price: {
        amount: bestFlight.price,
        currency: "USD",
      },
      duration: `${Math.floor(bestFlight.total_duration / 60)}h ${bestFlight.total_duration % 60}m`,
      stops: bestFlight.layovers ? bestFlight.layovers.length : 0,
    };
  });

  return flights;
};
