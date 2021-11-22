import { Context } from "./Context";

export interface ParsedCommand
{
    commandType: CommandType;
    para: string;
    negated: boolean;
}

export interface CommandParameter
{
    name: string;
    desc: string;
}

export interface CommandType
{
    name: string;
    desc: string;
    para: CommandParameter[];
    isArrayBased: boolean;
    exec: (value: string[], para: string, negated: boolean, context: Context, explain: boolean) => Explanation | string[] | null;
}

export interface Command
{
    Explain(para: string, negated: boolean, context: Context): Explanation;
    Execute(value: string[], para: string, negated: boolean, context: Context): string[];
}

export interface Explanation
{
    segments: string[];
}