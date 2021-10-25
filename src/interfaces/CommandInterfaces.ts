import { Context } from "./Context";

export interface ParsedCommand
{
    commandType: CommandType | SortCommandType;
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
}

export interface ScalarCommandType
{
    name: string;
    desc: string;
    para: CommandParameter[];
    isArrayBased: boolean;
    exec: (value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => Explanation | string | (string | string[])[] | null;
}

export interface ArrayCommandType
{
    name: string;
    desc: string;
    para: CommandParameter[];
    isArrayBased: boolean;
    exec: (value: (string | string[])[], para: string, negated: boolean, context: Context, explain: boolean) => Explanation | string | (string | string[])[] | null;
}

export interface Command
{
    Explain(): Explanation;
    ExecuteScalar(value: string, para: string, negated: boolean, context: Context): string;
    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[];
}

export interface SortCommandType
{
    name: string;
    desc: string;
    para: CommandParameter[];
    isArrayBased: boolean;
    exec: (value: (string | string[])[], para: string, negated: boolean, context: Context, explain: boolean) => Explanation | string | (string | string[])[];
}

export interface Explanation
{
    segments: string[];
}