export default class CPF{
    private readonly number: string;

    constructor(number: string){
        if(!this.validate(number)) throw new Error('invalid CPF');
        this.number = number;
    }

    public getCPF():string{
        return this.number;
    }

    validate(strCPF: string){
        let Soma: number;
        let Resto: number;
        Soma = 0;
        strCPF = strCPF?.replace(/\D/g, '');
        if (strCPF == "00000000000") return false;

        for (let i = 1; i <= 9; i++){
            Soma = Soma + parseInt(strCPF?.substring(i - 1, i)) * (11 - i);
        }
        Resto = (Soma * 10) % 11;

        if (Resto == 10 || Resto == 11) Resto = 0;
        if (Resto != parseInt(strCPF?.substring(9, 10))) return false;

        Soma = 0;
        for (let i = 1; i <= 10; i++){
          Soma = Soma + parseInt(strCPF?.substring(i - 1, i)) * (12 - i);
        }
        Resto = (Soma * 10) % 11;

        if (Resto == 10 || Resto == 11) Resto = 0;
        if (Resto != parseInt(strCPF?.substring(10, 11))) return false;
        return true;
    }
} 