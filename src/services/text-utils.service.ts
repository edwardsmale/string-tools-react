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

        return split.map(function (val) { return parseInt(val.trim(), 10); })
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

    ContainsSortOrderIndices = (para: string, headers: string[] | null) => {
        return !!this.ParseSortOrderIndices(para, headers).length;
    };

    ParseSortOrderIndices = (para: string, headers: string[] | null) => {

        var split = para.trim().split(",");
        var result: SortOrderIndex[] = [];

        for (let i = 0; i < split.length; i++) {

            let val = split[i].trim();
            let asc = !val.toLowerCase().endsWith("desc") && !val.toLowerCase().endsWith("descending");

            if (!val) {
                continue;
            }
            
            val = val
                .replace(/\s+asc$/, "")
                .replace(/\s+ascending$/, "")
                .replace(/\s+descending$/, "")
                .replace(/\s+desc$/, "");

            let int = parseInt(split[i], 10);

            if (!isNaN(int)) {

                result.push({
                    index: int,
                    ascending: asc,
                    description: this.FormatIndex(int, asc)
                });
            } 
            else if (Array.isArray(headers) && headers.includes(val)) {

                result.push({
                    index: headers.indexOf(val),
                    ascending: asc,
                    description: val + (asc ? "" : " descending")
                });
            }
            else {
                result.push({
                    index: -1,
                    ascending: asc,
                    description: val + (asc ? "" : " descending")
                });
            }
        }

        return result;
    };

    GetHeadersOrderedByLength = (headers: string[]) => {

        return headers.map(function (header, index) { 

            return {
                header: header,
                index: index
            };
        }).sort(function (a, b) {

            return b.header.length - a.header.length;
        }).map(function (header) {

            return {
                header: header.header,
                index: header.index
            };
        });
    };

    ReplaceHeadersWithIndexes = (codeLine: string, headers: string[] | null) => {

        let result = codeLine;

        if (Array.isArray(headers)) {

            let headersOrderedByLength = this.GetHeadersOrderedByLength(headers);

            for (let i = 0; i < headersOrderedByLength.length; i++) {

                let header = headersOrderedByLength[i].header;
                let index = headersOrderedByLength[i].index;

                result = result.replace(
                    new RegExp(header, "g"), 
                    index.toString()
                );
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

    GetLeadingWhitespace = (value: string): string => {

        if (value.indexOf("Edward") !== -1) {
            debugger;
        }

        const leadingWhitespaceMatch = value.match(/^(\s+)/);

        if (leadingWhitespaceMatch) {

            return leadingWhitespaceMatch[1];
        }
        else {
            return "";
        }
    }

    GetTrailingWhitespace = (value: string): string => {

        const trailingWhitespaceMatch = value.match(/(\s+)$/);

        if (trailingWhitespaceMatch) {

            return trailingWhitespaceMatch[1];
        }
        else {
            return "";
        }
    }
}