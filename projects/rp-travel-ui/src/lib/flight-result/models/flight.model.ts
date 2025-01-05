import { IFlightAirline } from "./flightAirline.model";
import { IFlightDTO } from "./flightDTO.model";

export interface IFlight {
  flightDTO: IFlightDTO[];
  flightAirline: IFlightAirline;
  elapsedTime: number;
  stopsNum: number;
}
