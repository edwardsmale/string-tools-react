export class ArrayService {
    
    Batch(value: string[][], batchSize: number) : string[][] {

        let result: string[][] = [];

        let current: string[] = [];

        for (let j = 0; j < value.length; j++) {

            for (let k = 0; k < value[j].length; k++) {

                current.push(value[j][k]);

                if (current.length === batchSize) {

                    result.push(current);

                    current = [];
                }
            }
        }

        if (current.length) {

            result.push(current);
        }

        return result;
    }

    CreateRange = (startValue: number, endValueInclusive: number) => {

        let range: number[] = [];

        for (let i = startValue; i <= endValueInclusive; i++) {

            range.push(i);
        }

        return range;
    }

    ResolveNegativeIndices = (indices: number[], numberOfColumns: number) => {

        let result: number[] = [];

        for (let i = 0; i < indices.length; i++) {

            let x = indices[i];

            while (x < 0) {
                x += numberOfColumns;
            }

            result.push(x);
        }

        return result;
    }
}