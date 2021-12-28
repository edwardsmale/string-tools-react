import { TextUtilsService } from './text-utils.service'
import { SortOrderIndex } from '../interfaces/SortOrderIndex';
import { Context } from '../interfaces/Context';

export class SortService {

    constructor(private textUtilsService: TextUtilsService) {
        this.textUtilsService = textUtilsService;
    }

    SortLines = (values: string[]) => {
        var _this = this;
        return values.sort(function (a, b) {
            return _this.textUtilsService.CompareCaseInsensitive(a, b);
        });
    }

    SortArray = (values: string[][], descending: boolean): string[][] => {

        let sortedValues = [...values].sort();

        // If the last item is numeric, then all the values must be numeric (because
        // numbers come before letters in ASCII).

        let isNumericData = this.textUtilsService.IsNumeric(sortedValues[sortedValues.length - 1][0]);

        // If the first item begins with a zero, don't treat as numeric, otherwise
        // we'll be stripping off the leading zeroes.  In many cases, a leading
        // zero indicates the data will sort properly via an alphabetic sort anyway.

        isNumericData = isNumericData && sortedValues[0][0][0] !== "0";

        if (!isNumericData) {

            if (descending) {

                sortedValues = sortedValues.reverse();
            }

            return sortedValues;
        }

        // Sort numerically.
        
        const numbers = (values.map(v => v[0]) as string[]).map(parseFloat);

        if (descending) {

            return numbers
                .sort(function(a, b) { return b - a; })
                .map(function (num) { return num.toString(); })
                .map(n => [n]);
        }
        else {
            
            return numbers
                .sort(function(a, b) { return a - b; })
                .map(function (num) { return num.toString(); })
                .map(n => [n]);
        }
    }

    SortArrayOfArrays = (values: string[][], indices: SortOrderIndex[], context: Context) => {

        // Negative indices signify descending order.

        var sortFunc = function(a: string[], b: string[], ind: SortOrderIndex[]): number {

            const index = ind[0].index;

            const ret = ind[0].descending ? -1 : 1;
            const cmp = a[index].localeCompare(b[index]);
            
            if (cmp < 0) {
                return -ret;
            }
            else if (cmp > 0) {
                return ret;
            }
            else if (ind.length > 1) {
                return sortFunc(a, b, ind.slice(1));
            }
            else {
                return 0;
            }
        };

        return values.sort(function (a, b) { return sortFunc(a, b, indices); });

        // var valuesAtIndex: (string | number)[] = [];

        // for (let i: number = 0; i < values.length; i++) {

        //     var value = values[i][index];

        //     if (!valuesAtIndex.includes(value)) {
        //         valuesAtIndex.push(value);
        //     }
        // }

        // if (context.columnInfo && 
        //     context.columnInfo.isColumnNumeric && 
        //     context.columnInfo.isColumnNumeric[index]) {

        //     valuesAtIndex = (valuesAtIndex as string[]).map(function (val) { return parseFloat(val); });
        //     valuesAtIndex = (valuesAtIndex as number[]).sort(function(a, b) { return a - b; });
        // }
        // else {

        //     valuesAtIndex = valuesAtIndex.sort();
        // }

        // if (indices[0].descending) {
        //     valuesAtIndex = valuesAtIndex.reverse();
        // }

        // var arrayOfArrays: string[][][] = [];

        // for (let i: number = 0; i < valuesAtIndex.length; i++) {

        //     arrayOfArrays[valuesAtIndex[i] as any] = [] as string[][];
        // }

        // for (let i: number = 0; i < valuesAtIndex.length; i++) {

        //     for (let j: number = 0; j < values.length; j++) {

        //         let match = false;

        //         if (values[j][index] === valuesAtIndex[i]) {
        //             match = true;
        //         }
        //         else if (parseFloat(values[j][index]) === (valuesAtIndex[i] as number)) {
        //             match = true;
        //         }

        //         if (match) {
        //             arrayOfArrays[valuesAtIndex[i] as any].push(values[j]);
        //         }
        //     }
        // }

        // var newIndices = indices.slice(1);

        // for (let i = 0; i < valuesAtIndex.length; i++) {

        //     arrayOfArrays[valuesAtIndex[i] as any] = this.SortArrays(
        //         arrayOfArrays[valuesAtIndex[i] as any],
        //         newIndices,
        //         context
        //     );
        // }

        // let newValues = [] as string[][];

        // for (let i = 0; i < valuesAtIndex.length; i++) {
        //     for (let j = 0; j < arrayOfArrays[valuesAtIndex[i] as any].length; j++) {

        //         newValues.push(
        //             arrayOfArrays[valuesAtIndex[i] as any][j]
        //         );
        //     }
        // }

        // return newValues;
    }
}