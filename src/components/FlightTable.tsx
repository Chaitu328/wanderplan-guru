
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Flight {
  departure_airport: {
    name: string;
    code: string;
  };
  arrival_airport: {
    name: string;
    code: string;
  };
  departure: {
    time: string;
    date: string;
  };
  arrival: {
    time: string;
    date: string;
  };
  airline: {
    name: string;
    logo: string;
  };
  price: {
    amount: number;
    currency: string;
  };
  duration: string;
  stops: number;
}

interface FlightTableProps {
  flights: Flight[];
}

export const FlightTable = ({ flights }: FlightTableProps) => {
  if (!flights || flights.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Airline</TableHead>
            <TableHead>Departure</TableHead>
            <TableHead>Arrival</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Stops</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flights.map((flight, index) => (
            <TableRow key={index}>
              <TableCell className="flex items-center gap-2">
                {flight.airline.logo && (
                  <img 
                    src={flight.airline.logo} 
                    alt={flight.airline.name}
                    className="w-6 h-6 object-contain"
                  />
                )}
                {flight.airline.name}
              </TableCell>
              <TableCell>
                <div className="font-medium">{flight.departure.time}</div>
                <div className="text-sm text-gray-500">
                  {flight.departure_airport.code}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{flight.arrival.time}</div>
                <div className="text-sm text-gray-500">
                  {flight.arrival_airport.code}
                </div>
              </TableCell>
              <TableCell>{flight.duration}</TableCell>
              <TableCell>{flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</TableCell>
              <TableCell className="text-right">
                {flight.price.currency} {flight.price.amount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
