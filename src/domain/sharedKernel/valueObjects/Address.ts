export default class Address{
    private readonly street : string;
    private readonly city : string;
    private readonly postalCode : number;
    private readonly state : string;
    private readonly country : string;

    constructor(street:string, city:string, postalCode:number, state:string, country:string){
        this.street = street;
        this.city = city;
        this.postalCode = postalCode;
        this.state = state;
        this.country = country;
    }

}