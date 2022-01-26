export class TextData {

    constructor(value: string | string[] | string[][] | null, dictionary: string[] | null = null) {

        this.maxWidth = 0;

        if (value === null) {

            this.isFlat = true;
            this.lines = [];
            this.lineCount = 0;
        }
        else if (value[0] && Array.isArray(value[0])) {

            this.isFlat = false;
            this.lines = value as string[][];            
            this.lineCount = 0;

            for (let i = 0; i < this.lines.length; i++) {

                this.lineCount += this.lines[i].length;

                for (let j = 0; j < this.lines[i].length; j++) {

                    if (this.lines[i][j].length > this.maxWidth) {

                        this.maxWidth = this.lines[i][j].length;
                    }
                }
            }
        }
        else if (Array.isArray(value)) {

            this.isFlat = true;

            const arr = value as string[];
            this.lines = arr.map(l => [l]);
            this.lineCount = arr.length;
            
            for (let i = 0; i < arr.length; i++) {

                if (arr[i].length > this.maxWidth) {

                    this.maxWidth = arr[i].length;
                }
            }
        }
        else {

            this.isFlat = true;

            const arr = value.split(/\r?\n/);
            this.lines = arr.map(l => [l]);
            this.lineCount = arr.length;
            
            for (let i = 0; i < arr.length; i++) {

                if (arr[i].length > this.maxWidth) {

                    this.maxWidth = arr[i].length;
                }
            }
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
    lineCount: number;
    maxWidth: number;
    dictionary: string[];
    isCompressed: boolean;
    isFlat: boolean;

    GetMaxLength = (values: string[]): number => {

        let max = 0;

        for (let i = 0; i < values.length; i++) {

            if (values[i].length > max) {

                max = values[i].length;
            }
        }

        return max;
    }
}