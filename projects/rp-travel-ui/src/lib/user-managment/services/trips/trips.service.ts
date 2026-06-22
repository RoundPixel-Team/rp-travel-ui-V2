import { inject, Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { TripsApiService } from './trips-api.service';
import { IFlightModel, ITrips, ICardModel } from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TripsService {
  allTrips: ITrips = {
    upcomingFlights: [],
    historyFlights: [],
  };

  /**
   * To notify when any change happens in the authentication process such as:
   * - Errors
   * - Successfully Register
   * - Successfully Loged In
   */

  notify: Subject<number> = new Subject();
  subscription = new Subscription();
  isLoading: boolean = false;

  tripApi = inject(TripsApiService);
  fb = inject(FormBuilder);

  /**
   * this function is responsible to make intgeration between front and backend request (USER REGISTER)
   */
  getAllUserTrips() {
    this.isLoading = true;
    let token = localStorage.getItem('token');

    if (!token) {
      this.isLoading = false;
    } else {
      token = JSON.parse(token);

      this.subscription.add(
        this.tripApi.getAllTripsApi(token!).subscribe({
          next: (res) => {
            this.allTrips = res;
            this.isLoading = false;
            this.notify.next(0);
          },
          error: (error: any) => {
            this.isLoading = false;
            this.notify.next(1);
          },
        }),
      );
    }
  }
  // Sample function to extract and format flight details
  getFlightDetails(flights: IFlightModel[]): ICardModel[] {
    return flights.map((flight) => {
      const itinerary = flight.airItineraries?.[0];
      const flightType = itinerary?.flightType.toLowerCase();
      const allFlights = itinerary?.allJourney?.flights || [];

      const startDate = new Date(
        allFlights[0]?.flightDTO?.[0]?.departureDate,
      ).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const endDate =
        flightType === 'return'
          ? new Date(
              allFlights[allFlights.length - 1]?.flightDTO?.[0]?.arrivalDate,
            ).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : null;

      // Determine the city image based on flight type
      const cityImage =
        flightType === 'return'
          ? allFlights[0]?.flightDTO?.[allFlights[0]?.flightDTO?.length - 1]
              ?.arrivalTerminalAirport?.cityImage || 'default-image-url'
          : allFlights[0]?.flightDTO?.[allFlights[0]?.flightDTO?.length - 1]
              ?.arrivalTerminalAirport?.cityImage || 'default-image-url';

      const ticketNumber = flights[0].passengersDetails.filter(
        (ticket) => ticket.ticketNumber,
      );
      return {
        route: `${allFlights[0]?.flightDTO?.[0]?.departureTerminalAirport?.cityName || 'Unknown'} to ${allFlights[0]?.flightDTO?.[allFlights[0]?.flightDTO?.length - 1]?.arrivalTerminalAirport?.cityName || 'Unknown'}`,
        dates: endDate ? `${startDate} to ${endDate}` : startDate,
        ticketNumber,
        itineraryNumber: flight.hgNumber || 'N/A',
        bookingRef: allFlights[0].flightDTO[0].supplierRefID,
        airline:
          allFlights[0]?.flightDTO?.[0]?.flightAirline?.airlineName ||
          'Unknown',
        flightType: flightType.toUpperCase(),
        cityImage: cityImage, // Adding the city image to the card model
      };
    });
  }

  destroyer() {
    this.subscription.unsubscribe();
  }
}
