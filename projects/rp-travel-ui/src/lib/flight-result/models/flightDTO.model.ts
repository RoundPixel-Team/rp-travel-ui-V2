import { IAirport } from "./airport.model";
import { IFlightAirline } from "./flightAirline.model";
import { IFlightInfo } from "./flightInfo.model";
import { ISegmentDetails } from "./segmentDetails.model";

export interface IFlightDTO {
  departureOffset: number;
  arrivalOffset: number;
  isStopSegment: boolean;
  deptTime: string;
  landTime: string;
  departureDate: string;
  arrivalDate: string;
  flightAirline: IFlightAirline;
  operatedAirline: IFlightAirline;
  durationPerLeg: number;
  departureTerminalAirport: IAirport;
  arrivalTerminalAirport: IAirport;
  transitTime: string;
  flightInfo: IFlightInfo;
  segmentDetails: ISegmentDetails;
  supplierRefID: string | null;
}
