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
});
