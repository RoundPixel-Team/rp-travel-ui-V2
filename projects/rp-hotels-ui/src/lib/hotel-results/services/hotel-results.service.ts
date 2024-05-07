import { Injectable, inject } from '@angular/core';
import { Subscription, catchError } from 'rxjs';
import { HotelResultsApiService } from './hotel-results-api.service';
import { GetHotelModule, hotel, hotelResults } from '../interfaces';
import { guests } from '../../hotel-search/interfaces';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class HotelResultsService {

  api = inject(HotelResultsApiService)

  hotelDataResponse?:hotelResults;
  hotelLocationsArr:Array<string>=[];
  filteredHotels: hotel[] = [];
  splicedFiltiredHotels:hotel[] = []
  locationsArrSelected: Array<string> = [];
  ratesArrSelected: Array<number> = [];
  hotelResultsLoader:boolean=false;
  searchID:string='';
  maxPrice:number=100;
  minPrice:number=0;
  minPriceValueForSlider:number = 0
  maxPriceValueForSlider:number = 100
  nightsNumber:any=0;
  subscription : Subscription = new Subscription()
  filterForm : FormGroup= new FormGroup({
    hotelName: new FormControl(''),
    hotelRates: new FormArray([]),
    hotelPriceMax: new FormControl(),
    hotelPriceMin: new FormControl(),
    hotelLocations: new FormArray([])
  });

  constructor() { 

  }

  ngOnInit(){}

 resetHotelForm(){
  this.filterForm = new FormGroup({
    hotelName: new FormControl(''),
    hotelRates: new FormArray([]),
    hotelPriceMax: new FormControl(),
    hotelPriceMin: new FormControl(),
    hotelLocations: new FormArray([])
  });
 }

 detectDataChanging(){
  this.filteredHotels = [...this.filteredHotels];
 }
  /**
   * this function is responsible to call API to get the Hotel Data
   * you should call it first in the search Results componet
   */
  getHotelDataFromUrl(hotelSearchObj: GetHotelModule, dateFrom:string, dateTo:string){
    this.hotelResultsLoader = true;
    //call het hotel data API
    this.subscription.add(
      this.api.getHotelsRes(hotelSearchObj).subscribe((res:hotelResults)=>{
        if(res && res.HotelResult.length > 0){
          this.hotelLocationsArr = []
          this.locationsArrSelected = []
          this.resetHotelForm();

          this.hotelDataResponse = res;
          this.filteredHotels = [
    {
        "hotelCode": "432",
        "hotelName": "PYRAMIDS PARK RESORT CAIRO",
        "hotelRate": 86.0216,
        "providerID": "7",
        "providerHotelCode": "5584",
        "providerHotelID": "5584",
        "hotelThumb": "https://us.dotwconnect.com/poze_hotel/55/5584/HEVmo8xU_76a3aada5037c470b8386f08329e8e4a.jpg",
        "hotelDescription": "476 rooms and suites is considered a heaven in a unique landscape of greenery, offering leisure and business travelers a memorable experience amidst a comfortable and relaxing 25 acres of lush gardens and exotic rare plants. location ,walking distance form the Great Egyptian museum (opening 2018) .  5 min away from the  Great Pyramids of Giza and the Sphinx ,a walking distance from the new grand museum ( under construction ) and only 30 min away from  the Egyptian Museum, the Citadel. A little farther but also worthwhile are Khan el-Khalili, Egypt s oldest market, the Museum of modern Egyptian art. The smart village  and Dandy mall are only 16 Km  20 minutes driving , ,23 Km from Mall of Arabia 30 min driving , Mall of Egypt ( under construction ) is only 17 Km , 20 min driving  and 4 KM from Pyramids road.<br />\nWe would like to announce that hotel will start to proceed  yearly Swimming Pool maintenance&amp;amp; repair, Therefore, please be informed that we will be closing the swimming pool area starting from 15th February till 31st of March, 2022. <br />\nNOTICE:<br />\nSwimming pool area closed from 06th April  till 28th April , 2022, &amp;amp; return operating on 29th April 2022.",
        "shortcutHotelDescription": "The PYRAMIDS PARK RESORT CAIRO is a Tourist hotel. Located in Giza area. The nightlife/restaurants are easily accessible by taxi or bus from the hotel.",
        "hotelImages": [
            "https://us.dotwconnect.com/poze_hotel/55/5584/HEVmo8xU_76a3aada5037c470b8386f08329e8e4a.jpg",
            "https://us.dotwconnect.com/poze_hotel/55/5584/LWMqCo9G_157d33ea6fccd25f1bfef4cd25b84f01.jpg",
            "https://us.dotwconnect.com/poze_hotel/55/5584/2kJY5lL1_b1eba442554c2b2a2ccf9c2cd23bfe5b.jpg",
            "https://us.dotwconnect.com/poze_hotel/55/5584/O6N4OARh_2e7e2819542561b0aa814dbec048a4b2.jpg",
            "https://us.dotwconnect.com/poze_hotel/55/5584/54oMMzdr_fc1ef6a41114474cae7aacf70ec2c56a.jpg",
            "https://us.dotwconnect.com/poze_hotel/55/5584/dYhOc5QM_78a42b81526e51f96ec00591b2eda7b3.jpg",
            "https://us.dotwconnect.com/poze_hotel/55/5584/gTKCtOd5_f27d2859870113e1783422cae625a42d.jpg",
            "https://us.dotwconnect.com/poze_hotel/55/5584/P2bPoQ6R_d606897c90a18f82e0418b31304852a5.jpg",
            "https://us.dotwconnect.com/poze_hotel/55/5584/Whlrj70D_6803a549f14665b0bb0ad082a754c79d.jpg",
            "https://us.dotwconnect.com/poze_hotel/55/5584/xyO8KURT_6cdc7466ac916dade049757fe7afd720.jpg",
            "https://us.dotwconnect.com/poze_hotel/55/5584/xYNWkflQ_5497b48cd16a86abcb4887c7354ae234.jpg"
        ],
        "LatLong": "",
        "Location": "Giza",
        "hotelStars": 4,
        "costCurrency": "USD",
        "costPrice": 430.1075,
        "TotalSellPrice": 430.108,
        "sellCurrency": "KWD",
        "Lat": "",
        "Lng": "",
        "City": "CAIRO",
        "Country": "EGYPT",
        "ZipCode": "70",
        "Address": "Cairo-Alexandria Desert Road KM 2.5, Pyramids, Giza",
        "CityTaxValue": 0,
        "CityTaxCurrency": "",
        "Amenities": [],
        "MarkupId":2,
        "MarkupValue":1,
        "DiscountId":2,
        "DiscountValue":1,
    },
    {
        "hotelCode": "467",
        "hotelName": "Concorde El Salam Hotel",
        "hotelRate": 129.0408,
        "providerID": "7",
        "providerHotelCode": "5304",
        "providerHotelID": "5304",
        "hotelThumb": "https://us.dotwconnect.com/poze_hotel/53/5304/hexu4zoi_71978f270694c14541f78503ede68acb.jpg",
        "hotelDescription": "The hotel is located in the Heliopolis area, just a 7 km drive from Cairo International Airport and 20 km from the city centre.<br />\nFacilities<br />\nThe establishment comprises a total of 334 accommodation units. Guests of the establishment are welcomed in the lobby, which has a 24-hour reception and a 24-hour check-out service. Services such as a safe and currency exchange facilities make for a comfortable stay. Internet access is available in public areas. A balcony is also among the features. Gastronomic options include a restaurant, a café and a bar. Guests can buy holiday mementos from the souvenir shop. Shopping facilities are available. A garden is among the features contributing to a pleasant stay. Guests travelling in their own vehicles can make use of the available parking spaces (for a fee). Additional services include room service, a laundry and a hairdressing salon.<br />\nRooms<br />\nAll accommodation units feature air conditioning and a bathroom. A balcony or terrace can be found in most accommodation units, offering additional comfort. Each accommodation unit features a double bed or a king-size bed. A safe and a minibar also feature. Tea and coffee making equipment is included as standard. Most rooms are equipped with internet access, a telephone and a TV. In the bathrooms, guests will find a shower and a hairdryer.<br />\nSports/Entertainment<br />\nThe establishment offers an outdoor pool and a children&#039;s pool. Sun loungers and parasols offer the ideal way to unwind. A hot tub provides an opportunity for relaxation. Various refreshing drinks are available from the poolside bar. Those wishing to enjoy sports whilst on holiday can have fun on-site with tennis. A gym and squash are some of the sports and leisure options available at the establishment. Various wellness options are offered, including a spa, a sauna, a steam bath, a beauty salon, massage treatments and a solarium. A kids&#039; club and a casino are among the available leisure options. <br />\nMeals<br />\nVarious meals and board options are bookable. Guests can choose from breakfast, lunch, dinner, B &amp;amp; B and half board. Staff are also happy to prepare vegetarian dishes.<br />\nPayment<br />\nThe following credit cards are accepted at the establishment: VISA and MasterCard.",
        "shortcutHotelDescription": "The Concorde El Salam Hotel is a Tourist hotel. The nightlife/restaurants are located in the hotel.",
        "hotelImages": [
            "https://us.dotwconnect.com/poze_hotel/53/5304/hexu4zoi_71978f270694c14541f78503ede68acb.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/vHjK8ECO_f416c025f8b25d86840687aef044b62b.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/LF57eEC2_dd6c5bd00acbf9e79b7001c78af62eec.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/xrv1VvAZ_80fd843efad05e5bde180c004c0a9f5b.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/A9lB1G23_b6d8343261e212cabba92112d2ab9a71.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/ezOsVQSj_f1df41ee309a505e76fa68ff310fd65b.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/Gl2dKFgg_d93a1c792b42f01ef47b1e419b58c9e4.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/pVQvjqzu_a69c8a789c6b44065d03e60a1e1cc03a.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/Llhj5jQD_5da1da4391c820c3a8d173346beedad9.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/geGqBwPT_0ea7c93789eda2d6234c21b479636c30.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/Hj2IHEQ3_c18a1b113c0f35eaf41e1a418df2e6ba.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/STw8IcZx_70095f9b2f65b0cb412682f61929d157.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/wzeYk0Ze_bf921c9b75e55ed7d1b9d91c05575daa.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/Cg0BVOot_ef962e21625a4b5cff38c86df100d032.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/SzNwUeIn_ef962e21625a4b5cff38c86df100d032.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/8P4WcJ4O_4f9b130c2b2915d7813f91e688335871.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/cBnIXzLE_38a85ce7c9e33f833d76f1170f39c1da.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/ceh7bJhu_2e9e2f8b74fb5847ef125dd9145bae43.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/GOt4sIbs_4c54406f521ccadd5986882a0fa3c6ea.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/mGHJvU2q_188f1ac781ce5bff3501218687c91cd2.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/X69PiBsw_d027d42d2ca58074b54260ee0f6a38ff.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/X4CJWkPv_326454c534dd757c2c728f274f9f26b0.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/8AtxJ7gS_7f9e147bf8676a979543fbe007c5c676.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/vUKibMLz_ee2396d90c1f3d8febb4d3848672c3d0.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/rd52Z5yw_95bf1563447896c426d8c45eb38514ea.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/iCzVdgXc_8e2ba803e67880a7bb7a178a4b636338.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/uFCvgqqh_4eeb9eb58668966456b7b88fcf41e51c.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/01A3Ij25_4ca8a3820e6c714c114dcbfc81e19a6f.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/3Pd7kWcs_82960dc9e5c38acf5aa33051b97e5022.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/vv8P3yIs_fa26bcd34c011df30bf7e7f0b9af7212.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/P97tXzKH_26eb3bf481d2b1cb11a0b67e06c940f5.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/ovuzxfEM_b5c168b79285be3fbbcbf069629ca498.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/o8iteCH8_8e46306672ffe888d8c14e03148dc9a3.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/Nj7IMpnE_d1bd533e3329b99c1f6beb465b20b86b.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/5UjYzztk_ad3492b8730290b98cb50c96e05cf4b3.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/zUNQXHQe_555aad53a43bc9db0b2845e5a0d598d0.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/rfCQE2eE_dd776a73cdc789252ec8eb1833e9b90b.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/YljJ8N9V_f84dde926c37036a08af31573082e260.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5304/FslaTWST_8e46306672ffe888d8c14e03148dc9a3.jpg"
        ],
        "LatLong": "",
        "Location": "",
        "hotelStars": 5,
        "costCurrency": "USD",
        "costPrice": 645.2043,
        "TotalSellPrice": 645.204,
        "sellCurrency": "KWD",
        "Lat": "",
        "Lng": "",
        "City": "CAIRO",
        "Country": "EGYPT",
        "ZipCode": "05614",
        "Address": "65 Abdel Hamid Badawi Street",
        "CityTaxValue": 0,
        "CityTaxCurrency": "",
        "Amenities": [],
        "MarkupId":2,
        "MarkupValue":1,
        "DiscountId":2,
        "DiscountValue":1,
    },
    {
        "hotelCode": "475",
        "hotelName": "Azal Pyramids Hotel",
        "hotelRate": 50.049,
        "providerID": "7",
        "providerHotelCode": "5352335",
        "providerHotelID": "5352335",
        "hotelThumb": "https://us.dotwconnect.com/poze_hotel/53/5352335/i7wrX7Yj_bb531ddad36597dec45c1b20c4399327.jpg",
        "hotelDescription": "The property is 5 km away from Giza Pyramids, 5 km from Pharaonic Village, 6 km from Orman Botanical garden, 8 km from Museum of Egyptian Modern Arts, and 10 km from The National Museum of Egyptian Civilization. The hotel is 4 km away from Giza Suburbs, 4 km from Omm al Misryeen, 4 km from El Giza Train Station, 4 km from Sakiat Mekki, and 28 km from Cairo International Airport and 55 km from Sphinx International Airport.<br />\nFacilities and services include car rental, concierge, swimming pools, free wi-fi, restaurant, room service, laundry facilities, and parking.<br />\nRooms feature air conditioning, TV, and bathroom.",
        "shortcutHotelDescription": "The Azal Pyramids Hotel is a  hotel.",
        "hotelImages": [
            "https://us.dotwconnect.com/poze_hotel/53/5352335/i7wrX7Yj_bb531ddad36597dec45c1b20c4399327.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/GshgiSlq_2f29ff8acdd2285b2410b7af78e94a92.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/SBYqc0rd_46901e304c449ae6d50ada64a77bf867.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/Gl3Azf0m_70881abd4f310b544d5f2a1f461f0a59.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/geCvme1h_a0c5b40a7e3bed40fed1114851880ffa.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/zv5z3W08_bf92a45cac6b268f3094f798bc108c00.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/y3bcHqsN_b220ad98f65c5a52a9e3672397fef9f2.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/oCWJ1M3Z_19f6cf8174002178c876cdfa21d45ba4.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/djHE6xIJ_cb4c1af7b30d237656e8945f2214a5b0.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/asHDbhPc_74f93d350d3af08724ef635e8067ea70.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/sFLgTeMT_cd8decbcb90b0fa6d599208ae453f5b2.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/RCXhI6hV_dfe1c00838648237741380ff19fea34c.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/KC0qfJja_6c8dff396dc19e2aab1806f810ac9c56.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/2O8MSnF8_a020a20f77e59e35d1bf0605c98ab986.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/x4w2TyyY_1aef0676d94a3e157ae43a9772b3d15e.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/HONTL9ZU_34459eea43293125a2abc52236aec857.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/iMuEvJ28_97c86226eb88419214c1e20375f3934e.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/PpimFXi4_7f6b75d547f89e025750141327a78668.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/loAVOUSb_60ce0c764ca68a1dc2765baa3f3bb349.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/DG6V7xHe_169d4d29913a8ea15adbad69ed05b60a.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/CxV80FOe_30b36f38b582d7593f5daa478a893b37.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/LPzorhDA_b38193c88de9390819c8a2c9360b8e37.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/vjok8GWj_7f510a5d90949182ca6b771f8e64ecdb.jpg",
            "https://us.dotwconnect.com/poze_hotel/53/5352335/Ou308Hqy_792118455d45a76e6a4344149bc616fa.jpg"
        ],
        "LatLong": "",
        "Location": "",
        "hotelStars": 2,
        "costCurrency": "USD",
        "costPrice": 250.2449,
        "TotalSellPrice": 250.245,
        "sellCurrency": "KWD",
        "Lat": "",
        "Lng": "",
        "City": "CAIRO",
        "Country": "EGYPT",
        "ZipCode": 'null',
        "Address": "252 Al Haram Street",
        "CityTaxValue": 0,
        "CityTaxCurrency": "",
        "Amenities": [],
        "MarkupId":2,
        "MarkupValue":1,
        "DiscountId":2,
        "DiscountValue":1,
        
    },
    {
      "hotelCode": "432",
      "hotelName": "PYRAMIDS PARK RESORT CAIRO",
      "hotelRate": 86.0216,
      "providerID": "7",
      "providerHotelCode": "5584",
      "providerHotelID": "5584",
      "hotelThumb": "https://us.dotwconnect.com/poze_hotel/55/5584/HEVmo8xU_76a3aada5037c470b8386f08329e8e4a.jpg",
      "hotelDescription": "476 rooms and suites is considered a heaven in a unique landscape of greenery, offering leisure and business travelers a memorable experience amidst a comfortable and relaxing 25 acres of lush gardens and exotic rare plants. location ,walking distance form the Great Egyptian museum (opening 2018) .  5 min away from the  Great Pyramids of Giza and the Sphinx ,a walking distance from the new grand museum ( under construction ) and only 30 min away from  the Egyptian Museum, the Citadel. A little farther but also worthwhile are Khan el-Khalili, Egypt s oldest market, the Museum of modern Egyptian art. The smart village  and Dandy mall are only 16 Km  20 minutes driving , ,23 Km from Mall of Arabia 30 min driving , Mall of Egypt ( under construction ) is only 17 Km , 20 min driving  and 4 KM from Pyramids road.<br />\nWe would like to announce that hotel will start to proceed  yearly Swimming Pool maintenance&amp;amp; repair, Therefore, please be informed that we will be closing the swimming pool area starting from 15th February till 31st of March, 2022. <br />\nNOTICE:<br />\nSwimming pool area closed from 06th April  till 28th April , 2022, &amp;amp; return operating on 29th April 2022.",
      "shortcutHotelDescription": "The PYRAMIDS PARK RESORT CAIRO is a Tourist hotel. Located in Giza area. The nightlife/restaurants are easily accessible by taxi or bus from the hotel.",
      "hotelImages": [
          "https://us.dotwconnect.com/poze_hotel/55/5584/HEVmo8xU_76a3aada5037c470b8386f08329e8e4a.jpg",
          "https://us.dotwconnect.com/poze_hotel/55/5584/LWMqCo9G_157d33ea6fccd25f1bfef4cd25b84f01.jpg",
          "https://us.dotwconnect.com/poze_hotel/55/5584/2kJY5lL1_b1eba442554c2b2a2ccf9c2cd23bfe5b.jpg",
          "https://us.dotwconnect.com/poze_hotel/55/5584/O6N4OARh_2e7e2819542561b0aa814dbec048a4b2.jpg",
          "https://us.dotwconnect.com/poze_hotel/55/5584/54oMMzdr_fc1ef6a41114474cae7aacf70ec2c56a.jpg",
          "https://us.dotwconnect.com/poze_hotel/55/5584/dYhOc5QM_78a42b81526e51f96ec00591b2eda7b3.jpg",
          "https://us.dotwconnect.com/poze_hotel/55/5584/gTKCtOd5_f27d2859870113e1783422cae625a42d.jpg",
          "https://us.dotwconnect.com/poze_hotel/55/5584/P2bPoQ6R_d606897c90a18f82e0418b31304852a5.jpg",
          "https://us.dotwconnect.com/poze_hotel/55/5584/Whlrj70D_6803a549f14665b0bb0ad082a754c79d.jpg",
          "https://us.dotwconnect.com/poze_hotel/55/5584/xyO8KURT_6cdc7466ac916dade049757fe7afd720.jpg",
          "https://us.dotwconnect.com/poze_hotel/55/5584/xYNWkflQ_5497b48cd16a86abcb4887c7354ae234.jpg"
      ],
      "LatLong": "",
      "Location": "Giza",
      "hotelStars": 4,
      "costCurrency": "USD",
      "costPrice": 430.1075,
      "TotalSellPrice": 430.108,
      "sellCurrency": "KWD",
      "Lat": "",
      "Lng": "",
      "City": "CAIRO",
      "Country": "EGYPT",
      "ZipCode": "70",
      "Address": "Cairo-Alexandria Desert Road KM 2.5, Pyramids, Giza",
      "CityTaxValue": 0,
      "CityTaxCurrency": "",
      "Amenities": [],
      "MarkupId":2,
      "MarkupValue":1,
      "DiscountId":2,
      "DiscountValue":1,
  },
  {
      "hotelCode": "467",
      "hotelName": "Concorde El Salam Hotel",
      "hotelRate": 129.0408,
      "providerID": "7",
      "providerHotelCode": "5304",
      "providerHotelID": "5304",
      "hotelThumb": "https://us.dotwconnect.com/poze_hotel/53/5304/hexu4zoi_71978f270694c14541f78503ede68acb.jpg",
      "hotelDescription": "The hotel is located in the Heliopolis area, just a 7 km drive from Cairo International Airport and 20 km from the city centre.<br />\nFacilities<br />\nThe establishment comprises a total of 334 accommodation units. Guests of the establishment are welcomed in the lobby, which has a 24-hour reception and a 24-hour check-out service. Services such as a safe and currency exchange facilities make for a comfortable stay. Internet access is available in public areas. A balcony is also among the features. Gastronomic options include a restaurant, a café and a bar. Guests can buy holiday mementos from the souvenir shop. Shopping facilities are available. A garden is among the features contributing to a pleasant stay. Guests travelling in their own vehicles can make use of the available parking spaces (for a fee). Additional services include room service, a laundry and a hairdressing salon.<br />\nRooms<br />\nAll accommodation units feature air conditioning and a bathroom. A balcony or terrace can be found in most accommodation units, offering additional comfort. Each accommodation unit features a double bed or a king-size bed. A safe and a minibar also feature. Tea and coffee making equipment is included as standard. Most rooms are equipped with internet access, a telephone and a TV. In the bathrooms, guests will find a shower and a hairdryer.<br />\nSports/Entertainment<br />\nThe establishment offers an outdoor pool and a children&#039;s pool. Sun loungers and parasols offer the ideal way to unwind. A hot tub provides an opportunity for relaxation. Various refreshing drinks are available from the poolside bar. Those wishing to enjoy sports whilst on holiday can have fun on-site with tennis. A gym and squash are some of the sports and leisure options available at the establishment. Various wellness options are offered, including a spa, a sauna, a steam bath, a beauty salon, massage treatments and a solarium. A kids&#039; club and a casino are among the available leisure options. <br />\nMeals<br />\nVarious meals and board options are bookable. Guests can choose from breakfast, lunch, dinner, B &amp;amp; B and half board. Staff are also happy to prepare vegetarian dishes.<br />\nPayment<br />\nThe following credit cards are accepted at the establishment: VISA and MasterCard.",
      "shortcutHotelDescription": "The Concorde El Salam Hotel is a Tourist hotel. The nightlife/restaurants are located in the hotel.",
      "hotelImages": [
          "https://us.dotwconnect.com/poze_hotel/53/5304/hexu4zoi_71978f270694c14541f78503ede68acb.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/vHjK8ECO_f416c025f8b25d86840687aef044b62b.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/LF57eEC2_dd6c5bd00acbf9e79b7001c78af62eec.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/xrv1VvAZ_80fd843efad05e5bde180c004c0a9f5b.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/A9lB1G23_b6d8343261e212cabba92112d2ab9a71.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/ezOsVQSj_f1df41ee309a505e76fa68ff310fd65b.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/Gl2dKFgg_d93a1c792b42f01ef47b1e419b58c9e4.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/pVQvjqzu_a69c8a789c6b44065d03e60a1e1cc03a.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/Llhj5jQD_5da1da4391c820c3a8d173346beedad9.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/geGqBwPT_0ea7c93789eda2d6234c21b479636c30.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/Hj2IHEQ3_c18a1b113c0f35eaf41e1a418df2e6ba.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/STw8IcZx_70095f9b2f65b0cb412682f61929d157.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/wzeYk0Ze_bf921c9b75e55ed7d1b9d91c05575daa.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/Cg0BVOot_ef962e21625a4b5cff38c86df100d032.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/SzNwUeIn_ef962e21625a4b5cff38c86df100d032.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/8P4WcJ4O_4f9b130c2b2915d7813f91e688335871.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/cBnIXzLE_38a85ce7c9e33f833d76f1170f39c1da.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/ceh7bJhu_2e9e2f8b74fb5847ef125dd9145bae43.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/GOt4sIbs_4c54406f521ccadd5986882a0fa3c6ea.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/mGHJvU2q_188f1ac781ce5bff3501218687c91cd2.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/X69PiBsw_d027d42d2ca58074b54260ee0f6a38ff.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/X4CJWkPv_326454c534dd757c2c728f274f9f26b0.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/8AtxJ7gS_7f9e147bf8676a979543fbe007c5c676.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/vUKibMLz_ee2396d90c1f3d8febb4d3848672c3d0.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/rd52Z5yw_95bf1563447896c426d8c45eb38514ea.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/iCzVdgXc_8e2ba803e67880a7bb7a178a4b636338.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/uFCvgqqh_4eeb9eb58668966456b7b88fcf41e51c.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/01A3Ij25_4ca8a3820e6c714c114dcbfc81e19a6f.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/3Pd7kWcs_82960dc9e5c38acf5aa33051b97e5022.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/vv8P3yIs_fa26bcd34c011df30bf7e7f0b9af7212.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/P97tXzKH_26eb3bf481d2b1cb11a0b67e06c940f5.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/ovuzxfEM_b5c168b79285be3fbbcbf069629ca498.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/o8iteCH8_8e46306672ffe888d8c14e03148dc9a3.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/Nj7IMpnE_d1bd533e3329b99c1f6beb465b20b86b.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/5UjYzztk_ad3492b8730290b98cb50c96e05cf4b3.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/zUNQXHQe_555aad53a43bc9db0b2845e5a0d598d0.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/rfCQE2eE_dd776a73cdc789252ec8eb1833e9b90b.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/YljJ8N9V_f84dde926c37036a08af31573082e260.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5304/FslaTWST_8e46306672ffe888d8c14e03148dc9a3.jpg"
      ],
      "LatLong": "",
      "Location": "",
      "hotelStars": 5,
      "costCurrency": "USD",
      "costPrice": 645.2043,
      "TotalSellPrice": 645.204,
      "sellCurrency": "KWD",
      "Lat": "",
      "Lng": "",
      "City": "CAIRO",
      "Country": "EGYPT",
      "ZipCode": "05614",
      "Address": "65 Abdel Hamid Badawi Street",
      "CityTaxValue": 0,
      "CityTaxCurrency": "",
      "Amenities": [],
      "MarkupId":2,
      "MarkupValue":1,
      "DiscountId":2,
      "DiscountValue":1,
  },
  {
      "hotelCode": "475",
      "hotelName": "Azal Pyramids Hotel",
      "hotelRate": 50.049,
      "providerID": "7",
      "providerHotelCode": "5352335",
      "providerHotelID": "5352335",
      "hotelThumb": "https://us.dotwconnect.com/poze_hotel/53/5352335/i7wrX7Yj_bb531ddad36597dec45c1b20c4399327.jpg",
      "hotelDescription": "The property is 5 km away from Giza Pyramids, 5 km from Pharaonic Village, 6 km from Orman Botanical garden, 8 km from Museum of Egyptian Modern Arts, and 10 km from The National Museum of Egyptian Civilization. The hotel is 4 km away from Giza Suburbs, 4 km from Omm al Misryeen, 4 km from El Giza Train Station, 4 km from Sakiat Mekki, and 28 km from Cairo International Airport and 55 km from Sphinx International Airport.<br />\nFacilities and services include car rental, concierge, swimming pools, free wi-fi, restaurant, room service, laundry facilities, and parking.<br />\nRooms feature air conditioning, TV, and bathroom.",
      "shortcutHotelDescription": "The Azal Pyramids Hotel is a  hotel.",
      "hotelImages": [
          "https://us.dotwconnect.com/poze_hotel/53/5352335/i7wrX7Yj_bb531ddad36597dec45c1b20c4399327.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/GshgiSlq_2f29ff8acdd2285b2410b7af78e94a92.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/SBYqc0rd_46901e304c449ae6d50ada64a77bf867.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/Gl3Azf0m_70881abd4f310b544d5f2a1f461f0a59.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/geCvme1h_a0c5b40a7e3bed40fed1114851880ffa.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/zv5z3W08_bf92a45cac6b268f3094f798bc108c00.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/y3bcHqsN_b220ad98f65c5a52a9e3672397fef9f2.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/oCWJ1M3Z_19f6cf8174002178c876cdfa21d45ba4.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/djHE6xIJ_cb4c1af7b30d237656e8945f2214a5b0.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/asHDbhPc_74f93d350d3af08724ef635e8067ea70.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/sFLgTeMT_cd8decbcb90b0fa6d599208ae453f5b2.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/RCXhI6hV_dfe1c00838648237741380ff19fea34c.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/KC0qfJja_6c8dff396dc19e2aab1806f810ac9c56.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/2O8MSnF8_a020a20f77e59e35d1bf0605c98ab986.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/x4w2TyyY_1aef0676d94a3e157ae43a9772b3d15e.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/HONTL9ZU_34459eea43293125a2abc52236aec857.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/iMuEvJ28_97c86226eb88419214c1e20375f3934e.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/PpimFXi4_7f6b75d547f89e025750141327a78668.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/loAVOUSb_60ce0c764ca68a1dc2765baa3f3bb349.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/DG6V7xHe_169d4d29913a8ea15adbad69ed05b60a.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/CxV80FOe_30b36f38b582d7593f5daa478a893b37.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/LPzorhDA_b38193c88de9390819c8a2c9360b8e37.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/vjok8GWj_7f510a5d90949182ca6b771f8e64ecdb.jpg",
          "https://us.dotwconnect.com/poze_hotel/53/5352335/Ou308Hqy_792118455d45a76e6a4344149bc616fa.jpg"
      ],
      "LatLong": "",
      "Location": "",
      "hotelStars": 2,
      "costCurrency": "USD",
      "costPrice": 250.2449,
      "TotalSellPrice": 250.245,
      "sellCurrency": "KWD",
      "Lat": "",
      "Lng": "",
      "City": "CAIRO",
      "Country": "EGYPT",
      "ZipCode": 'null',
      "Address": "252 Al Haram Street",
      "CityTaxValue": 0,
      "CityTaxCurrency": "",
      "Amenities": [],
      "MarkupId":2,
      "MarkupValue":1,
      "DiscountId":2,
      "DiscountValue":1,
      
  },
  {
    "hotelCode": "432",
    "hotelName": "PYRAMIDS PARK RESORT CAIRO",
    "hotelRate": 86.0216,
    "providerID": "7",
    "providerHotelCode": "5584",
    "providerHotelID": "5584",
    "hotelThumb": "https://us.dotwconnect.com/poze_hotel/55/5584/HEVmo8xU_76a3aada5037c470b8386f08329e8e4a.jpg",
    "hotelDescription": "476 rooms and suites is considered a heaven in a unique landscape of greenery, offering leisure and business travelers a memorable experience amidst a comfortable and relaxing 25 acres of lush gardens and exotic rare plants. location ,walking distance form the Great Egyptian museum (opening 2018) .  5 min away from the  Great Pyramids of Giza and the Sphinx ,a walking distance from the new grand museum ( under construction ) and only 30 min away from  the Egyptian Museum, the Citadel. A little farther but also worthwhile are Khan el-Khalili, Egypt s oldest market, the Museum of modern Egyptian art. The smart village  and Dandy mall are only 16 Km  20 minutes driving , ,23 Km from Mall of Arabia 30 min driving , Mall of Egypt ( under construction ) is only 17 Km , 20 min driving  and 4 KM from Pyramids road.<br />\nWe would like to announce that hotel will start to proceed  yearly Swimming Pool maintenance&amp;amp; repair, Therefore, please be informed that we will be closing the swimming pool area starting from 15th February till 31st of March, 2022. <br />\nNOTICE:<br />\nSwimming pool area closed from 06th April  till 28th April , 2022, &amp;amp; return operating on 29th April 2022.",
    "shortcutHotelDescription": "The PYRAMIDS PARK RESORT CAIRO is a Tourist hotel. Located in Giza area. The nightlife/restaurants are easily accessible by taxi or bus from the hotel.",
    "hotelImages": [
        "https://us.dotwconnect.com/poze_hotel/55/5584/HEVmo8xU_76a3aada5037c470b8386f08329e8e4a.jpg",
        "https://us.dotwconnect.com/poze_hotel/55/5584/LWMqCo9G_157d33ea6fccd25f1bfef4cd25b84f01.jpg",
        "https://us.dotwconnect.com/poze_hotel/55/5584/2kJY5lL1_b1eba442554c2b2a2ccf9c2cd23bfe5b.jpg",
        "https://us.dotwconnect.com/poze_hotel/55/5584/O6N4OARh_2e7e2819542561b0aa814dbec048a4b2.jpg",
        "https://us.dotwconnect.com/poze_hotel/55/5584/54oMMzdr_fc1ef6a41114474cae7aacf70ec2c56a.jpg",
        "https://us.dotwconnect.com/poze_hotel/55/5584/dYhOc5QM_78a42b81526e51f96ec00591b2eda7b3.jpg",
        "https://us.dotwconnect.com/poze_hotel/55/5584/gTKCtOd5_f27d2859870113e1783422cae625a42d.jpg",
        "https://us.dotwconnect.com/poze_hotel/55/5584/P2bPoQ6R_d606897c90a18f82e0418b31304852a5.jpg",
        "https://us.dotwconnect.com/poze_hotel/55/5584/Whlrj70D_6803a549f14665b0bb0ad082a754c79d.jpg",
        "https://us.dotwconnect.com/poze_hotel/55/5584/xyO8KURT_6cdc7466ac916dade049757fe7afd720.jpg",
        "https://us.dotwconnect.com/poze_hotel/55/5584/xYNWkflQ_5497b48cd16a86abcb4887c7354ae234.jpg"
    ],
    "LatLong": "",
    "Location": "Giza",
    "hotelStars": 4,
    "costCurrency": "USD",
    "costPrice": 430.1075,
    "TotalSellPrice": 430.108,
    "sellCurrency": "KWD",
    "Lat": "",
    "Lng": "",
    "City": "CAIRO",
    "Country": "EGYPT",
    "ZipCode": "70",
    "Address": "Cairo-Alexandria Desert Road KM 2.5, Pyramids, Giza",
    "CityTaxValue": 0,
    "CityTaxCurrency": "",
    "Amenities": [],
    "MarkupId":2,
    "MarkupValue":1,
    "DiscountId":2,
    "DiscountValue":1,
},
{
    "hotelCode": "467",
    "hotelName": "Concorde El Salam Hotel",
    "hotelRate": 129.0408,
    "providerID": "7",
    "providerHotelCode": "5304",
    "providerHotelID": "5304",
    "hotelThumb": "https://us.dotwconnect.com/poze_hotel/53/5304/hexu4zoi_71978f270694c14541f78503ede68acb.jpg",
    "hotelDescription": "The hotel is located in the Heliopolis area, just a 7 km drive from Cairo International Airport and 20 km from the city centre.<br />\nFacilities<br />\nThe establishment comprises a total of 334 accommodation units. Guests of the establishment are welcomed in the lobby, which has a 24-hour reception and a 24-hour check-out service. Services such as a safe and currency exchange facilities make for a comfortable stay. Internet access is available in public areas. A balcony is also among the features. Gastronomic options include a restaurant, a café and a bar. Guests can buy holiday mementos from the souvenir shop. Shopping facilities are available. A garden is among the features contributing to a pleasant stay. Guests travelling in their own vehicles can make use of the available parking spaces (for a fee). Additional services include room service, a laundry and a hairdressing salon.<br />\nRooms<br />\nAll accommodation units feature air conditioning and a bathroom. A balcony or terrace can be found in most accommodation units, offering additional comfort. Each accommodation unit features a double bed or a king-size bed. A safe and a minibar also feature. Tea and coffee making equipment is included as standard. Most rooms are equipped with internet access, a telephone and a TV. In the bathrooms, guests will find a shower and a hairdryer.<br />\nSports/Entertainment<br />\nThe establishment offers an outdoor pool and a children&#039;s pool. Sun loungers and parasols offer the ideal way to unwind. A hot tub provides an opportunity for relaxation. Various refreshing drinks are available from the poolside bar. Those wishing to enjoy sports whilst on holiday can have fun on-site with tennis. A gym and squash are some of the sports and leisure options available at the establishment. Various wellness options are offered, including a spa, a sauna, a steam bath, a beauty salon, massage treatments and a solarium. A kids&#039; club and a casino are among the available leisure options. <br />\nMeals<br />\nVarious meals and board options are bookable. Guests can choose from breakfast, lunch, dinner, B &amp;amp; B and half board. Staff are also happy to prepare vegetarian dishes.<br />\nPayment<br />\nThe following credit cards are accepted at the establishment: VISA and MasterCard.",
    "shortcutHotelDescription": "The Concorde El Salam Hotel is a Tourist hotel. The nightlife/restaurants are located in the hotel.",
    "hotelImages": [
        "https://us.dotwconnect.com/poze_hotel/53/5304/hexu4zoi_71978f270694c14541f78503ede68acb.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/vHjK8ECO_f416c025f8b25d86840687aef044b62b.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/LF57eEC2_dd6c5bd00acbf9e79b7001c78af62eec.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/xrv1VvAZ_80fd843efad05e5bde180c004c0a9f5b.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/A9lB1G23_b6d8343261e212cabba92112d2ab9a71.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/ezOsVQSj_f1df41ee309a505e76fa68ff310fd65b.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/Gl2dKFgg_d93a1c792b42f01ef47b1e419b58c9e4.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/pVQvjqzu_a69c8a789c6b44065d03e60a1e1cc03a.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/Llhj5jQD_5da1da4391c820c3a8d173346beedad9.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/geGqBwPT_0ea7c93789eda2d6234c21b479636c30.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/Hj2IHEQ3_c18a1b113c0f35eaf41e1a418df2e6ba.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/STw8IcZx_70095f9b2f65b0cb412682f61929d157.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/wzeYk0Ze_bf921c9b75e55ed7d1b9d91c05575daa.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/Cg0BVOot_ef962e21625a4b5cff38c86df100d032.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/SzNwUeIn_ef962e21625a4b5cff38c86df100d032.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/8P4WcJ4O_4f9b130c2b2915d7813f91e688335871.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/cBnIXzLE_38a85ce7c9e33f833d76f1170f39c1da.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/ceh7bJhu_2e9e2f8b74fb5847ef125dd9145bae43.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/GOt4sIbs_4c54406f521ccadd5986882a0fa3c6ea.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/mGHJvU2q_188f1ac781ce5bff3501218687c91cd2.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/X69PiBsw_d027d42d2ca58074b54260ee0f6a38ff.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/X4CJWkPv_326454c534dd757c2c728f274f9f26b0.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/8AtxJ7gS_7f9e147bf8676a979543fbe007c5c676.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/vUKibMLz_ee2396d90c1f3d8febb4d3848672c3d0.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/rd52Z5yw_95bf1563447896c426d8c45eb38514ea.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/iCzVdgXc_8e2ba803e67880a7bb7a178a4b636338.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/uFCvgqqh_4eeb9eb58668966456b7b88fcf41e51c.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/01A3Ij25_4ca8a3820e6c714c114dcbfc81e19a6f.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/3Pd7kWcs_82960dc9e5c38acf5aa33051b97e5022.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/vv8P3yIs_fa26bcd34c011df30bf7e7f0b9af7212.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/P97tXzKH_26eb3bf481d2b1cb11a0b67e06c940f5.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/ovuzxfEM_b5c168b79285be3fbbcbf069629ca498.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/o8iteCH8_8e46306672ffe888d8c14e03148dc9a3.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/Nj7IMpnE_d1bd533e3329b99c1f6beb465b20b86b.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/5UjYzztk_ad3492b8730290b98cb50c96e05cf4b3.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/zUNQXHQe_555aad53a43bc9db0b2845e5a0d598d0.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/rfCQE2eE_dd776a73cdc789252ec8eb1833e9b90b.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/YljJ8N9V_f84dde926c37036a08af31573082e260.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5304/FslaTWST_8e46306672ffe888d8c14e03148dc9a3.jpg"
    ],
    "LatLong": "",
    "Location": "",
    "hotelStars": 5,
    "costCurrency": "USD",
    "costPrice": 645.2043,
    "TotalSellPrice": 645.204,
    "sellCurrency": "KWD",
    "Lat": "",
    "Lng": "",
    "City": "CAIRO",
    "Country": "EGYPT",
    "ZipCode": "05614",
    "Address": "65 Abdel Hamid Badawi Street",
    "CityTaxValue": 0,
    "CityTaxCurrency": "",
    "Amenities": [],
    "MarkupId":2,
    "MarkupValue":1,
    "DiscountId":2,
    "DiscountValue":1,
},
{
    "hotelCode": "475",
    "hotelName": "Azal Pyramids Hotel",
    "hotelRate": 50.049,
    "providerID": "7",
    "providerHotelCode": "5352335",
    "providerHotelID": "5352335",
    "hotelThumb": "https://us.dotwconnect.com/poze_hotel/53/5352335/i7wrX7Yj_bb531ddad36597dec45c1b20c4399327.jpg",
    "hotelDescription": "The property is 5 km away from Giza Pyramids, 5 km from Pharaonic Village, 6 km from Orman Botanical garden, 8 km from Museum of Egyptian Modern Arts, and 10 km from The National Museum of Egyptian Civilization. The hotel is 4 km away from Giza Suburbs, 4 km from Omm al Misryeen, 4 km from El Giza Train Station, 4 km from Sakiat Mekki, and 28 km from Cairo International Airport and 55 km from Sphinx International Airport.<br />\nFacilities and services include car rental, concierge, swimming pools, free wi-fi, restaurant, room service, laundry facilities, and parking.<br />\nRooms feature air conditioning, TV, and bathroom.",
    "shortcutHotelDescription": "The Azal Pyramids Hotel is a  hotel.",
    "hotelImages": [
        "https://us.dotwconnect.com/poze_hotel/53/5352335/i7wrX7Yj_bb531ddad36597dec45c1b20c4399327.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/GshgiSlq_2f29ff8acdd2285b2410b7af78e94a92.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/SBYqc0rd_46901e304c449ae6d50ada64a77bf867.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/Gl3Azf0m_70881abd4f310b544d5f2a1f461f0a59.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/geCvme1h_a0c5b40a7e3bed40fed1114851880ffa.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/zv5z3W08_bf92a45cac6b268f3094f798bc108c00.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/y3bcHqsN_b220ad98f65c5a52a9e3672397fef9f2.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/oCWJ1M3Z_19f6cf8174002178c876cdfa21d45ba4.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/djHE6xIJ_cb4c1af7b30d237656e8945f2214a5b0.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/asHDbhPc_74f93d350d3af08724ef635e8067ea70.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/sFLgTeMT_cd8decbcb90b0fa6d599208ae453f5b2.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/RCXhI6hV_dfe1c00838648237741380ff19fea34c.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/KC0qfJja_6c8dff396dc19e2aab1806f810ac9c56.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/2O8MSnF8_a020a20f77e59e35d1bf0605c98ab986.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/x4w2TyyY_1aef0676d94a3e157ae43a9772b3d15e.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/HONTL9ZU_34459eea43293125a2abc52236aec857.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/iMuEvJ28_97c86226eb88419214c1e20375f3934e.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/PpimFXi4_7f6b75d547f89e025750141327a78668.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/loAVOUSb_60ce0c764ca68a1dc2765baa3f3bb349.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/DG6V7xHe_169d4d29913a8ea15adbad69ed05b60a.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/CxV80FOe_30b36f38b582d7593f5daa478a893b37.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/LPzorhDA_b38193c88de9390819c8a2c9360b8e37.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/vjok8GWj_7f510a5d90949182ca6b771f8e64ecdb.jpg",
        "https://us.dotwconnect.com/poze_hotel/53/5352335/Ou308Hqy_792118455d45a76e6a4344149bc616fa.jpg"
    ],
    "LatLong": "",
    "Location": "",
    "hotelStars": 2,
    "costCurrency": "USD",
    "costPrice": 250.2449,
    "TotalSellPrice": 250.245,
    "sellCurrency": "KWD",
    "Lat": "",
    "Lng": "",
    "City": "CAIRO",
    "Country": "EGYPT",
    "ZipCode": 'null',
    "Address": "252 Al Haram Street",
    "CityTaxValue": 0,
    "CityTaxCurrency": "",
    "Amenities": [],
    "MarkupId":2,
    "MarkupValue":1,
    "DiscountId":2,
    "DiscountValue":1,
    
},
{
  "hotelCode": "432",
  "hotelName": "PYRAMIDS PARK RESORT CAIRO",
  "hotelRate": 86.0216,
  "providerID": "7",
  "providerHotelCode": "5584",
  "providerHotelID": "5584",
  "hotelThumb": "https://us.dotwconnect.com/poze_hotel/55/5584/HEVmo8xU_76a3aada5037c470b8386f08329e8e4a.jpg",
  "hotelDescription": "476 rooms and suites is considered a heaven in a unique landscape of greenery, offering leisure and business travelers a memorable experience amidst a comfortable and relaxing 25 acres of lush gardens and exotic rare plants. location ,walking distance form the Great Egyptian museum (opening 2018) .  5 min away from the  Great Pyramids of Giza and the Sphinx ,a walking distance from the new grand museum ( under construction ) and only 30 min away from  the Egyptian Museum, the Citadel. A little farther but also worthwhile are Khan el-Khalili, Egypt s oldest market, the Museum of modern Egyptian art. The smart village  and Dandy mall are only 16 Km  20 minutes driving , ,23 Km from Mall of Arabia 30 min driving , Mall of Egypt ( under construction ) is only 17 Km , 20 min driving  and 4 KM from Pyramids road.<br />\nWe would like to announce that hotel will start to proceed  yearly Swimming Pool maintenance&amp;amp; repair, Therefore, please be informed that we will be closing the swimming pool area starting from 15th February till 31st of March, 2022. <br />\nNOTICE:<br />\nSwimming pool area closed from 06th April  till 28th April , 2022, &amp;amp; return operating on 29th April 2022.",
  "shortcutHotelDescription": "The PYRAMIDS PARK RESORT CAIRO is a Tourist hotel. Located in Giza area. The nightlife/restaurants are easily accessible by taxi or bus from the hotel.",
  "hotelImages": [
      "https://us.dotwconnect.com/poze_hotel/55/5584/HEVmo8xU_76a3aada5037c470b8386f08329e8e4a.jpg",
      "https://us.dotwconnect.com/poze_hotel/55/5584/LWMqCo9G_157d33ea6fccd25f1bfef4cd25b84f01.jpg",
      "https://us.dotwconnect.com/poze_hotel/55/5584/2kJY5lL1_b1eba442554c2b2a2ccf9c2cd23bfe5b.jpg",
      "https://us.dotwconnect.com/poze_hotel/55/5584/O6N4OARh_2e7e2819542561b0aa814dbec048a4b2.jpg",
      "https://us.dotwconnect.com/poze_hotel/55/5584/54oMMzdr_fc1ef6a41114474cae7aacf70ec2c56a.jpg",
      "https://us.dotwconnect.com/poze_hotel/55/5584/dYhOc5QM_78a42b81526e51f96ec00591b2eda7b3.jpg",
      "https://us.dotwconnect.com/poze_hotel/55/5584/gTKCtOd5_f27d2859870113e1783422cae625a42d.jpg",
      "https://us.dotwconnect.com/poze_hotel/55/5584/P2bPoQ6R_d606897c90a18f82e0418b31304852a5.jpg",
      "https://us.dotwconnect.com/poze_hotel/55/5584/Whlrj70D_6803a549f14665b0bb0ad082a754c79d.jpg",
      "https://us.dotwconnect.com/poze_hotel/55/5584/xyO8KURT_6cdc7466ac916dade049757fe7afd720.jpg",
      "https://us.dotwconnect.com/poze_hotel/55/5584/xYNWkflQ_5497b48cd16a86abcb4887c7354ae234.jpg"
  ],
  "LatLong": "",
  "Location": "Giza",
  "hotelStars": 4,
  "costCurrency": "USD",
  "costPrice": 430.1075,
  "TotalSellPrice": 430.108,
  "sellCurrency": "KWD",
  "Lat": "",
  "Lng": "",
  "City": "CAIRO",
  "Country": "EGYPT",
  "ZipCode": "70",
  "Address": "Cairo-Alexandria Desert Road KM 2.5, Pyramids, Giza",
  "CityTaxValue": 0,
  "CityTaxCurrency": "",
  "Amenities": [],
  "MarkupId":2,
  "MarkupValue":1,
  "DiscountId":2,
  "DiscountValue":1,
},
{
  "hotelCode": "467",
  "hotelName": "Concorde El Salam Hotel",
  "hotelRate": 129.0408,
  "providerID": "7",
  "providerHotelCode": "5304",
  "providerHotelID": "5304",
  "hotelThumb": "https://us.dotwconnect.com/poze_hotel/53/5304/hexu4zoi_71978f270694c14541f78503ede68acb.jpg",
  "hotelDescription": "The hotel is located in the Heliopolis area, just a 7 km drive from Cairo International Airport and 20 km from the city centre.<br />\nFacilities<br />\nThe establishment comprises a total of 334 accommodation units. Guests of the establishment are welcomed in the lobby, which has a 24-hour reception and a 24-hour check-out service. Services such as a safe and currency exchange facilities make for a comfortable stay. Internet access is available in public areas. A balcony is also among the features. Gastronomic options include a restaurant, a café and a bar. Guests can buy holiday mementos from the souvenir shop. Shopping facilities are available. A garden is among the features contributing to a pleasant stay. Guests travelling in their own vehicles can make use of the available parking spaces (for a fee). Additional services include room service, a laundry and a hairdressing salon.<br />\nRooms<br />\nAll accommodation units feature air conditioning and a bathroom. A balcony or terrace can be found in most accommodation units, offering additional comfort. Each accommodation unit features a double bed or a king-size bed. A safe and a minibar also feature. Tea and coffee making equipment is included as standard. Most rooms are equipped with internet access, a telephone and a TV. In the bathrooms, guests will find a shower and a hairdryer.<br />\nSports/Entertainment<br />\nThe establishment offers an outdoor pool and a children&#039;s pool. Sun loungers and parasols offer the ideal way to unwind. A hot tub provides an opportunity for relaxation. Various refreshing drinks are available from the poolside bar. Those wishing to enjoy sports whilst on holiday can have fun on-site with tennis. A gym and squash are some of the sports and leisure options available at the establishment. Various wellness options are offered, including a spa, a sauna, a steam bath, a beauty salon, massage treatments and a solarium. A kids&#039; club and a casino are among the available leisure options. <br />\nMeals<br />\nVarious meals and board options are bookable. Guests can choose from breakfast, lunch, dinner, B &amp;amp; B and half board. Staff are also happy to prepare vegetarian dishes.<br />\nPayment<br />\nThe following credit cards are accepted at the establishment: VISA and MasterCard.",
  "shortcutHotelDescription": "The Concorde El Salam Hotel is a Tourist hotel. The nightlife/restaurants are located in the hotel.",
  "hotelImages": [
      "https://us.dotwconnect.com/poze_hotel/53/5304/hexu4zoi_71978f270694c14541f78503ede68acb.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/vHjK8ECO_f416c025f8b25d86840687aef044b62b.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/LF57eEC2_dd6c5bd00acbf9e79b7001c78af62eec.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/xrv1VvAZ_80fd843efad05e5bde180c004c0a9f5b.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/A9lB1G23_b6d8343261e212cabba92112d2ab9a71.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/ezOsVQSj_f1df41ee309a505e76fa68ff310fd65b.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/Gl2dKFgg_d93a1c792b42f01ef47b1e419b58c9e4.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/pVQvjqzu_a69c8a789c6b44065d03e60a1e1cc03a.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/Llhj5jQD_5da1da4391c820c3a8d173346beedad9.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/geGqBwPT_0ea7c93789eda2d6234c21b479636c30.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/Hj2IHEQ3_c18a1b113c0f35eaf41e1a418df2e6ba.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/STw8IcZx_70095f9b2f65b0cb412682f61929d157.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/wzeYk0Ze_bf921c9b75e55ed7d1b9d91c05575daa.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/Cg0BVOot_ef962e21625a4b5cff38c86df100d032.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/SzNwUeIn_ef962e21625a4b5cff38c86df100d032.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/8P4WcJ4O_4f9b130c2b2915d7813f91e688335871.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/cBnIXzLE_38a85ce7c9e33f833d76f1170f39c1da.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/ceh7bJhu_2e9e2f8b74fb5847ef125dd9145bae43.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/GOt4sIbs_4c54406f521ccadd5986882a0fa3c6ea.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/mGHJvU2q_188f1ac781ce5bff3501218687c91cd2.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/X69PiBsw_d027d42d2ca58074b54260ee0f6a38ff.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/X4CJWkPv_326454c534dd757c2c728f274f9f26b0.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/8AtxJ7gS_7f9e147bf8676a979543fbe007c5c676.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/vUKibMLz_ee2396d90c1f3d8febb4d3848672c3d0.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/rd52Z5yw_95bf1563447896c426d8c45eb38514ea.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/iCzVdgXc_8e2ba803e67880a7bb7a178a4b636338.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/uFCvgqqh_4eeb9eb58668966456b7b88fcf41e51c.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/01A3Ij25_4ca8a3820e6c714c114dcbfc81e19a6f.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/3Pd7kWcs_82960dc9e5c38acf5aa33051b97e5022.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/vv8P3yIs_fa26bcd34c011df30bf7e7f0b9af7212.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/P97tXzKH_26eb3bf481d2b1cb11a0b67e06c940f5.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/ovuzxfEM_b5c168b79285be3fbbcbf069629ca498.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/o8iteCH8_8e46306672ffe888d8c14e03148dc9a3.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/Nj7IMpnE_d1bd533e3329b99c1f6beb465b20b86b.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/5UjYzztk_ad3492b8730290b98cb50c96e05cf4b3.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/zUNQXHQe_555aad53a43bc9db0b2845e5a0d598d0.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/rfCQE2eE_dd776a73cdc789252ec8eb1833e9b90b.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/YljJ8N9V_f84dde926c37036a08af31573082e260.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/FslaTWST_8e46306672ffe888d8c14e03148dc9a3.jpg"
  ],
  "LatLong": "",
  "Location": "",
  "hotelStars": 5,
  "costCurrency": "USD",
  "costPrice": 645.2043,
  "TotalSellPrice": 645.204,
  "sellCurrency": "KWD",
  "Lat": "",
  "Lng": "",
  "City": "CAIRO",
  "Country": "EGYPT",
  "ZipCode": "05614",
  "Address": "65 Abdel Hamid Badawi Street",
  "CityTaxValue": 0,
  "CityTaxCurrency": "",
  "Amenities": [],
  "MarkupId":2,
  "MarkupValue":1,
  "DiscountId":2,
  "DiscountValue":1,
},
{
  "hotelCode": "475",
  "hotelName": "Azal Pyramids Hotel",
  "hotelRate": 50.049,
  "providerID": "7",
  "providerHotelCode": "5352335",
  "providerHotelID": "5352335",
  "hotelThumb": "https://us.dotwconnect.com/poze_hotel/53/5352335/i7wrX7Yj_bb531ddad36597dec45c1b20c4399327.jpg",
  "hotelDescription": "The property is 5 km away from Giza Pyramids, 5 km from Pharaonic Village, 6 km from Orman Botanical garden, 8 km from Museum of Egyptian Modern Arts, and 10 km from The National Museum of Egyptian Civilization. The hotel is 4 km away from Giza Suburbs, 4 km from Omm al Misryeen, 4 km from El Giza Train Station, 4 km from Sakiat Mekki, and 28 km from Cairo International Airport and 55 km from Sphinx International Airport.<br />\nFacilities and services include car rental, concierge, swimming pools, free wi-fi, restaurant, room service, laundry facilities, and parking.<br />\nRooms feature air conditioning, TV, and bathroom.",
  "shortcutHotelDescription": "The Azal Pyramids Hotel is a  hotel.",
  "hotelImages": [
      "https://us.dotwconnect.com/poze_hotel/53/5352335/i7wrX7Yj_bb531ddad36597dec45c1b20c4399327.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/GshgiSlq_2f29ff8acdd2285b2410b7af78e94a92.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/SBYqc0rd_46901e304c449ae6d50ada64a77bf867.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/Gl3Azf0m_70881abd4f310b544d5f2a1f461f0a59.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/geCvme1h_a0c5b40a7e3bed40fed1114851880ffa.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/zv5z3W08_bf92a45cac6b268f3094f798bc108c00.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/y3bcHqsN_b220ad98f65c5a52a9e3672397fef9f2.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/oCWJ1M3Z_19f6cf8174002178c876cdfa21d45ba4.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/djHE6xIJ_cb4c1af7b30d237656e8945f2214a5b0.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/asHDbhPc_74f93d350d3af08724ef635e8067ea70.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/sFLgTeMT_cd8decbcb90b0fa6d599208ae453f5b2.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/RCXhI6hV_dfe1c00838648237741380ff19fea34c.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/KC0qfJja_6c8dff396dc19e2aab1806f810ac9c56.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/2O8MSnF8_a020a20f77e59e35d1bf0605c98ab986.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/x4w2TyyY_1aef0676d94a3e157ae43a9772b3d15e.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/HONTL9ZU_34459eea43293125a2abc52236aec857.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/iMuEvJ28_97c86226eb88419214c1e20375f3934e.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/PpimFXi4_7f6b75d547f89e025750141327a78668.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/loAVOUSb_60ce0c764ca68a1dc2765baa3f3bb349.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/DG6V7xHe_169d4d29913a8ea15adbad69ed05b60a.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/CxV80FOe_30b36f38b582d7593f5daa478a893b37.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/LPzorhDA_b38193c88de9390819c8a2c9360b8e37.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/vjok8GWj_7f510a5d90949182ca6b771f8e64ecdb.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/Ou308Hqy_792118455d45a76e6a4344149bc616fa.jpg"
  ],
  "LatLong": "",
  "Location": "",
  "hotelStars": 2,
  "costCurrency": "USD",
  "costPrice": 250.2449,
  "TotalSellPrice": 250.245,
  "sellCurrency": "KWD",
  "Lat": "",
  "Lng": "",
  "City": "CAIRO",
  "Country": "EGYPT",
  "ZipCode": 'null',
  "Address": "252 Al Haram Street",
  "CityTaxValue": 0,
  "CityTaxCurrency": "",
  "Amenities": [],
  "MarkupId":2,
  "MarkupValue":1,
  "DiscountId":2,
  "DiscountValue":1,
  
},
{
  "hotelCode": "432",
  "hotelName": "PYRAMIDS PARK RESORT CAIRO",
  "hotelRate": 86.0216,
  "providerID": "7",
  "providerHotelCode": "5584",
  "providerHotelID": "5584",
  "hotelThumb": "https://us.dotwconnect.com/poze_hotel/55/5584/HEVmo8xU_76a3aada5037c470b8386f08329e8e4a.jpg",
  "hotelDescription": "476 rooms and suites is considered a heaven in a unique landscape of greenery, offering leisure and business travelers a memorable experience amidst a comfortable and relaxing 25 acres of lush gardens and exotic rare plants. location ,walking distance form the Great Egyptian museum (opening 2018) .  5 min away from the  Great Pyramids of Giza and the Sphinx ,a walking distance from the new grand museum ( under construction ) and only 30 min away from  the Egyptian Museum, the Citadel. A little farther but also worthwhile are Khan el-Khalili, Egypt s oldest market, the Museum of modern Egyptian art. The smart village  and Dandy mall are only 16 Km  20 minutes driving , ,23 Km from Mall of Arabia 30 min driving , Mall of Egypt ( under construction ) is only 17 Km , 20 min driving  and 4 KM from Pyramids road.<br />\nWe would like to announce that hotel will start to proceed  yearly Swimming Pool maintenance&amp;amp; repair, Therefore, please be informed that we will be closing the swimming pool area starting from 15th February till 31st of March, 2022. <br />\nNOTICE:<br />\nSwimming pool area closed from 06th April  till 28th April , 2022, &amp;amp; return operating on 29th April 2022.",
  "shortcutHotelDescription": "The PYRAMIDS PARK RESORT CAIRO is a Tourist hotel. Located in Giza area. The nightlife/restaurants are easily accessible by taxi or bus from the hotel.",
  "hotelImages": [
      "https://us.dotwconnect.com/poze_hotel/55/5584/HEVmo8xU_76a3aada5037c470b8386f08329e8e4a.jpg",
      "https://us.dotwconnect.com/poze_hotel/55/5584/LWMqCo9G_157d33ea6fccd25f1bfef4cd25b84f01.jpg",
      "https://us.dotwconnect.com/poze_hotel/55/5584/2kJY5lL1_b1eba442554c2b2a2ccf9c2cd23bfe5b.jpg",
      "https://us.dotwconnect.com/poze_hotel/55/5584/O6N4OARh_2e7e2819542561b0aa814dbec048a4b2.jpg",
      "https://us.dotwconnect.com/poze_hotel/55/5584/54oMMzdr_fc1ef6a41114474cae7aacf70ec2c56a.jpg",
      "https://us.dotwconnect.com/poze_hotel/55/5584/dYhOc5QM_78a42b81526e51f96ec00591b2eda7b3.jpg",
      "https://us.dotwconnect.com/poze_hotel/55/5584/gTKCtOd5_f27d2859870113e1783422cae625a42d.jpg",
      "https://us.dotwconnect.com/poze_hotel/55/5584/P2bPoQ6R_d606897c90a18f82e0418b31304852a5.jpg",
      "https://us.dotwconnect.com/poze_hotel/55/5584/Whlrj70D_6803a549f14665b0bb0ad082a754c79d.jpg",
      "https://us.dotwconnect.com/poze_hotel/55/5584/xyO8KURT_6cdc7466ac916dade049757fe7afd720.jpg",
      "https://us.dotwconnect.com/poze_hotel/55/5584/xYNWkflQ_5497b48cd16a86abcb4887c7354ae234.jpg"
  ],
  "LatLong": "",
  "Location": "Giza",
  "hotelStars": 4,
  "costCurrency": "USD",
  "costPrice": 430.1075,
  "TotalSellPrice": 430.108,
  "sellCurrency": "KWD",
  "Lat": "",
  "Lng": "",
  "City": "CAIRO",
  "Country": "EGYPT",
  "ZipCode": "70",
  "Address": "Cairo-Alexandria Desert Road KM 2.5, Pyramids, Giza",
  "CityTaxValue": 0,
  "CityTaxCurrency": "",
  "Amenities": [],
  "MarkupId":2,
  "MarkupValue":1,
  "DiscountId":2,
  "DiscountValue":1,
},
{
  "hotelCode": "467",
  "hotelName": "Concorde El Salam Hotel",
  "hotelRate": 129.0408,
  "providerID": "7",
  "providerHotelCode": "5304",
  "providerHotelID": "5304",
  "hotelThumb": "https://us.dotwconnect.com/poze_hotel/53/5304/hexu4zoi_71978f270694c14541f78503ede68acb.jpg",
  "hotelDescription": "The hotel is located in the Heliopolis area, just a 7 km drive from Cairo International Airport and 20 km from the city centre.<br />\nFacilities<br />\nThe establishment comprises a total of 334 accommodation units. Guests of the establishment are welcomed in the lobby, which has a 24-hour reception and a 24-hour check-out service. Services such as a safe and currency exchange facilities make for a comfortable stay. Internet access is available in public areas. A balcony is also among the features. Gastronomic options include a restaurant, a café and a bar. Guests can buy holiday mementos from the souvenir shop. Shopping facilities are available. A garden is among the features contributing to a pleasant stay. Guests travelling in their own vehicles can make use of the available parking spaces (for a fee). Additional services include room service, a laundry and a hairdressing salon.<br />\nRooms<br />\nAll accommodation units feature air conditioning and a bathroom. A balcony or terrace can be found in most accommodation units, offering additional comfort. Each accommodation unit features a double bed or a king-size bed. A safe and a minibar also feature. Tea and coffee making equipment is included as standard. Most rooms are equipped with internet access, a telephone and a TV. In the bathrooms, guests will find a shower and a hairdryer.<br />\nSports/Entertainment<br />\nThe establishment offers an outdoor pool and a children&#039;s pool. Sun loungers and parasols offer the ideal way to unwind. A hot tub provides an opportunity for relaxation. Various refreshing drinks are available from the poolside bar. Those wishing to enjoy sports whilst on holiday can have fun on-site with tennis. A gym and squash are some of the sports and leisure options available at the establishment. Various wellness options are offered, including a spa, a sauna, a steam bath, a beauty salon, massage treatments and a solarium. A kids&#039; club and a casino are among the available leisure options. <br />\nMeals<br />\nVarious meals and board options are bookable. Guests can choose from breakfast, lunch, dinner, B &amp;amp; B and half board. Staff are also happy to prepare vegetarian dishes.<br />\nPayment<br />\nThe following credit cards are accepted at the establishment: VISA and MasterCard.",
  "shortcutHotelDescription": "The Concorde El Salam Hotel is a Tourist hotel. The nightlife/restaurants are located in the hotel.",
  "hotelImages": [
      "https://us.dotwconnect.com/poze_hotel/53/5304/hexu4zoi_71978f270694c14541f78503ede68acb.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/vHjK8ECO_f416c025f8b25d86840687aef044b62b.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/LF57eEC2_dd6c5bd00acbf9e79b7001c78af62eec.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/xrv1VvAZ_80fd843efad05e5bde180c004c0a9f5b.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/A9lB1G23_b6d8343261e212cabba92112d2ab9a71.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/ezOsVQSj_f1df41ee309a505e76fa68ff310fd65b.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/Gl2dKFgg_d93a1c792b42f01ef47b1e419b58c9e4.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/pVQvjqzu_a69c8a789c6b44065d03e60a1e1cc03a.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/Llhj5jQD_5da1da4391c820c3a8d173346beedad9.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/geGqBwPT_0ea7c93789eda2d6234c21b479636c30.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/Hj2IHEQ3_c18a1b113c0f35eaf41e1a418df2e6ba.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/STw8IcZx_70095f9b2f65b0cb412682f61929d157.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/wzeYk0Ze_bf921c9b75e55ed7d1b9d91c05575daa.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/Cg0BVOot_ef962e21625a4b5cff38c86df100d032.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/SzNwUeIn_ef962e21625a4b5cff38c86df100d032.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/8P4WcJ4O_4f9b130c2b2915d7813f91e688335871.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/cBnIXzLE_38a85ce7c9e33f833d76f1170f39c1da.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/ceh7bJhu_2e9e2f8b74fb5847ef125dd9145bae43.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/GOt4sIbs_4c54406f521ccadd5986882a0fa3c6ea.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/mGHJvU2q_188f1ac781ce5bff3501218687c91cd2.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/X69PiBsw_d027d42d2ca58074b54260ee0f6a38ff.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/X4CJWkPv_326454c534dd757c2c728f274f9f26b0.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/8AtxJ7gS_7f9e147bf8676a979543fbe007c5c676.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/vUKibMLz_ee2396d90c1f3d8febb4d3848672c3d0.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/rd52Z5yw_95bf1563447896c426d8c45eb38514ea.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/iCzVdgXc_8e2ba803e67880a7bb7a178a4b636338.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/uFCvgqqh_4eeb9eb58668966456b7b88fcf41e51c.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/01A3Ij25_4ca8a3820e6c714c114dcbfc81e19a6f.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/3Pd7kWcs_82960dc9e5c38acf5aa33051b97e5022.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/vv8P3yIs_fa26bcd34c011df30bf7e7f0b9af7212.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/P97tXzKH_26eb3bf481d2b1cb11a0b67e06c940f5.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/ovuzxfEM_b5c168b79285be3fbbcbf069629ca498.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/o8iteCH8_8e46306672ffe888d8c14e03148dc9a3.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/Nj7IMpnE_d1bd533e3329b99c1f6beb465b20b86b.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/5UjYzztk_ad3492b8730290b98cb50c96e05cf4b3.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/zUNQXHQe_555aad53a43bc9db0b2845e5a0d598d0.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/rfCQE2eE_dd776a73cdc789252ec8eb1833e9b90b.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/YljJ8N9V_f84dde926c37036a08af31573082e260.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5304/FslaTWST_8e46306672ffe888d8c14e03148dc9a3.jpg"
  ],
  "LatLong": "",
  "Location": "",
  "hotelStars": 5,
  "costCurrency": "USD",
  "costPrice": 645.2043,
  "TotalSellPrice": 645.204,
  "sellCurrency": "KWD",
  "Lat": "",
  "Lng": "",
  "City": "CAIRO",
  "Country": "EGYPT",
  "ZipCode": "05614",
  "Address": "65 Abdel Hamid Badawi Street",
  "CityTaxValue": 0,
  "CityTaxCurrency": "",
  "Amenities": [],
  "MarkupId":2,
  "MarkupValue":1,
  "DiscountId":2,
  "DiscountValue":1,
},
{
  "hotelCode": "475",
  "hotelName": "Azal Pyramids Hotel",
  "hotelRate": 50.049,
  "providerID": "7",
  "providerHotelCode": "5352335",
  "providerHotelID": "5352335",
  "hotelThumb": "https://us.dotwconnect.com/poze_hotel/53/5352335/i7wrX7Yj_bb531ddad36597dec45c1b20c4399327.jpg",
  "hotelDescription": "The property is 5 km away from Giza Pyramids, 5 km from Pharaonic Village, 6 km from Orman Botanical garden, 8 km from Museum of Egyptian Modern Arts, and 10 km from The National Museum of Egyptian Civilization. The hotel is 4 km away from Giza Suburbs, 4 km from Omm al Misryeen, 4 km from El Giza Train Station, 4 km from Sakiat Mekki, and 28 km from Cairo International Airport and 55 km from Sphinx International Airport.<br />\nFacilities and services include car rental, concierge, swimming pools, free wi-fi, restaurant, room service, laundry facilities, and parking.<br />\nRooms feature air conditioning, TV, and bathroom.",
  "shortcutHotelDescription": "The Azal Pyramids Hotel is a  hotel.",
  "hotelImages": [
      "https://us.dotwconnect.com/poze_hotel/53/5352335/i7wrX7Yj_bb531ddad36597dec45c1b20c4399327.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/GshgiSlq_2f29ff8acdd2285b2410b7af78e94a92.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/SBYqc0rd_46901e304c449ae6d50ada64a77bf867.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/Gl3Azf0m_70881abd4f310b544d5f2a1f461f0a59.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/geCvme1h_a0c5b40a7e3bed40fed1114851880ffa.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/zv5z3W08_bf92a45cac6b268f3094f798bc108c00.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/y3bcHqsN_b220ad98f65c5a52a9e3672397fef9f2.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/oCWJ1M3Z_19f6cf8174002178c876cdfa21d45ba4.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/djHE6xIJ_cb4c1af7b30d237656e8945f2214a5b0.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/asHDbhPc_74f93d350d3af08724ef635e8067ea70.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/sFLgTeMT_cd8decbcb90b0fa6d599208ae453f5b2.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/RCXhI6hV_dfe1c00838648237741380ff19fea34c.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/KC0qfJja_6c8dff396dc19e2aab1806f810ac9c56.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/2O8MSnF8_a020a20f77e59e35d1bf0605c98ab986.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/x4w2TyyY_1aef0676d94a3e157ae43a9772b3d15e.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/HONTL9ZU_34459eea43293125a2abc52236aec857.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/iMuEvJ28_97c86226eb88419214c1e20375f3934e.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/PpimFXi4_7f6b75d547f89e025750141327a78668.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/loAVOUSb_60ce0c764ca68a1dc2765baa3f3bb349.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/DG6V7xHe_169d4d29913a8ea15adbad69ed05b60a.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/CxV80FOe_30b36f38b582d7593f5daa478a893b37.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/LPzorhDA_b38193c88de9390819c8a2c9360b8e37.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/vjok8GWj_7f510a5d90949182ca6b771f8e64ecdb.jpg",
      "https://us.dotwconnect.com/poze_hotel/53/5352335/Ou308Hqy_792118455d45a76e6a4344149bc616fa.jpg"
  ],
  "LatLong": "",
  "Location": "",
  "hotelStars": 2,
  "costCurrency": "USD",
  "costPrice": 250.2449,
  "TotalSellPrice": 250.245,
  "sellCurrency": "KWD",
  "Lat": "",
  "Lng": "",
  "City": "CAIRO",
  "Country": "EGYPT",
  "ZipCode": 'null',
  "Address": "252 Al Haram Street",
  "CityTaxValue": 0,
  "CityTaxCurrency": "",
  "Amenities": [],
  "MarkupId":2,
  "MarkupValue":1,
  "DiscountId":2,
  "DiscountValue":1,
  
},
]
          this.hotelLocationsArr= [...res.Locations.filter((l)=>{return l != ''})]
          this.locationsArrSelected= [...res.Locations.filter((l)=>{return l != ''})]
         
          //GET START AND END DATE TO CALCULATE ROOM NIGHTS NUMBER 
          let startDate:Date  =new Date(dateFrom.replace(new RegExp('%20','g'),' '));
          let endDate: Date  = new Date(dateTo.replace(new RegExp('%20','g'),' '));

          this.nightsNumber = this.calculateHotelNights(startDate,endDate);

          //initialize hotel locations form array value with true values (selected)
          this.hotelLocationsArr.map(()=>{
            this.addLocations()
          })

          //initialize hotel rate array with rates
          for(let i=0; i<5; i++){
            this.addRating();
            this.ratesArrSelected.push(i+1)
          }
          
          this.sorting(1);

          //set price slider configurations
          this.maxPrice = [...this.filteredHotels][0].costPrice;
          this.maxPriceValueForSlider = [...this.filteredHotels][0].costPrice + 100;
          this.minPrice = [...this.filteredHotels][this.filteredHotels.length -1].costPrice;
          this.minPriceValueForSlider = [...this.filteredHotels][this.filteredHotels.length -1].costPrice;


          
          this.setFormPriceValue(); //set filter form values for price
          this.hotelsFilter();
          this.splicedFiltiredHotels = [...this.filteredHotels.slice(0,5)]
          this.hotelResultsLoader = false;
        }
      },err=>{
        console.log("result response error",err)
        this.hotelResultsLoader = false
      })
      )
  }
  /**
   * this function is responsible to calculate Nights Number from Dates 
   * @param startDate get value from URL
   * @param endDate get value from URL
   * @returns Nights Number
   */
  calculateHotelNights(startDate:Date,endDate:Date){
    return Math.floor((Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) - Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) ) /(1000 * 60 * 60 * 24));
}
  /**
   * this function is responsible to generate search rooms Array
   * @param guestInfo get this string from URL after splitting it
   */
  generateSearchRooms(guestInfo: string) {
    let SearchRooms: guests[] = [];
    let roomsInfo = guestInfo.split("R");

    for (let i = 1; i < roomsInfo.length; i++) { 
        let roomData = roomsInfo[i];
        
        let adult = Number(roomData.slice(2, 3));
        let child = Number(roomData.slice(4, 5));

        let childrenAges: number[] = [];
        if (child > 0) {
            for (let j = 0; j < child; j++) {
                childrenAges.push(Number(roomData.slice(6 + j * 2, 7 + j * 2))); 
            }
        }

        SearchRooms.push({ adult, child:childrenAges});
    }

    return SearchRooms;
}
  /**
   * this function is responsible to sort the hotels data based on Price and Star Rating
   * @param sortIndex based on index of looping on Sort Boxes
   * 0 ==> sort from lowest Price To Highest
   * 1 ==> sort from Highest Price To lowest
   * 2 ==> sort from lowest Star Rate To Highest
   * 3 ==> sort from Highest Star Rate To lowest
   */
  sorting(sortIndex:number){
    switch (sortIndex) {
      case 0:
        {
          this.filteredHotels = this.filteredHotels.sort((low, high) => low.TotalSellPrice - high.TotalSellPrice);
          this.splicedFiltiredHotels = this.splicedFiltiredHotels.sort((low, high) => low.TotalSellPrice - high.TotalSellPrice);
          break;
        }

      case 1:
        {
         this.filteredHotels = this.filteredHotels.sort((low, high) => high.TotalSellPrice - low.TotalSellPrice);
         this.splicedFiltiredHotels = this.splicedFiltiredHotels.sort((low, high) => high.TotalSellPrice - low.TotalSellPrice);
          break;
        }
        case 2:
          {
            this.filteredHotels = this.filteredHotels.sort((low, high) => low.hotelStars - high.hotelStars);
            this.splicedFiltiredHotels = this.splicedFiltiredHotels.sort((low, high) => low.hotelStars - high.hotelStars);
            break;
          }
  
        case 3:
          {
           this.filteredHotels = this.filteredHotels.sort((low, high) => high.hotelStars - low.hotelStars);
           this.splicedFiltiredHotels = this.splicedFiltiredHotels.sort((low, high) => high.hotelStars - low.hotelStars);
            break;
          }
      default:
        {
          this.filteredHotels = this.filteredHotels.sort((low, high) => high.TotalSellPrice - low.TotalSellPrice);
          this.splicedFiltiredHotels = this.splicedFiltiredHotels.sort((low, high) => high.TotalSellPrice - low.TotalSellPrice);
          break;
        } 
    }
    return this.filteredHotels;
  }
  hotelsFilter(){ 
    this.subscription.add(
      this.filterForm.valueChanges.subscribe((res)=>{
        if(this.hotelDataResponse?.HotelResult){
          this.filteredHotels = this.hotelDataResponse?.HotelResult.filter(hotel => this.filterHotelData(hotel))
          this.splicedFiltiredHotels = [...this.filteredHotels.slice(0,5)]
        }
      })
    )
  }


  loadMoreData(){
    if((this.splicedFiltiredHotels.length + 5 ) < this.filteredHotels.length){
      this.splicedFiltiredHotels = [...this.filteredHotels.slice(0,this.splicedFiltiredHotels.length + 5)]
    }else{
      this.splicedFiltiredHotels = [...this.filteredHotels]
    }
    
  }
  /**
   * filter Hotel Object based on Hotel Name, Hotel Star rate, Hotel Price and hotel Locations 
   * @param hotel 
   * @returns 
   */
  filterHotelData(hotel:hotel){
    return (hotel.hotelName.toLowerCase()).includes((this.filterForm.get('hotelName')?.value).toLowerCase()) && ((hotel.costPrice >= this.filterForm.get('hotelPriceMin')?.value) && (hotel.costPrice <= this.filterForm.get('hotelPriceMax')?.value)) 
           && this.filterLocations(hotel.Address) && this.ratesArrSelected.includes( hotel.hotelStars) 
  }
  /**
   * initialize hotel rates form array with true value to make it selected
   */
  addRating(){
    (<FormArray>this.filterForm.get('hotelRates')).push(
      new FormGroup ({
        rate: new FormControl(true),
      })
    )
  }
  /**
 * call it on the hotel rate filter input to fill the hotel Rates Array (selected Values)
 * */
  selectHotelRates(index:number){
    // Toggle checked
    if(!this.hotelRatesArray.at(index)?.get('rate')?.value){
      this.ratesArrSelected.push(index+1);
    }
    else{
      let rateIndex= this.ratesArrSelected.indexOf(index+1)
      this.ratesArrSelected.splice(rateIndex,1);
    }
  }
  /**
   * initialize hotel Locations form array with true value to make it selected
   */
  addLocations(){
    (<FormArray>this.filterForm.get('hotelLocations')).push(
      new FormGroup ({
        location: new FormControl(true),
      })
    )
  }
  /**
   * call it on the locations filter input to fill the Locations Array (selected Values)
   * @param index  index of the current selected or deselected location
   * @param value  current selected or deselected location
   */
  selectLocations(index:number, value:string){
    if(this.hotelLocationsArray.at(index)?.get('location')?.value == false){
      this.locationsArrSelected.push(value);
    }
    else{
      let locationIndex= this.locationsArrSelected.indexOf(value)
      this.locationsArrSelected.splice(locationIndex,1);
    }
  }
  public get hotelRatesArray(): FormArray{
    return this.filterForm.get('hotelRates') as FormArray;
  }
  public get hotelLocationsArray(): FormArray{
    return this.filterForm.get('hotelLocations') as FormArray;
  }
  /**
   * this function is responsible to set max and min Price for initial price Form
   */
  setFormPriceValue(){
    this.filterForm.get('hotelPriceMax')?.setValue(this.maxPriceValueForSlider);
    this.filterForm.get('hotelPriceMin')?.setValue(this.minPriceValueForSlider);
  }
  /**
   *  filter locations based on selected location items 
   * @param hotelAddres  hotel addres Name from current object
   * @returns 
   */

  filterLocations(hotelAddres:string):boolean{
    let addressValuesArr: Array<Boolean>= [];

    //loop on Selected locations Array to check if selected is a sub string from Hotel Address
    this.locationsArrSelected.map((item)=>{
      hotelAddres.toLowerCase().includes(item.toLowerCase()) ? addressValuesArr.push(true) : addressValuesArr.push(false)
    })
    return addressValuesArr.includes(true) ? true : false ; //if (addressValuesArr) Array contains one True value then return True else return False 
  }
  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer(){
    this.subscription = new Subscription();
    this.hotelDataResponse = undefined!;
    this.hotelLocationsArr=[];
    this.filteredHotels = [];
    this.splicedFiltiredHotels = []
    this.locationsArrSelected = [];
    this.ratesArrSelected = [];
    this.hotelResultsLoader=false;
    this.searchID='';
    this.maxPrice=100;
    this.minPrice=0;
    this.nightsNumber=0;
    this.minPriceValueForSlider = 0
    this.maxPriceValueForSlider = 100

    this.resetHotelForm();
  }
}
