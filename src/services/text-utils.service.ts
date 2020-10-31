import { isArray } from "util";
import { SortOrderIndices } from "../interfaces/SortOrderIndices";

export class TextUtilsService {

    constructor() { }

    // Global string replacement, which avoids:
    // - Using a regex, and having to escape certain characters
    // - Certain characters in the replacement string having special meanings.
    GlobalStringReplace = (value: string, find: string, replacement: string) => {
        return value.split(find).join(replacement);
    }

    // Global string replacement with a regex.
    GlobalRegexReplace = (value: string, regex: string, replacement: string) => {
        return value.replace(new RegExp(regex, "g"), replacement);
    }

    CompareCaseInsensitive = (value1: string, value2: string) => {
        return value1.localeCompare(value2, 'en', { 'sensitivity': 'base' });
    }

    LinesToText = (lines: string[]): string => {
        return lines.join("\r\n");
    }

    TextToLines = (text: string): string[] => {
        return text.split(/\n/);
    }

    IsNumeric = (value: string) => {
        return /^-{0,1}\d+$/.test(value);
    }

    IsPositiveInteger = (value: string) => {
        return /^[1-9]\d*$/.test(value);
    }

    AsArray = (value: string | string[]): string[] => {
        if (isArray(value)) {
            return (value as string[]);
        } else {
            return (value as string).split(/\s+/);
        }
    }

    AsScalar = (value: string | string[]): string => {
        if (isArray(value)) {
            return (value as string[])[0];
        } else {
            return (value as string);
        }
    }

    ParseIntegers = (para: string): number[] => {
        var split = para.trim().split(",");
        var integers = [];
        for (let i = 0; i < split.length; i++) {
            let int = parseInt(split[i], 10);
            if (!isNaN(int)) {
                integers.push(int);
            }
        }
        return integers;
    };

    ToOrdinal = (n: number): string => {
        let suffix = "th";

        if (n !== 11 && n !== 12 && n !== 13) {
            if (n % 10 === 1) {
                suffix = "st";
            }
            else if (n % 10 === 2) {
                suffix = "nd";
            }
            else if (n % 10 === 3) {
                suffix = "rd";
            }
        }

        return n + suffix;
    };

    FormatIndex = (index: number, ascending: boolean): string => {
        let result: string;

        if (index >= 0) {
            result = "index " + index;
        } else if (index === -1) {
            result = "the last item";
        } else {
            result = "the " + this.ToOrdinal(Math.abs(index)) + " last item";
        }

        if (ascending === undefined) {
            return result;
        } else {
            return result + (ascending ? "" : " descending");
        }
    };

    ParseSortOrderIndices = (para: string) => {
        var split = para.trim().split(",");
        var result: SortOrderIndices[] = [];
        for (let i = 0; i < split.length; i++) {
            let val = split[i].trim().replace(new RegExp("ending", "i"), "").toLowerCase();
            let asc = !val.includes("d");
            let int = parseInt(split[i], 10);
            if (!isNaN(int)) {

                result.push({
                    index: int,
                    ascending: asc,
                    description: this.FormatIndex(int, asc)
                });
            }
        }
        return result;
    };

    IsTabDelimited = (lines: string[]) => {

        var countTabs = (line: string) => {
            return (line.match(/\t/g) || []).length;
        };

        var tabsPerLine = countTabs(lines[0]);

        if (tabsPerLine === 0) {
            return false;
        }
        for (let i = 0; i < lines.length; i++) {
            if (countTabs(lines[i]) !== tabsPerLine) {
                return false;
            }
        }
        return true;
    };

    FormatDelimiter = (delimiter: string, pluralise: boolean) => {

        var formatDelimiterSingular = (delimiter: string) => {
            if (delimiter === "\t") {
                return "tab";
            }
            else if (delimiter === " ") {
                return "space";
            }
            else if (delimiter === ",") {
                return "comma";
            }
            else if (delimiter.length === 1) {
                return delimiter + " character";
            }
            else {
                return "match of the regex " + delimiter;
            }
        };

        var formattedDelimiter = formatDelimiterSingular(delimiter);

        return pluralise ? formattedDelimiter + "s" : formattedDelimiter;
    }
}