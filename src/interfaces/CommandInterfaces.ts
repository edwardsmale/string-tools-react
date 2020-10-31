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
    exec: (value: string | (string | string)[], para: string, negated: boolean, context: Context, explain: boolean) => Explanation | string | string[] | string[][] | null;
}

export interface SortCommandType
{
    name: string;
    desc: string;
    para: CommandParameter[];
    isArrayBased: boolean;
    exec: (value: string[] | string[][], para: string, negated: boolean, context: Context, explain: boolean) => Explanation | string | string[] | string[][];
}

export interface Explanation
{
    explanation: string;
}