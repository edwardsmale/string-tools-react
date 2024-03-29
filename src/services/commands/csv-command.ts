import { Explanation, IndividualLineCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class CsvCommand extends IndividualLineCommand {

    Name = "csv"

    Help = {
        Desc: "Joins the items together, in CSV format",
        Para: [
            { name: "'", desc: "Enclose values in single quotes." },
            { name: '"', desc: "Enclose values in double quotes." },
            { name: "@", desc: "When values are enclosed in double quotes, precede opening double quotes with the @ symbol." },
            { name: "\\", desc: "When values are enclosed in double quotes, escape any double quotes within values with a backslash." },
            { name: "<anything else>", desc: "The character(s) to use as the delimiter." }
        ]
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        const options = this.parseOptions(para);
    
        let explanation = "Output the items";

        if (options.delimiter === ",") {

            explanation += " in CSV format";

        } else {

            var formattedDelimiter = this.services.text.FormatDelimiter(options.delimiter, true, false);
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

        context.isSplit = false;

        return { segments: [explanation] };    
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        const options = this.parseOptions(para);

        context.headers = [];

        context.isSplit = false;

        return [this.toDelimitedString(value, options, context)];
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

    private toDelimitedString = (value: string[], options: any, context: Context) => {

        let result = [];

        for (let i = 0; i < value.length; i++) {

            if (!context.withIndices.length || context.withIndices.includes(i)) {
                
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
        }

        return result.join(options.delimiter);
    };
}