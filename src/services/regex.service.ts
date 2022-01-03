export class RegexService {
    
    private regexes: any = {};

    GetRegex(regex: string): RegExp {

        const existing = this.regexes[regex];

        if (existing) {

            return existing;
        }
        else {

            const re = new RegExp(regex);

            this.regexes[regex] = re;

            return re;
        }
    }
}