export class ArrayService {

    FlattenIfNecessary(value: (string | string[])[]): string[] {

        if (Array.isArray(value[0])) {

            return this.Flatten(value as string[][]) ;
        }
        else {

            return value as string[];
        }
    }
    
    Flatten(value: string[][]) : string[] {

        let result: string[] = [];

        for (let j = 0; j < value.length; j++) {

            for (let k = 0; k < value[j].length; k++) {

                result.push(value[j][k]);
            }
        }

        return result;
    }

    UnflattenIfNecessary(value: (string | string[])[]): string[][] {

        if (!Array.isArray(value[0])) {

            return this.Unflatten(value as string[]) ;
        }
        else {
            
            return value as string[][];
        }
    }

    Unflatten = (value: string[]): string[][] => {

        let result: string[][] = [];

        for (let i = 0; i < value.length; i++) {

            result.push([value[i]]);
        }

        return result;
    }

    IsNullOrEmptyArray = (value: string | string[] | null): boolean => {

        return value === null || this.IsEmptyArray(value);
    }

    IsEmptyArray = (value: string | string[]): boolean => {

        return Array.isArray(value) && (value as string[]).length === 0;
    }
}