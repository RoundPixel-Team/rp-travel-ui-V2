export interface hotelBookingModel{
    status:string,
    bookingNum: string,
    ProviderConfirmation:string,
    mail: string,
    pdf: any,
    hotel: {
        hotelCode: string,
        hotelName: string,
        hotelThumb: string,
        Location: string,
        hotelStars: number,
        TotalSellPrice: number,
        sellCurrency: string,
        City: string,
        Country: string,
        Paxes: number,
        Rooms: number,
        CheckIn:string,
        CheckOut: string
    },
    travellers:{
        Title: string,
        FirstName: string,
        LastName: string
    } [] ,
    rooms: {
        RoomCode: string,
        Paxs: number,
        Adult: number,
        Child: number,
        RoomType:string,
        RoomMeal:string,
        IsRefundable: boolean,
        Image: string
    }[]

}
export interface PaymentResultResponse {
  Status: 0 | 1;
  Message: string;
  PaymentFareDetails: {
    FareAmount: number;
    TaxAmount: number;
    TotalChargeAmount: number;
    CustomerPaymentCurrency: string;
    TotalAmount: number;
    PromoCodeValue: number;
    ExchangeRate: number;
  };
  HGToken: string;
  paymentResult: {
    HGNumber: string;
    HGToken: string;
    RedirectUrl: string | null;
    PaymentOutput: string;
    FraudOutput: string;
    UserCurrency: string | null;
    PaymentLocation: string | null;
    PostPayment: string;
  };
  ProductType: string | null;
}

export interface ConfirmHotelStatusResponse {
  Status: 0 | 1;
  Message: string | null;
  PaymentFareDetails: {
    FareAmount: number;
    TaxAmount: number;
    TotalChargeAmount: number;
    CustomerPaymentCurrency: string | null;
    TotalAmount: number;
    ExchangeRate: number;
    PromoCodeValue?: number;
  };
  HGToken: string | null;
  paymentResult: {
    HGNumber: string | null;
    HGToken: string | null;
    RedirectUrl: string | null;
    PaymentOutput: string | null;
    FraudOutput: string | null;
    PostPayment: string | null;
    UserCurrency?: string | null;
    PaymentLocation?: string | null;
  };
  ProviderConfirmation?: string | null;
  ProductType?: string | null;
}
