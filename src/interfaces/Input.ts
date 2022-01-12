export class Input {

    constructor(value: string | string[] | string[][] | null) {

        if (value === null) {
            this.lines = [];
        }
        else if (value[0] && Array.isArray(value[0])) {
            this.lines = value as string[][];
        }
        else if (Array.isArray(value)) {
            this.lines = (value as string[]).map(l => [l]);
        }
        else {
            this.lines = (value.split(/\r?\n/)).map(l => [l]);
        }
    }

    lines: string[][];
}