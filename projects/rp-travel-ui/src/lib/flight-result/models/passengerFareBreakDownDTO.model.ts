import { IFlightFareDTO } from "./flightFareDTO.model";
import { IPenaltyDTO } from "./penaltyDTO.model";
import { ITax } from "./tax.model";

export interface IPassengerFareBreakDownDTO {
  key: string;
  pricingMethod: string;
  cancelPenaltyDTOs: IPenaltyDTO[];
  changePenaltyDTOs: IPenaltyDTO[];
  passengerQuantity: number;
  passengerType: string;
  passengersRef: string[];
  flightFaresDTOs: IFlightFareDTO[];
  taxes: ITax[];
}
