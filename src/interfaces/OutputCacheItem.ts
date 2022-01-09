import { Context } from "./Context";
import { ParsedCommand } from "./CommandInterfaces";

export interface OutputCacheItem {
    parsedCommands: ParsedCommand[];
    context: Context;
    output: string[][];
}