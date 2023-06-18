import Address from "../../../../sharedKernel/valueObjects/Address";
import Email from "../../../../sharedKernel/valueObjects/Email";

export default class Customer {
    private readonly email: Email;
    private readonly name: string;
    private readonly address: Address;

    constructor(email: Email, name: string, address: Address) {
        this.email = email;
        this.name = name;
        this.address = address;
    }

    static createMock(): Customer {
        const email = new Email("mock@example.com");
        const name = "Mock Customer";
        const address = new Address("Mock Street", "Mock City", 21910173, "Mock State", "Mock Country");

        return new Customer(email, name, address);
    }
}