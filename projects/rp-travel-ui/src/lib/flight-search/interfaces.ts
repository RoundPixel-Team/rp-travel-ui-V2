/**
 * this interface is mapping to the model of retriving flight data from backend
 */
export interface searchFlightModel{
    lan:string,
    currency:string,
    pointOfReservation:string,
    flightType:string,
    flightsInfo:string,
    passengers:string,
    Cclass:string,
    serachId:any,
    showDirect :boolean,
    preferredAirLine :string,
}

/**
* this interface is mapping to the form group of the search box
*/
export interface searchBoxModel{
    flightType: string
    direct: boolean
    flights: searchBoxFlights[]
    passengers:searchBoxPassengers
    class:string
    returnDate:string
}

export interface searchBoxFlights{
    departing:string
    landing:string
    departingDate:string
}

export interface searchBoxPassengers{
    adult:number
    child:number
    infent:number
}