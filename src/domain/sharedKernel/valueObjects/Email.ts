export default class Email {
    private readonly email: string;

    constructor(email: string) {
        this.validateEmail(email);
        this.email = email;
    }

    private validateEmail(email: string): void {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (!emailRegex.test(email)) {
            throw new Error("Invalid email address.");
        }
    }

    public getEmail(): string {
        return this.email;
    }
}
