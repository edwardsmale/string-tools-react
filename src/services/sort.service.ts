import { TextUtilsService } from './text-utils.service'
import { SortOrderIndex } from '../interfaces/SortOrderIndex';

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

    SortArrays = (values: string[][], indices: SortOrderIndex[]) => {

        if (indices.length === 0) {
            return values;
        }

        // In this method's parameters, negative indices signify
        // descending order.

        var index = indices[0].index;

        var valuesAtIndex: (string | number)[] = [];

        for (let i: number = 0; i < values.length; i++) {

            var value = values[i][index];

            if (!valuesAtIndex.includes(value)) {
                valuesAtIndex.push(value);
            }
        }

        let isNumeric = this.textUtilsService.IsNumeric;

        let numericValues = (valuesAtIndex as string[])
            .filter(function (value: string) { return isNumeric(value); })
            .map(function (value: string) { return parseFloat(value); })

        if (numericValues.length === valuesAtIndex.length) {

            numericValues = numericValues.sort(function(a, b) {
                return a - b;
            });

            valuesAtIndex = numericValues;
        }
        else {

            valuesAtIndex = valuesAtIndex.sort();
        }

        if (!indices[0].ascending) {
            valuesAtIndex = valuesAtIndex.reverse();
        }

        var arrayOfArrays: string[][][] = [];

        for (let i: number = 0; i < valuesAtIndex.length; i++) {
            arrayOfArrays[valuesAtIndex[i] as any] = [] as string[][];
        }

        for (let i: number = 0; i < valuesAtIndex.length; i++) {

            for (let j: number = 0; j < values.length; j++) {

                let match = false;
                
                if (values[j][index] === valuesAtIndex[i]) {
                    match = true;
                }
                else if (parseFloat(values[j][index]) === (valuesAtIndex[i] as number)) {
                    match = true;
                }

                if (match) {
                    arrayOfArrays[valuesAtIndex[i] as any].push(values[j]);
                }
            }
        }

        var newIndices = indices.slice(1);

        for (let i = 0; i < valuesAtIndex.length; i++) {

            arrayOfArrays[valuesAtIndex[i] as any] = this.SortArrays(
                arrayOfArrays[valuesAtIndex[i] as any], newIndices
            );
        }

        let newValues = [] as string[][];

        for (let i = 0; i < valuesAtIndex.length; i++) {
            for (let j = 0; j < arrayOfArrays[valuesAtIndex[i] as any].length; j++) {

                newValues.push(
                    arrayOfArrays[valuesAtIndex[i] as any][j]
                );
            }
        }

        return newValues;
    }
}