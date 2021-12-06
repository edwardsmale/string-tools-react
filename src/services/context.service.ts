import { TextUtilsService } from './text-utils.service';
import { Context } from "../interfaces/Context";
import { ArrayService } from './array.service';

export class ContextService {

    constructor(private textUtilsService: TextUtilsService, private arrayService: ArrayService) {
        
        this.textUtilsService = textUtilsService;
        this.arrayService = arrayService;
    }

    UpdateContextDataTypes(context: Context, currentValues: (string | string[])[]) {

        const isIntegral = this.textUtilsService.IsIntegral;
        const isNumeric = this.textUtilsService.IsNumeric;

        if (!context.isArrayOfArrays) {

            const vals = currentValues as string[][];

            context.columnInfo.numberOfColumns = 1;
            context.columnInfo.isColumnIntegral = [vals.every(val => isIntegral(val[0]))];
            context.columnInfo.isColumnNumeric = [vals.every(val => isNumeric(val[0]))];
        }
        else {

            let numberOfColumns: number = 0;

            for (let i = 0; i < currentValues.length; i++) {

                if (currentValues[i].length > numberOfColumns) {

                    numberOfColumns = currentValues[i].length;
                }
            }
                
            let isColumnIntegral: boolean[] = [];
            let isColumnNumeric: boolean[] = [];

            for (let i = 0; i < numberOfColumns; i++) {

                isColumnIntegral[i] = true;
                isColumnNumeric[i] = true;
            }

            for (let i = 0; i < numberOfColumns; i++) {

                for (let j = 0; j < currentValues.length; j++) {

                    if (!isIntegral(currentValues[j][i])) {
                        isColumnIntegral[i] = false;
                    }

                    if (!isNumeric(currentValues[j][i])) {
                        isColumnNumeric[i] = false;
                    }
                }
            }

            context.columnInfo.numberOfColumns = numberOfColumns;
            context.columnInfo.isColumnIntegral = isColumnIntegral;
            context.columnInfo.isColumnNumeric = isColumnNumeric;
        }
    }

    CreateContext(): Context {

        return {
            regex: null,
            searchString: null,
            columnInfo: {
                numberOfColumns: 1,
                isColumnNumeric: null,
                isColumnIntegral: null,
                headers: null
            },
            withIndices: [0],
            isArrayOfArrays: false
        };
    }

    CloneContext(context: Context): Context {

        return {

            regex: context.regex,
            searchString: context.searchString,
            columnInfo: {...context.columnInfo },
            withIndices: [...context.withIndices],
            isArrayOfArrays: context.isArrayOfArrays
        };
    }
}