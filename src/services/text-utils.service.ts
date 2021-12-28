import { SortOrderIndex } from "../interfaces/SortOrderIndex";
import { TextRange } from "../interfaces/TextRange";

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
  
        for (let j = 0; j < value[i].length; j++) {
  
            lineCount++;
        }
      }
  
      return lineCount;
    }

    TextToLines = (value: string) => {
        return this.GlobalStringReplace(value, "\r", "").split("\n");
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

            return value.split(new RegExp(pattern));
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

    ReplaceHeadersWithIndexes = (codeLine: string, headers: string[] | null) => {

        const indexStrings = this.SplitOnText(codeLine, ",");

        let indices: string[] = [];
        
        if (headers) {

            for (let i = 0; i < indexStrings.length; i++) {

                if (headers.includes(indexStrings[i])) {

                    for (let j = 0; j < headers.length; j++) {

                        if (headers[j] === indexStrings[i]) {

                            indices.push(j.toString());
                        }
                    }
                }
                else {

                    indices.push(indexStrings[i]);
                }
            }
        }

        return indices.join(",");
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

    GetSubText(lines: string[], textSelection: TextRange) : string {

    if (textSelection.startLine !== textSelection.stopLine) {

      let result = "";

      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        
        const line = lines[lineIndex];

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

      const line = lines[textSelection.startLine];

      return line.substring(textSelection.startChar, textSelection.stopChar + 1);
    }
  }

  RemoveSubText(lines: string[], textSelection: TextRange) : string[] {

    let result = "";

    if (textSelection.startLine !== textSelection.stopLine) {

      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        
        const line = lines[lineIndex];

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

      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        
        const line = lines[lineIndex];

        if (lineIndex === textSelection.startLine) {

          result += line.substring(0, textSelection.startChar) + line.substring(textSelection.stopChar + 1) + "\n";
        }
        else {

          result += line + "\n";
        }
      }
    }

    return this.TextToLines(result);
  }

  InsertSubText(lines: string[], charIndex: number, lineIndex: number, textToInsert : string) : string[] {

    let result = "";
    
    if (lines.length === 0) {

        result = textToInsert;
    }
    else {

        for (let i = 0; i < lines.length; i++) {
        
            const line = lines[i];

            if (i === lineIndex) {

                result += line.substring(0, charIndex) + textToInsert + line.substring(charIndex) + "\n";
            }
            else {

                result += line + "\n";
            }
        }
    }

    return this.TextToLines(result);
  }
}