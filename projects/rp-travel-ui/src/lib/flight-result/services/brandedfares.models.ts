export interface FlightSearchResponse {
    status: string;
    errorMessage: string;
    brands: Brand[];
    flightType: string;
  }
  
  export interface Brand {
    brandName: string;
    brandId: string;
    sequenceNumber: number;
    cabinClasse: string;
    baggageAllowances: any; // Change type if structure is known
    brandedFaresDTOs: FareDetail[];
    AdminCharges: AdminCharge[];
    itinTotalFare: ItinTotalFare;
    passengerFareBreakDowns: PassengerFareBreakDown[];
    optionalServices: OptionalService[];
  }
  
  export interface FareDetail {
    fareAmount: number;
    fareType: string;
    currencyCode: string;
  }
  
  export interface AdminCharge {
    price: number;
    curency: string;
    Type: string;
    sector: string;
  }
  
  export interface ItinTotalFare {
    amount: number;
    fareAmount: number;
    promoCode: string | null;
    promoDiscount: number;
    currencyCode: string;
    totalTaxes: number;
    dName: string;
    mName: string | null;
  }
  
  export interface PassengerFareBreakDown {
    key: string;
    pricingMethod: string;
    cancelPenaltyDTOs: Penalty[];
    changePenaltyDTOs: Penalty[];
    passengerQuantity: number;
    passengerType: string;
    passengersRef: string | null;
    flightFaresDTOs: FareDetail[];
    taxes: any; // Define structure if needed
  }
  
  export interface Penalty {
    price: number;
    curency: string;
    percentage: number;
    percentageApplied: boolean;
    sector: string;
    time: string;
  }
  
  export interface OptionalService {
    chargeable: string;
    key: string;
    type: string;
    tag: string;
    serviceInfo: ServiceInfo;
  }
  
  export interface ServiceInfo {
    description: string[];
    dimension?: Dimension | null;
  }
  
  export interface Dimension {
    height: string;
    width: string;
  }