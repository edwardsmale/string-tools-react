import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { TextUtilsService } from '../text-utils.service';

export class CsvCommand implements Command {

    constructor(private textUtilsService: TextUtilsService) {
        
        this.textUtilsService = textUtilsService;
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        const options = this.parseOptions(para);
    
        let explanation = "Output the items";

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

        return { segments: [explanation] };    
    }

    ExecuteScalar(value: string, para: string, negated: boolean, context: Context): string {

        const options = this.parseOptions(para);

        context.newColumnInfo.headers = [];

        return this.toDelimitedString(value, options);
    }

    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        const options = this.parseOptions(para);

        context.newColumnInfo.headers = [];

        return [this.toDelimitedString(value, options)];
    }

    private parseOptions(para: string) {

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
        
        return options;
    }

    private toDelimitedString = (value: string[], options: any) => {

        let result = [];

        for (let i = 0; i < value.length; i++) {

            var val = value[i];

            if (options.isDoubleQuote) {

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
            } 
            else if (options.isSingleQuote) {

                if (options.isEscaped) {

                    // Replace ' with \'
                    val = val.replace(/'/g, "\\'");
                    val = "'" + val + "'";
                } 
                else {

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