
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
  // Convert airport codes to uppercase
  const sourceCode = source.toUpperCase();
  const destinationCode = destination.toUpperCase();

  // The date should already be in YYYY-MM-DD format from the form
  try {
    const targetUrl = `https://serpapi.com/search.json?engine=google_flights&departure_id=${sourceCode}&arrival_id=${destinationCode}&outbound_date=${date}&currency=USD&hl=en&type=2&api_key=${apiKey}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error("Failed to search flights");
    }

    const responseData = await response.json();
    // api.allorigins.win wraps the response in a 'contents' property
    const data = JSON.parse(responseData.contents);
    
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
  } catch (error) {
    console.error('Flight search error:', error);
    throw error;
  }
};
