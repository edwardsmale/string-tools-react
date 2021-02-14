import { SortOrderIndex } from "../interfaces/SortOrderIndex";

export class TextUtilsService {

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

    ReplaceBackslashTWithTab = (value: string) => {
        return value.replace(/\\t/g, "\t");
    }

    CompareCaseInsensitive = (value1: string, value2: string) => {
        return value1.localeCompare(value2, 'en', { 'sensitivity': 'base' });
    }

    TextToLines = (value: string) => {

        value = value.replace(/\r\n/g, "\n");

        if (value.endsWith("\n")) {
            value = value.substring(0, value.length - 1);
        }

        return value.split(/\n/g);
    }

    LinesToText = (lines: string[]): string => {
        return lines.join("\r\n");
    }

    IsIntegral = (value: string) => {
        return /^-{0,1}\d+$/.test(value);
    }

    IsPositiveInteger = (value: string) => {
        return /^[1-9]\d*$/.test(value);
    }

    IsNumeric = (value: string) => {
        return /^-{0,1}\d+(\.\d+)?$/.test(value);
    }

    AsArray = (value: string | string[]): string[] => {
        if (Array.isArray(value)) {
            return (value as string[]);
        } else {
            return (value as string).split(/\s+/);
        }
    }

    AsScalar = (value: string | string[]): string => {
        if (Array.isArray(value)) {
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
            result = "the item at index " + index;
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

    FormatList = (values: any[]): string => {

        if (values.length === 0) {
            return "";
        }
        else if (values.length === 1) {
            return values[0];
        }
        else if (values.length === 2) {
            return values[0] + " and " + values[1];
        }
        else {
            let result: string = "";

            for (let i = 0; i < values.length - 1; i++) {

                result += values[i];

                if (values.length > 2) {
                    result += ",";
                }

                result += " ";
            }

            result += "and " + values[values.length - 1];

            return result;
        }
    };

    ParseSortOrderIndices = (para: string, headers: string[] | null) => {
        var split = para.trim().split(",");
        var result: SortOrderIndex[] = [];
        for (let i = 0; i < split.length; i++) {
            let val = split[i].trim().replace(new RegExp("ending", "i"), "").toLowerCase();
            let asc = !val.toLowerCase().endsWith("desc");
            let int = parseInt(split[i], 10);
            
            if (!isNaN(int)) {

                result.push({
                    index: int,
                    ascending: asc,
                    description: this.FormatIndex(int, asc)
                });
            } 
            else if (headers) {

                let match = /\$<(.*?)>/.exec(split[i]);

                if (match) {

                    let int = headers.indexOf(match[1]);

                    if (int) {

                        result.push({
                            index: int,
                            ascending: asc,
                            description: match[1] + (asc ? "" : " descending")
                        });
                    }
                }
            }
        }
        return result;
    };

    ReplaceHeaderReferences = (codeLine: string, headers: string[] | null, zeroBased: boolean, prefix: string) => {

        let result = codeLine;

        if (headers) {

            for (let i = 0; i < headers.length; i++) {

                const regex = new RegExp("\\$<" + headers[i] + ">", "g");
                const replacement = prefix + (zeroBased ? i : i + 1)

                result = result.replace(regex, replacement);
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

    FormatDelimiter = (delimiter: string, pluralise: boolean, isRegex: boolean) => {

        if (delimiter.indexOf(" ") !== -1) {
            return delimiter.replace(/ /gm, "▪");
        }
        else if (delimiter === "\t") {
            return "tab" + (pluralise ? "s" : "");
        }
        else if (delimiter === " ") {
            return "space" + (pluralise ? "s" : "");
        }
        else if (delimiter === ",") {
            return "comma" + (pluralise ? "s" : "");
        }
        else if (delimiter.length === 1) {
            return delimiter + " character" + (pluralise ? "s" : "");
        }
        else if (isRegex) {
            return "match of the regex /" + delimiter + "/";
        }
        else {
            return delimiter;
        }
    }
}