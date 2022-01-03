export interface Val {
    s: string;
    i: number[];
}

export function Get(val: Val, index: number): string {

    if (val.i.length === 1 && index === 0) {
        return val.s;
    }
    else {

        index *= 2;

        if (index < val.i.length) {

            return val.s.substring(val.i[index], val.i[index + 1]);
        }
        else {

            return "Out of range";
        }
    }
};