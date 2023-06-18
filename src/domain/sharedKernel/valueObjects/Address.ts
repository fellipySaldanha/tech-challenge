export default class Address{
    private readonly street : String;
    private readonly city : String;
    private readonly postalCode : Number;
    private readonly state : String;
    private readonly country : String;

    constructor(street:String, city:String, postalCode:Number, state:String, country:String){
        this.street = street;
        this.city = city;
        this.postalCode = postalCode;
        this.state = state;
        this.country = country;
    }

}