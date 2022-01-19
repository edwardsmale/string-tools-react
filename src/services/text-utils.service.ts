import { SortOrderIndex } from "../interfaces/SortOrderIndex";
import { TextRange } from "../interfaces/TextRange";
import { RegexService } from "./regex.service";
import { TextData } from "../interfaces/TextData";

export class TextUtilsService {

    constructor (private regexService: RegexService) {
    }

    // Global string replacement, which avoids:
    // - Using a regex, and having to escape certain characters
    // - Certain characters in the replacement string having special meanings.
    GlobalStringReplace = (value: string, find: string, replacement: string) => {
        return value.split(find).join(replacement);
    }
    
    // Global string replacement with a regex.
    GlobalRegexReplace = (value: string, regex: string, replacement: string) => {
        return value.replace(this.regexService.GetRegex(regex, "g"), replacement);
    }

    ReplaceBackslashTWithTab = (value: string) => {
        return value.replace(/\\t/g, "\t");
    }

    CompareCaseInsensitive = (value1: string, value2: string) => {
        return value1.localeCompare(value2, 'en', { 'sensitivity': 'base' });
    }

    ReplaceInLines = (lines: string[], find: string, replacement: string): string[] => {

        let result = [];

        for (let i = 0; i < lines.length; i++) {

            result.push(this.GlobalStringReplace(lines[i], find, replacement));
        }

        return result;
    }

    // Counts lines in an array of arrays.
    CountLines2 = (value: string[][]): number => {
  
      let lineCount = 0;
  
      for (let i = 0; i < value.length; i++) {
  
        lineCount += value[i].length;
      }
  
      return lineCount;
    }

    // Counts lines in an array of arrays.
    GetDataSize = (value: string[][]): number => {
  
      let charCount = 0;
  
      for (let i = 0; i < value.length; i++) {
  
        for (let j = 0; j < value[i].length; j++) {

            charCount += value[i][j].length;
        }
      }
  
      return charCount * 2;
    }

    private wordsRegex: RegExp = new RegExp("[\t \|,]+", "g");

    TextToWords = (value: string) => {
        return value.split(this.wordsRegex);
    }

    private linesRegex: RegExp = /\r?\n/;

    TextToLines = (value: string) => {
        return value.split(this.linesRegex);
    }

    LinesToText = (lines: string[]): string => {
        return lines.join("\n");
    }

    Split = (value: string, pattern: string) => {

        if (pattern.length === 1) {

            return this.SplitOnText(value, pattern);
        }
        else if (this.IsAlphaNumeric(pattern)) {

            return this.SplitOnText(value, pattern);
        }
        else {

            return value.split(this.regexService.GetRegex(pattern));
        }
    }

    SplitOnText = (value: string, text: string) => {

        return value.split(text);
    }

    IsAlphaNumeric = (value: string) => {

        let code, i, len;

        for (i = 0, len = value.length; i < len; i++) {

            code = value.charCodeAt(i);

            if (!(code > 47 && code < 58) && // numeric (0-9)
                !(code > 64 && code < 91) && // upper alpha (A-Z)
                !(code > 96 && code < 123)) { // lower alpha (a-z)
            
                return false;
            }
        }

        return true;
    }

    // charCode 48 to 57 are the digits 0 to 9.
    // charCode 45 is the minus sign.

    IsIntegral = (value: string) => {

        if (!value || value === "-") {
            return false;
        }

        let charCode = value.charCodeAt(0);

        if (charCode > 57 || (charCode < 48 && charCode !== 45)) {
            return false;
        }

        for (let i = 1; i < value.length; i++) {

            charCode = value.charCodeAt(i);

            if (charCode > 57 || charCode < 48) {
                return false;
            }
        }

        return true;
    }

    ParseInteger = (value: string) => {

        return this.IsIntegral(value) ? parseInt(value, 10) : null;
    }

    // charCode 48 to 57 are the digits 0 to 9.
    // charCode 45 is the minus sign.

    IsPositiveInteger = (value: string) => {

        if (!value) {
            return false;
        }
        
        let charCode = value.charCodeAt(0);

        if (charCode > 57 || charCode < 49) {
            return false;
        }

        for (let i = 1; i < value.length; i++) {

            charCode = value.charCodeAt(i);

            if (charCode > 57 || charCode < 48) {
                return false;
            }
        }

        return true;
    }

    ParsePositiveInteger = (value: string) => {

        return this.IsPositiveInteger(value) ? parseInt(value, 10) : null;
    }

    IsNumeric = (value: string) => {

        if (!value || value === "-" || value === ".") {
            return false;
        }

        let charCode = value.charCodeAt(0);

        if (charCode > 57 || (charCode < 48 && charCode !== 45 && charCode !== 46)) {
            return false;
        }

        let i = 1;

        while (i < value.length && charCode !== 46) {

            charCode = value.charCodeAt(i);

            if (charCode > 57 || (charCode < 48 && charCode !== 46)) {
                return false;
            }

            i++;
        }

        while (i < value.length && charCode !== 46) {

            charCode = value.charCodeAt(i);

            if (charCode > 57 || charCode < 48) {
                return false;
            }

            i++;
        }

        return true;        
    }

    IsNullOrWhitespace = (value: string) => {

        return !value || value.length === 0 || /^\s+$/.test(value);
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

        return split
            .map(function (val) { return parseInt(val.trim(), 10); })
            .filter(f => !isNaN(f));
    };

    ToOrdinal = (n: number): string => {
        let suffix = "th";

        if (n !== 11 && n !== 12 && n !== 13) {

            const mod = n % 10;

            if (mod === 1) {
                suffix = "st";
            }
            else if (mod === 2) {
                suffix = "nd";
            }
            else if (mod === 3) {
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

            if (!val) {
                continue;
            }

            let lower = val.toLowerCase();

            const descending = lower.endsWith("desc") || lower.endsWith("descending");

            lower = lower.replace(/ (a|de)sc(ending)?/, "");

            const int = parseInt(split[i], 10);

            if (!isNaN(int)) {

                result.push({
                    index: int,
                    descending: descending,
                    description: this.FormatIndex(int, descending)
                });
            } 
            else if (Array.isArray(headers) && headers.includes(lower)) {

                result.push({
                    index: headers.indexOf(val),
                    descending: descending,
                    description: lower + (descending ? "" : " descending")
                });
            }
            else {
                result.push({
                    index: -1,
                    descending: descending,
                    description: lower + (descending ? "" : " descending")
                });
            }
        }

        return result;
    };

    ParseSortOrderIsDescending(para: string) {

        const lower = para.toLowerCase();

        return lower.endsWith("desc") || lower.endsWith("descending");
    }

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

    private parseIndicesCache: any = {};

    ParseIndices = (para: string, headers: string[] | null): number[] => {

        const cacheKey = para + (headers && headers.join(","));

        const cachedEntry = this.parseIndicesCache[cacheKey];

        if (cachedEntry) {

            return cachedEntry;
        }

        let indices: number[] = [];

        const indexStrings = this.SplitOnText(para, ",");

        for (let i = 0; i < indexStrings.length; i++) {

            const index = parseInt(indexStrings[i], 10);

            if (!isNaN(index)) {

                indices.push(index);
            }
            else if (headers) {

                const headerIndex = headers.indexOf(indexStrings[i]);

                if (headerIndex !== -1) {

                    indices.push(headerIndex);
                }
            }
        }

        this.parseIndicesCache[cacheKey] = indices;

        return indices;
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

    RemoveLeading = (value: string, textToRemove: string): string => {

        if (value.startsWith(textToRemove)) {

            return value.substring(textToRemove.length);
        }
        else {
            return value;
        }
    }

    EnsureLeading = (value: string, textToEnsure: string): string => {

        if (!value.startsWith(textToEnsure)) {

            return textToEnsure + value;
        }
        else {
            return value;
        }
    }

    ReplaceLeading = (value: string, leadingText: string, replacement: string): string => {

        if (!value.startsWith(leadingText)) {

            return value;
        }
        else {
            return replacement + value.substring(leadingText.length);
        }
    }

    RemoveTrailing = (value: string, textToRemove: string): string => {

        if (value.endsWith(textToRemove)) {

            return value.substring(0, value.length - textToRemove.length);
        }
        else {
            return value;
        }
    }

    EnsureTrailing = (value: string, textToEnsure: string): string => {

        if (!value.endsWith(textToEnsure)) {

            return value + textToEnsure;
        }
        else {
            return value;
        }
    }

    ReplaceTrailing = (value: string, trailingText: string, replacement: string): string => {

        if (!value.endsWith(trailingText)) {

            return value;
        }
        else {
            return value.substring(0, value.length - trailingText.length) + replacement;
        }
    }

    CapitaliseFirstLetter = (value: string): string => {

        if (!value) {
            return value;
        }
        else {
            return value[0].toUpperCase() + value.slice(1);
        }
    }

    GenerateHash = (value: string): number => {

        let hash = 0;

        for (let i = 0; i < value.length; i++) {

            const char = value.charCodeAt(i);
            hash = ((hash<<5)-hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }

        return hash;
    }

    GenerateHashOfLines = (input: TextData): number => {

        let hash = 0;

        for (let l = 0; l < input.lines.length; l++) {

            for (let i = 0; i < input.lines[l][0].length; i++) {

                const char = input.lines[l][0].charCodeAt(i);
                hash = ((hash<<5)-hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }

            hash = ((hash<<5)-hash) + 10; // Newline
            hash = hash & hash; // Convert to 32bit integer
        }

        return hash;
    }

    GetSubText(input: TextData, textSelection: TextRange) : string {

    if (textSelection.startLine !== textSelection.stopLine) {

      let result = "";

      for (let lineIndex = 0; lineIndex < input.lines.length; lineIndex++) {
        
        const line = input.lines[lineIndex][0];

        if (lineIndex === textSelection.startLine) {

          result += line.substring(textSelection.startChar) + "\n";
        }
        else if (lineIndex > textSelection.startLine && lineIndex < textSelection.stopLine) {

          result += line + "\n";
        }
        else if (lineIndex === textSelection.stopLine) {

          result += line.substring(0, textSelection.stopChar + 1) + "\n";
        }
      }

      return result;
    }
    else {

      const line = input.lines[textSelection.startLine][0];

      return line.substring(textSelection.startChar, textSelection.stopChar + 1);
    }
  }

  RemoveSubText(input: TextData, textSelection: TextRange) : TextData {

    let result = "";

    if (textSelection.startLine !== textSelection.stopLine) {

      for (let lineIndex = 0; lineIndex < input.lines.length; lineIndex++) {
        
        const line = input.lines[lineIndex][0];

        if (lineIndex < textSelection.startLine || lineIndex > textSelection.stopLine) {

          result += line + "\n";
        }
        else if (lineIndex === textSelection.startLine) {

          result += line.substring(0, textSelection.startChar);
        }
        else if (lineIndex === textSelection.stopLine) {

          result += line.substring(textSelection.stopChar + 1) + "\n";
        }
      }
    }
    else {

      for (let lineIndex = 0; lineIndex < input.lines.length; lineIndex++) {
        
        const line = input.lines[lineIndex][0];

        if (lineIndex === textSelection.startLine) {

          result += line.substring(0, textSelection.startChar) + line.substring(textSelection.stopChar + 1) + "\n";
        }
        else {

          result += line + "\n";
        }
      }
    }

    return new TextData(result);
  }

  InsertSubText(input: TextData, charIndex: number, lineIndex: number, textToInsert : string) : TextData {

    let result = "";
    
    if (input.lines.length === 0) {

        result = textToInsert;
    }
    else {

        for (let i = 0; i < input.lines.length; i++) {
        
            const line = input.lines[i][0];

            if (i === lineIndex) {

                result += line.substring(0, charIndex) + textToInsert + line.substring(charIndex) + "\n";
            }
            else {

                result += line + "\n";
            }
        }
    }

    return new TextData(result);
  }
}