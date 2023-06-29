import CPF from "../../../../sharedKernel/valueObjects/CPF";
import Email from "../../../../sharedKernel/valueObjects/Email";

export default class Customer {
    email: Email;
    name: string;
    cpf: CPF;
    isActive: boolean;

    constructor(name: string, email: Email, cpf: CPF, isActive: boolean) {
        this.email = email;
        this.name = name;
        this.cpf = cpf;
        this.isActive = isActive;
    }
}