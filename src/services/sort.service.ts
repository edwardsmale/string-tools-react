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

        var valuesAtIndex: string[] = [];

        for (let i: number = 0; i < values.length; i++) {

            var value = values[i][index];

            if (!valuesAtIndex.includes(value)) {
                valuesAtIndex.push(value);
            }
        }

        valuesAtIndex = valuesAtIndex.sort();

        if (!indices[0].ascending) {
            valuesAtIndex = valuesAtIndex.reverse();
        }

        var arrayOfArrays: string[][][] = [];

        for (let i: number = 0; i < valuesAtIndex.length; i++) {
            arrayOfArrays[valuesAtIndex[i] as any] = [] as string[][];
        }

        for (let i: number = 0; i < valuesAtIndex.length; i++) {

            for (let j: number = 0; j < values.length; j++) {

                if (values[j][index] === valuesAtIndex[i]) {
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