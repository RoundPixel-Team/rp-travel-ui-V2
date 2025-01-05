import { IException } from "./exception.model";
import { IItinerary } from "./itinerary.model";
import { ISearchCriteria } from "./searchCriteria.model";

export interface IResponseModel {
  status: string;
  airItineraries: IItinerary[];
  airlines: string[];
  cabinClasses: string[];
  searchCriteria: ISearchCriteria;
  searchResultException: IException;
}
