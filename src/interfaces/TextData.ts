export class TextData {

    constructor(value: string | string[] | string[][] | null, dictionary: string[] | null = null) {

        if (value === null) {
            this.lines = [];
            this.flat = [];
            this.isFlat = true;
        }
        else if (value[0] && Array.isArray(value[0])) {
            this.lines = value as string[][];
            this.flat = this.lines.flat();
            this.isFlat = false;
        }
        else if (Array.isArray(value)) {
            this.lines = (value as string[]).map(l => [l]);
            this.flat = value as string[];
            this.isFlat = false;
        }
        else {
            this.lines = (value.split(/\r?\n/)).map(l => [l]);
            this.flat = this.lines.flat();
            this.isFlat = false;
        }

        if (dictionary) {

            this.dictionary = dictionary;
            this.isCompressed = true;
        }
        else {

            this.dictionary = [];
            this.isCompressed = false;
        }
    }

    lines: string[][];
    flat: string[];
    dictionary: string[];
    isCompressed: boolean;
    isFlat: boolean;
}