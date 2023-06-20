import Address from "../../../../sharedKernel/valueObjects/Address";
import Email from "../../../../sharedKernel/valueObjects/Email";

export default class Customer {
    email: Email;;
    name: string;
    address: Address;

    constructor(name: string, email: Email, address: Address) {
        this.email = email;
        this.name = name;
        this.address = address;
    }
}