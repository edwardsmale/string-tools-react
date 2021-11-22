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
    Command: Command;
}

export interface Command
{
    Explain(para: string, negated: boolean, context: Context): Explanation;
    Execute(value: string[], para: string, negated: boolean, context: Context): string[];
    UpdateContext?(para: string, negated: boolean, context: Context): void;
}

export interface Explanation
{
    segments: string[];
}