import { IAllJourney } from "./allJourney.model";
import { IBaggageInformation } from "./baggageInformation.model";
import { IPassengerFareBreakDownDTO } from "./passengerFareBreakDownDTO.model";
import { ITotalFare } from "./totalFare.model";

export interface IItinerary {
  referralLink: string;
  sequenceNum: number;
  pKey: string;
  pcc: string;
  isRefundable: boolean;
  itinTotalFare: ITotalFare;
  totalDuration: number;
  deptDate: string;
  arrivalDate: string;
  cabinClass: string;
  flightType: string;
  allJourney: IAllJourney;
  baggageInformation: IBaggageInformation[];
  passengerFareBreakDownDTOs: IPassengerFareBreakDownDTO[];
}
