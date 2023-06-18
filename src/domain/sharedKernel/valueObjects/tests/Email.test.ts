import Email from "../Email";

describe('Email', () => {
    describe('constructor', () => {
        it('should create a new Email instance with a valid email address', () => {
            const validEmail = 'test@example.com';
            const email = new Email(validEmail);
            expect(email.getEmail()).toBe(validEmail);
        });

        it('should throw an error for an invalid email address', () => {
            const invalidEmail = 'invalid-email';
            expect(() => new Email(invalidEmail)).toThrow('Invalid email address.');
        });
    });

    describe('getEmail', () => {
        it('should return the stored email address', () => {
            const validEmail = 'test@example.com';
            const email = new Email(validEmail);
            expect(email.getEmail()).toBe(validEmail);
        });
    });
});
