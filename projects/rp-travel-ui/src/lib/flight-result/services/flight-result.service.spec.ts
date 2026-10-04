import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FlightResultService } from './flight-result.service';
import { FlightResultApiService } from './flight-result-api.service';
import { FlightSearchService } from '../../flight-search/services/flight-search.service';
import { ISearchFlightAi } from '../interfaces';

describe('FlightResultService', () => {
  let service: FlightResultService;
  let apiMock: any;
  let flightSearchMock: any;

  beforeEach(() => {
    apiMock = {
      searchFlightAi: jasmine.createSpy('searchFlightAi').and.returnValue(of({}))
    };
    
    flightSearchMock = {
      searchFlight: {
        get: jasmine.createSpy('get').and.returnValue({ value: 'RoundTrip' })
      }
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        FlightResultService,
        { provide: FlightResultApiService, useValue: apiMock },
        { provide: FlightSearchService, useValue: flightSearchMock },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({})
          }
        }
      ]
    });
    service = TestBed.inject(FlightResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle AI search welcome/chat response containing output property', () => {
    const welcomeResponse = {
      output: "Hello! I'm here to assist you with flight bookings..."
    };
    apiMock.searchFlightAi.and.returnValue(of(welcomeResponse));

    const searchData: ISearchFlightAi = {
      chat: 'hello',
      chatID: '123'
    };

    service.getDataFromAiUrl(searchData);

    expect(service.loading).toBeFalse();
    expect(service.ResultFound).toBeTrue();
    expect(service.responseAi).toEqual(welcomeResponse as any);
    expect(service.normalError).toBe('');
    expect(service.normalErrorStatus).toBeFalse();
  });

  it('should handle empty object response from searchFlightAi by hiding loader and setting normalErrorStatus to true', () => {
    apiMock.searchFlightAi.and.returnValue(of({}));

    const searchData: ISearchFlightAi = {
      chat: 'test',
      chatID: '123'
    };

    service.getDataFromAiUrl(searchData);

    expect(service.loading).toBeFalse();
    expect(service.ResultFound).toBeFalse();
    expect(service.normalErrorStatus).toBeTrue();
    expect(service.normalError).toBe('Something went wrong. Please try again later.');
  });

  it('should handle null response from searchFlightAi by hiding loader and setting normalErrorStatus to true', () => {
    apiMock.searchFlightAi.and.returnValue(of(null));

    const searchData: ISearchFlightAi = {
      chat: 'test',
      chatID: '123'
    };

    service.getDataFromAiUrl(searchData);

    expect(service.loading).toBeFalse();
    expect(service.ResultFound).toBeFalse();
    expect(service.normalErrorStatus).toBeTrue();
    expect(service.normalError).toBe('Something went wrong. Please try again later.');
  });

  it('should send a follow-up search when searchMessage has a value and there are no itineraries', () => {
    const firstResponse = {
      output: 'I recommend searching for beach destinations to find the best options. Would you like me to search for flights to top beach destinations?',
      searchMessage: 'beach destination'
    };
    const secondResponse = {
      output: 'Here are beach destination flights.'
    };
    apiMock.searchFlightAi.and.returnValues(of(firstResponse), of(secondResponse));

    service.getDataFromAiUrl({
      chat: 'something new',
      chatID: '123'
    });

    expect(apiMock.searchFlightAi).toHaveBeenCalledTimes(2);
    expect(apiMock.searchFlightAi.calls.argsFor(1)[0]).toEqual({
      chat: 'beach destination',
      chatID: '123'
    });
    expect(service.aiFollowUpOutput).toBe(firstResponse.output);
    expect(service.aiFollowUpSearch).toBe('beach destination');
    expect(service.loading).toBeFalse();
    expect(service.ResultFound).toBeTrue();
    expect(service.responseAi).toEqual(secondResponse as any);
  });

  it('should ignore empty or null searchMessage and keep the original chat response', () => {
    const chatResponse = {
      output: 'Hello! How can I help you?',
      searchMessage: null
    };
    apiMock.searchFlightAi.and.returnValue(of(chatResponse));

    service.getDataFromAiUrl({
      chat: 'hello',
      chatID: '123'
    });

    expect(apiMock.searchFlightAi).toHaveBeenCalledTimes(1);
    expect(service.responseAi).toEqual(chatResponse as any);
    expect(service.aiFollowUpOutput).toBeUndefined();
  });

  it('should ignore empty searchMessage and keep the original chat response', () => {
    const chatResponse = {
      output: 'Hello! How can I help you?',
      searchMessage: '   '
    };
    apiMock.searchFlightAi.and.returnValue(of(chatResponse));

    service.getDataFromAiUrl({
      chat: 'hello',
      chatID: '123'
    });

    expect(apiMock.searchFlightAi).toHaveBeenCalledTimes(1);
    expect(service.responseAi).toEqual(chatResponse as any);
  });

  it('should not follow up searchMessage when airItineraries already exist', () => {
    const flightResponse = {
      status: 'Valid',
      searchMessage: 'beach destination',
      airItineraries: [{ sequenceNum: 1, itinTotalFare: { amount: 100 }, allJourney: { flights: [{ flightDTO: [{ flightAirline: { airlineCode: 'MS', airlineName: 'EgyptAir' }, departureDate: '2026-10-10T08:00:00', transitTime: '00:00:00' }] }] } }]
    };
    apiMock.searchFlightAi.and.returnValue(of(flightResponse));

    service.getDataFromAiUrl({
      chat: 'cairo to dubai',
      chatID: '123'
    });

    expect(apiMock.searchFlightAi).toHaveBeenCalledTimes(1);
  });

  it('should use airItineraries when itineraries is an empty array', () => {
    const flightResponse = {
      status: 'Valid',
      itineraries: [],
      airItineraries: [{ sequenceNum: 1, itinTotalFare: { amount: 100 }, allJourney: { flights: [{ flightDTO: [{ flightAirline: { airlineCode: 'MS', airlineName: 'EgyptAir' }, departureDate: '2026-10-10T08:00:00', transitTime: '00:00:00' }] }] } }]
    };
    apiMock.searchFlightAi.and.returnValue(of(flightResponse));

    service.getDataFromAiUrl({
      chat: 'cairo to dubai',
      chatID: '123'
    });

    expect(apiMock.searchFlightAi).toHaveBeenCalledTimes(1);
    expect(service.ResultFound).toBeTrue();
    expect(service.loading).toBeFalse();
    expect(service.response?.airItineraries?.length).toBe(1);
  });
});
