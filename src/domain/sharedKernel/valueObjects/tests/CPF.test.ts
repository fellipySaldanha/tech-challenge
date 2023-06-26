import CPF from "../CPF";

describe("CPF", () => {
  test("should validate a valid CPF with only number", () => {
    const cpf = new CPF("12345678909");
    expect(cpf.validate(cpf.getCPF())).toBe(true);
  });

  test("should validate a valid formatted cpf", () => {
    const cpf = new CPF("123.456.789-09");
    expect(cpf.validate(cpf.getCPF())).toBe(true);
  });

  test("should throw an error for an invalid CPF", () => {
    expect(() => {
      new CPF("00000000000");
    }).toThrowError("invalid CPF");
  });
});
