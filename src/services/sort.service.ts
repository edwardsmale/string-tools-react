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

    /**
     * Warning: this mutates the original array.
     */
    SortArray = (values: string[][], descending: boolean): string[][] => {

        if (!values.length) {

            return values;
        }

        values.sort();

        // If the last item is numeric, then all the values must be numeric (because
        // numbers come before letters in ASCII).

        let isNumericData = this.textUtilsService.IsNumeric(values[values.length - 1][0]);

        // If the first item begins with a zero, don't treat as numeric, otherwise
        // we'll be stripping off the leading zeroes.  In many cases, a leading
        // zero indicates the data will sort properly via an alphabetic sort anyway.

        isNumericData = isNumericData && values[0][0][0] !== "0";

        if (!isNumericData) {

            if (descending) {

                values.reverse();
            }

            return values;
        }

        // Sort numerically.
        
        const numbers = values.map(v => v[0]).map(parseFloat);

        if (descending) {

            return numbers
                .sort(function(a, b) { return b - a; })
                .map(function (num) { return [num.toString()]; });
        }
        else {
            
            return numbers
                .sort(function(a, b) { return a - b; })
                .map(function (num) { return [num.toString()]; });
        }
    }

    /**
     * Warning: this mutates the original array.
     */
    SortArrayOfArrays = (values: string[][], indices: SortOrderIndex[], context: Context) => {

        if (!values.length) {

            return values;
        }

        // Negative indices signify descending order.

        var sortFunc = function(a: string[], b: string[], ind: SortOrderIndex[]): number {

            const index = ind[0].index;

            const ret = ind[0].descending ? -1 : 1;

            if (index >= a.length && index >= b.length) {
                return 0;
            }
            else if (index >= a.length) {
                return -ret; 
            }
            else if (index >= b.length) {
                return ret;
            }
            else {
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
            }
        };

        return values.sort(function (a, b) { return sortFunc(a, b, indices); });
    }
}