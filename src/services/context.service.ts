import { TextUtilsService } from './text-utils.service';
import { Context } from "../interfaces/Context";

export class ContextService {

    constructor(private textUtilsService: TextUtilsService) {
        this.textUtilsService = textUtilsService;
    }

    UpdateContextDataTypes(context: Context, currentValues: (string | string[])[]) {

        const isIntegral = this.textUtilsService.IsIntegral;
        const isNumeric = this.textUtilsService.IsNumeric;

        if (!context.isArrayOfArrays) {

            let vals = currentValues as string[][];

            context.newColumnInfo.numberOfColumns = 1;
            context.newColumnInfo.isColumnIntegral = [vals.every(val => isIntegral(val[0]))];
            context.newColumnInfo.isColumnNumeric = [vals.every(val => isNumeric(val[0]))];
        }
        else {

            let numberOfColumns: number;

            numberOfColumns = 0;

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

            debugger;

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

            context.newColumnInfo.numberOfColumns = numberOfColumns;
            context.newColumnInfo.isColumnIntegral = isColumnIntegral;
            context.newColumnInfo.isColumnNumeric = isColumnNumeric;
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
            newColumnInfo: {
                numberOfColumns: 1,
                isColumnNumeric: null,
                isColumnIntegral: null,
                headers: null
            },
            withIndices: null,
            isArrayOfArrays: false
        };
    }

    CloneContext(context: Context): Context {

        return {

            regex: context.regex,
            searchString: context.searchString,
            columnInfo: {...context.columnInfo },
            newColumnInfo: {...context.newColumnInfo },
            withIndices: context.withIndices ? [...context.withIndices] : null,
            isArrayOfArrays: context.isArrayOfArrays
        };
    }
}