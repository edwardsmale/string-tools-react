export class RegexService {
    
    private regexes: any = {};

    GetRegex(regex: string, flags?: string): RegExp {

        if (!this.IsValidRegex(regex)) {
            return /$^/; // matches nothing
        }

        const existing = this.regexes[regex];

        if (existing) {

            return existing;
        }
        else {

            const re = new RegExp(regex, flags);

            this.regexes[regex] = re;

            return re;
        }
    }

    IsValidRegex(regex: string): boolean {
       
        try {
            const re = new RegExp(regex);
            return true;
        }
        catch {
            return false;
        } 
    }
}