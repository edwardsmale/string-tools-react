import { TextUtilsService } from './text-utils.service';
import { SortService } from './sort.service';
import { CommandType, CommandParameter, SortCommandType } from "../interfaces/CommandInterfaces";
import { Context } from "../interfaces/Context";
import { ContextService } from './context.service';
import { CamelCommand } from './commands/camel-command';
import { PascalCommand } from './commands/pascal-command';
import { KebabCommand } from './commands/kebab-command';

export class CommandTypesService {

    constructor(private textUtilsService: TextUtilsService, private sortService: SortService, private contextService: ContextService, private camelCommand: CamelCommand, private pascalCommand: PascalCommand, private kebabCommand: KebabCommand) {
        this.textUtilsService = textUtilsService;
        this.contextService = contextService;
        this.sortService = sortService;
        this.camelCommand = camelCommand;
        this.pascalCommand = pascalCommand;
        this.kebabCommand = kebabCommand;
    }

    FindCommandType = (name: string): CommandType | SortCommandType =>  {

        for (let i = 0; i < this.CommandTypes.length; i++) {

            if (this.CommandTypes[i].name === name) {

                return this.CommandTypes[i];
            }
        }

        return this.FindCommandType("noop");
    };

    CommandTypes: (CommandType | SortCommandType)[] = [
        {
            name: "noop",
            desc: "Does nothing",
            para: [] as CommandParameter[],
            isArrayBased: false,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                if (explain) {
                    return { explanation: "" };
                } else {
                    return value;
                }
            })
        },
        {
            name: "regex",
            desc: "Sets the current regex",
            para: [
                {
                    name: "Regex",
                    desc: "String defining the regex"
                }
            ],
            isArrayBased: false,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                context.regex = para;
                context.searchString = null;
                if (explain) {
                    return { explanation: "Sets the current regex to /" + para + "/" };
                } else {
                    return value;
                }
            })
        },
        {
            name: "search",
            desc: "Sets the current search string",
            para: [
                {
                    name: "Search String",
                    desc: "The search string to set"
                }
            ],
            isArrayBased: false,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                context.searchString = para;
                context.regex = null;
                if (explain) {
                    return { explanation: "Sets the current search string to '" + para + "'"};
                } else {
                    return value;
                }
            })
        },
        {
            name: "replace",
            desc: "Replaces text that matches the current regex or search string",
            para: [
                {
                    name: "Replacement text",
                    desc: "The text to replace the matching text with"
                }
            ],
            isArrayBased: false,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                
                para = this.textUtilsService.ReplaceBackslashTWithTab(para);

                if (explain) {
                    if (context.regex) {
                        return { explanation: "Replaces text matching the regex /" + context.regex + "/ with '" + para + "'" };
                    } else if (context.searchString) {
                        return { explanation: "Replaces '" + context.searchString + "' with '" + para + "'" };
                    } else {
                        return { explanation: "*** This command only works if a regex or search string has been set by an earlier 'regex' or 'search' instruction." };
                    }
                } else {
                    if (Array.isArray(value)) {
                        let newValue: string[] = [];

                        for (let i = 0; i < (value as string[]).length; i++) {
                            if (context.regex) {
                                newValue.push(this.textUtilsService.GlobalRegexReplace(value[i], context.regex, para));
                            } else if (context.searchString) {
                                newValue.push(this.textUtilsService.GlobalStringReplace(value[i], context.searchString, para));
                            } else {
                                newValue.push(value[i]);
                            }
                        }
                        return newValue;
                    } else {
                        if (context.regex) {
                            return this.textUtilsService.GlobalRegexReplace(value as string, context.regex, para);
                        } else if (context.searchString) {
                            return this.textUtilsService.GlobalStringReplace(value as string, context.searchString, para);
                        } else {
                            return value;
                        }
                    }
                }
            })
        },
        {
            name: "split",
            desc: "Splits up text.",
            para: [
                {
                    name: "Separator",
                    desc: "The string upon which to split."
                }
            ],
            isArrayBased: false,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                value = this.textUtilsService.AsScalar(value);

                if (!para && context.regex) {
                    if (explain) {
                        return { explanation: "Split the text using the regex /" + context.regex + "/" };
                    } else {
                        return (value as string).split(new RegExp(context.regex));
                    }
                }
                else if (!para && context.searchString) {
                    if (explain) {
                        return { explanation: "Split the text on '" + context.searchString + "'" };
                    } else {
                        return (value as string).split(context.searchString);
                    }
                }
                else {
                    var defaultDelimiter = ",";
                    para = para === "\\t" ? "\t" : para;
                    var delimiter = para || defaultDelimiter;

                    if (explain) {
                        var formattedDelimiter = this.textUtilsService.FormatDelimiter(delimiter, false, true);
                        return { explanation: "Split the text on every " + formattedDelimiter };
                    } else {

                        if (delimiter.length === 1 && "|^$*()\\/[].+".includes(delimiter)) {
                            delimiter = "\\" + delimiter;
                        }

                        var splitValues = (value as string).split(new RegExp(delimiter));

                        return splitValues;
                    }
                }
            })
        },
        {
            name: "sort",
            desc: "Sorts the items",
            para: [
                {
                    name: "index",
                    desc: "Index(es) of column to sort on"
                }
            ],
            isArrayBased: false,
            exec: ((value: (string | string[])[], para: string, negated: boolean, context: Context, explain: boolean) => {

                let indices = this.textUtilsService.ParseSortOrderIndices(para, context.columnInfo.headers);

                let descending = para.toLowerCase().indexOf("desc") !== -1;

                if (!indices.length) {
                    if (explain) {
                        if (descending) {
                            return { explanation: "Sort the items in descending order" };
                        }
                        else {
                            return { explanation: "Sort the items" };
                        }
                    } else {
                        let sortedValues : string[];

                        if (value.length === 1 && Array.isArray(value[0])) {
                            sortedValues = this.sortService.SortArray(value[0] as string[]);
                        } else {
                            sortedValues = this.sortService.SortArray(value as string[]);
                        }

                        if (descending) {
                            sortedValues = sortedValues.reverse();
                        }

                        return [sortedValues];
                    }
                } else {
                    
                    if (explain) {
                        let positions: string[] = [];

                        for (let i = 0; i < indices.length; i++) {

                            positions.push(indices[i].description);
                        }
                        return { explanation: "Sort by " + positions.join(", then by ") };
                    } else if (!para) {
                        return this.sortService.SortLines(value as string[]);
                    } else {

                        // Negative indexes count back from the end.
                        for (let i = 0; i < indices.length; i++) {

                            if (indices[i].index < 0) {
                                indices[i].index += value[0].length;
                            }
                        }

                        return this.sortService.SortArrays(
                            value as string[][], 
                            indices,
                            context
                        );
                    }
                }
            })
        },
        {   
            name: "distinct",
            desc: "Deletes any duplicate items",
            para: [],
            isArrayBased: true,
            exec: ((value: (string | string[])[], para: string, negated: boolean, context: Context, explain: boolean) => {
                if (explain) {
                    return { explanation: "Delete duplicates" };
                }
                else {
                
                    let input = value as string[];
                    let result: string[] = [];

                    for (let i = 0; i < input.length; i++) {

                        if (!result.includes(input[i])) {
                            result.push(input[i]);
                        }
                    }

                    return [result];
                }
            })
        },
        {
            name: "skip",
            desc: "Skips the first N items",
            para: [
                {
                    name: "N",
                    desc: "How many items to skip"
                }
            ],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                var n = parseInt(para, 10);
                if (explain) {
                    if (isNaN(n)) {
                        return { explanation: "Skip n items" };
                    } else {
                        return { explanation: "Skip " + n + " item" + (n === 1 ? "" : "s") };
                    }
                } else {
                    if (isNaN(n)) {
                        return value;
                    }
                    else {
                        if (n >= 0) {
                            return (value as string[]).slice(n);
                        } else {
                            return (value as string[]).slice(0, -n);
                        }
                    }
                }
            })
        },
        {
            name: "header",
            desc: "Treats the first array of items as a header row",
            para: [ ],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                
                if (!context.columnInfo.headers) {
                    context.columnInfo.headers = (value as string[]);
                }

                if (explain) {

                    return { explanation: "Treat the first array of items as a header row" };
                } else {

                    return (value as string[]);
                } 
            })
        },
        {
            name: "take",
            desc: "Takes the first N items and ignores the rest",
            para: [
                {
                    name: "N",
                    desc: "How many items to take"
                }
            ],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                var n = parseInt(para, 10);
                if (explain) {
                    if (isNaN(n)) {
                        return { explanation: "Take the first n items and ignore the rest" };
                    } else {
                        return { explanation: "Take the first " + n + " item" + (n === 1 ? "" : "s") + " only" };
                    }
                } else {
                    if (isNaN(n)) {
                        return value;
                    }
                    else {
                        if (n >= 0) {
                            return (value as string[]).slice(0, n);
                        } else {
                            return (value as string[]).slice(-n);
                        }
                    }
                }
            })
        },
        {
            name: "camel",
            desc: "Camel-cases the item(s)",
            para: [] as CommandParameter[],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.camelCommand.Explain();

                } else if (Array.isArray(value)) {

                    return this.camelCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {
                    return this.camelCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "pascal",
            desc: "Pascal-cases the item(s)",
            para: [] as CommandParameter[],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.pascalCommand.Explain();

                } else if (Array.isArray(value)) {

                    return this.pascalCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {
                    return this.pascalCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "kebab",
            desc: "Kebab-cases the item(s)",
            para: [] as CommandParameter[],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.kebabCommand.Explain();

                } else if (Array.isArray(value)) {

                    return this.kebabCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {
                    return this.kebabCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "with",
            desc: "Selects which parts of the results to operate on",
            para: [] as CommandParameter[],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                para = this.textUtilsService.ReplaceHeadersWithIndexes(para, context.columnInfo.headers);

                const indices = this.textUtilsService.ParseIntegers(para);

                if (explain) {
                    if (indices.some((i) => isNaN(i))) {

                        return { explanation: "With the specified columns" };
                    }
                    else if (indices.some((i) => i < 0)) {

                        let formattedIndices: string[] = [];

                        for (let i = 0; i < indices.length; i++) {

                            var formattedIndex = this.textUtilsService.FormatIndex(indices[i], true);

                            formattedIndices.push(formattedIndex);
                        }

                        let positions = this.textUtilsService.FormatList(formattedIndices);

                        return { explanation: "With the columns " + positions };
                    }
                    else {

                        let positions = this.textUtilsService.FormatList(indices);

                        if (indices.length > 1) {

                            return { explanation: "With the items at indexes " + positions };
                        }
                        else {
                            return { explanation: "With the items at index " + positions };
                        }
                    }
                } else {

                    return value;
                }
            })
        },
        {
            name: "select",
            desc: "Returns values at selected indices.",
            para: [
                {
                    name: "Column Indices",
                    desc: "Zero-based. Negatives count back from the end."
                }
            ],
            isArrayBased: true,
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                para = this.textUtilsService.ReplaceHeadersWithIndexes(para, context.columnInfo.headers);

                const indices = this.textUtilsService.ParseIntegers(para);

                if (explain) {

                    if (indices.some((i) => isNaN(i))) {

                        return { explanation: "Get the specified columns" };
                    }
                    else if (indices.some((i) => i < 0)) {

                        let formattedIndices: string[] = [];

                        for (let i = 0; i < indices.length; i++) {

                            var formattedIndex = this.textUtilsService.FormatIndex(indices[i], true);

                            formattedIndices.push(formattedIndex);
                        }

                        let positions = this.textUtilsService.FormatList(formattedIndices);

                        return { explanation: "Get " + positions };
                    }
                    else {

                        let positions = this.textUtilsService.FormatList(indices);

                        if (indices.length > 1) {

                            return { explanation: "Get the items at indexes " + positions };
                        }
                        else {
                            return { explanation: "Get the items at index " + positions };
                        }
                    }
                } else {

                    let result: string[] = [];

                    context.newColumnInfo.headers = [];
                    context.newColumnInfo.numberOfColumns = 0;

                    for (let i = 0; i < indices.length; i++) {

                        var index = indices[i];

                        if (index < 0) {
                            index += value.length;
                        }

                        if (index >= 0 && index < value.length) {
                            result.push(value[index]);

                            if (context.columnInfo.headers) {
                                context.newColumnInfo.headers.push(context.columnInfo.headers[index]);
                            }

                            context.newColumnInfo.numberOfColumns++;
                        }
                    }

                    return result;
                }
            })
        },
        {
            name: "match",
            desc: "Only include items which match a regex or search string",
            para: [
                {
                    name: "Search String",
                    desc: "The string which items must contain in order to be included"
                }
            ],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                var searchString = para || context.searchString;

                if (!searchString && context.regex) {
                    if (explain) {
                        if (negated) {
                            return { explanation: "Only include items which don't match the regex /" + context.regex + "/" };
                        } else {
                            return { explanation: "Only include items which match the regex /" + context.regex + "/" };
                        }
                    } else {
                        if (Array.isArray(value)) {
                            if (negated) {
                                return (value as string[]).filter(function (val: string) { return new RegExp(context.regex as string).test(val) === false; });
                            } else {
                                return (value as string[]).filter(function (val: string) { return new RegExp(context.regex as string).test(val) === true; });
                            }
                        } else {
                            return new RegExp(context.regex).test(value as string) ? value : null;
                        }
                    }
                }
                else {
                    if (explain) {
                        if (negated) {
                            return { explanation: "Only include items that don't contain '" + searchString + "'" };
                        } else {
                            return { explanation: "Only include items containing '" + searchString + "'" };
                        }
                    } else {
                        if (negated) {
                            return (value as string[]).filter(function (val: string) { return val.includes(searchString as string) === false; });
                        } else {
                            return (value as string[]).filter(function (val: string) { return val.includes(searchString as string) === true; });
                        }
                    }
                }
            })
        },
        {
            name: "flat",
            desc: "Flattens an array of arrays into one array, or batches items into arrays of a given size",
            para: [{
                name: "Batch Size",
                desc: "If set, converts into batches of this size"
            }],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                if (explain) {
                    if (this.textUtilsService.IsIntegral(para)) {
                        return { explanation: "Convert into arrays of " + para + " items" };
                    } else {
                        return { explanation: "Flatten an array of arrays into one array" };
                    }
                } else {
                    return value;
                }
            })
        },
        {
            name: "enclose",
            desc: "Put character(s) at the start and end of each item",
            para: [],
            isArrayBased: false,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                var leftChar: string;
                var rightChar: string;

                if (para.length === 0) {
                    leftChar = "(";
                    rightChar = ")";
                } else if (para.length === 1) {
                    leftChar = para[0];
                    rightChar = para[0];
                } else {
                    leftChar = para[0];
                    rightChar = para[1];
                }

                if (explain) {
                    return { explanation: "Enclose each item in " + leftChar + "  " + rightChar };
                } else {
                    var scalarValue = this.textUtilsService.AsScalar(value);
                    return leftChar + scalarValue + rightChar;
                }
            })
        },
        {
            name: "tsv",
            desc: "Tab-separates text that has been split.",
            para: [],
            isArrayBased: false,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                if (explain) {
                    return { explanation: "Output the items in tab-separated format" };
                } else {
                    context.newColumnInfo.headers = [];
                    value = this.textUtilsService.AsArray(value);
                    return (value as string[]).join("\t");
                }
            })
        },
        {
            name: "csv",
            desc: "Outputs the items in CSV format.",
            para: [
                {
                    name: "'",
                    desc: "Enclose values in single quotes."
                },
                {
                    name: '"',
                    desc: "Enclose values in double quotes."
                },
                {
                    name: "@",
                    desc:
                        "When values are enclosed in double quotes, precede " +
                        "opening double quotes with the @ symbol."
                },
                {
                    name: "\\",
                    desc:
                        "When values are enclosed in double quotes, escape " +
                        "any double quotes within values with a backslash."
                },
                {
                    name: "<anything else>",
                    desc: "The character(s) to use as the delimiter."
                }
            ],
            isArrayBased: false,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                value = this.textUtilsService.AsArray(value);

                var options = {
                    isDoubleQuote: para.includes('"'),
                    isSingleQuote: para.includes("'"),
                    isAtString: para.includes("@"),
                    isEscaped: para.includes("\\"),
                    delimiter: para.replace(/["'\\@]+/, "") || ","
                };

                if (para.includes("\\t")) {
                    options.delimiter = "\t";
                }

                if (explain) {

                    var explanation = "Output the items";

                    if (options.delimiter === ",") {
                        explanation += " in CSV format";
                    } else {
                        var formattedDelimiter = this.textUtilsService.FormatDelimiter(options.delimiter, true, false);
                        explanation += " separated with " + formattedDelimiter;
                    }

                    if (options.isDoubleQuote) {
                        explanation += ", with values in double quotes"

                        if (options.isAtString) {
                            explanation += " preceded by @"
                        }

                        if (options.isEscaped) {
                            explanation += ", backslash-escaping any double quotes";
                        } else {
                            explanation += ", doubling-up any double quotes";
                        }
                    }
                    else if (options.isSingleQuote) {
                        explanation += ", with values in single quotes"

                        if (options.isEscaped) {
                            explanation += ", backslash-escaping any quotes";
                        } else {
                            explanation += ", doubling-up any quotes";
                        }
                    }

                    return { explanation: explanation };

                } else {
                    context.newColumnInfo.headers = [];

                    var toDelimitedString = (value: string[], options: any) => {
                        var result = [];

                        for (let i = 0; i < value.length; i++) {
                            var val = value[i];
                            if (options.isDoubleQuote) { // || val.includes(options.delimiter)) {
                                if (options.isEscaped) {
                                    // Replace " with \"
                                    val = val.replace(/"/g, '\\"');
                                    val = '"' + val + '"';
                                } else {
                                    // Replace " with ""
                                    val = val.replace(/"/g, '""');
                                    val = '"' + val + '"';
                                    if (options.isAtString) {
                                        val = "@" + val;
                                    }
                                }
                            } else if (options.isSingleQuote) {
                                if (options.isEscaped) {
                                    // Replace ' with \'
                                    val = val.replace(/'/g, "\\'");
                                    val = "'" + val + "'";
                                } else {
                                    // Replace ' with ''
                                    val = val.replace(/'/g, "''");
                                    val = "'" + val + "'";
                                }
                            }
                            result.push(val);
                        }
                        return result.join(options.delimiter);
                    };
                }

                return toDelimitedString((value as string[]), options);
            })
        },
        {
            name: "join",
            desc: "Joins a split line of text back together.",
            para: [
                {
                    name: "delimiter",
                    desc: "The delimiter to insert between items."
                }
            ],
            isArrayBased: false,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                value = this.textUtilsService.AsArray(value);
                var defaultDelimiter = "";
                para = this.textUtilsService.ReplaceBackslashTWithTab(para);
                
                var delimiter = para || defaultDelimiter;

                if (explain) {
                    var formattedDelimiter = this.textUtilsService.FormatDelimiter(delimiter, true, false);

                    return { explanation: "Output items separated with " + formattedDelimiter };
                } else {

                    context.newColumnInfo.headers = [];
                    return (value as string[]).join(delimiter);
                }
            })
        },
        {
            name: "print",
            desc: "Prints output",
            para: [{ name: "<text>", desc: "What to print." }],
            isArrayBased: false,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                if (explain) {
                    return { explanation: "print " + para };
                } else {
                    para = this.textUtilsService.ReplaceBackslashTWithTab(para);
                    var result = para;
                    var arrayValue = Array.isArray(value) ? (value as string[]) : (["", value] as string[]);

                    // Replace $header

                    if (Array.isArray(context.columnInfo.headers)) {

                        const headersOrderedByLength = this.textUtilsService.GetHeadersOrderedByLength(
                            context.columnInfo.headers
                        );

                        for (let i = 0; i < headersOrderedByLength.length; i++) {

                            let header = headersOrderedByLength[i].header;
                            let index = headersOrderedByLength[i].index;

                            const regex = new RegExp("\\$" + header, "g");
                            const replacement = arrayValue[index];

                            result = result.replace(regex, replacement);
                        }
                    }

                    // Replace $[n]
                    
                    for (let i = 0; i < arrayValue.length; i++) {
                        result = result.replace(new RegExp("\\$\\[" + i + "\\]", "g"), arrayValue[i]);
                    }
                    for (let i = 0; i < arrayValue.length; i++) {
                        result = result.replace(new RegExp("\\$\\[-" + i + "\\]", "g"), arrayValue[arrayValue.length - i]);
                    }
                    
                    context.newColumnInfo.headers = [];
                    return result;
                }
            })
        }
    ];
}