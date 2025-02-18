
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
  const flights = (data.flights || []).map((flight: any) => ({
    departure_airport: {
      name: flight.departure_airport?.name || flight.departure,
      code: flight.departure_airport?.code || source,
    },
    arrival_airport: {
      name: flight.arrival_airport?.name || flight.arrival,
      code: flight.arrival_airport?.code || destination,
    },
    departure: {
      time: flight.departure_time || "N/A",
      date: flight.departure_date || date,
    },
    arrival: {
      time: flight.arrival_time || "N/A",
      date: flight.arrival_date || date,
    },
    airline: {
      name: flight.airline || "Unknown Airline",
      logo: flight.airline_logo || "",
    },
    price: {
      amount: parseFloat(flight.price?.replace(/[^0-9.]/g, "") || "0"),
      currency: "USD",
    },
    duration: flight.duration || "N/A",
    stops: flight.stops || 0,
  }));

  return flights;
};
