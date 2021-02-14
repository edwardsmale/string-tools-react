import { TextUtilsService } from './text-utils.service';
import { Context } from "../interfaces/Context";

export class ContextService {

    constructor(private textUtilsService: TextUtilsService) {
        this.textUtilsService = textUtilsService;
    }

    UpdateContextDataTypes(context: Context, currentValues: string[][]) {

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

        for (let i = 0; i < numberOfColumns; i++) {

            for (let j = 0; j < currentValues.length; j++) {

                if (!this.textUtilsService.IsIntegral(currentValues[j][i])) {
                    isColumnIntegral[i] = false;
                }

                if (!this.textUtilsService.IsNumeric(currentValues[j][i])) {
                    isColumnNumeric[i] = false;
                }
            }
        }

        context.isColumnIntegral = isColumnIntegral;
        context.isColumnNumeric = isColumnNumeric;
    }
}