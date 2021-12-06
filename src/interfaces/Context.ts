import { ColumnInfo } from "./ColumnInfo";

export interface Context {
    regex: string | null;
    searchString: string | null;
    columnInfo: ColumnInfo;
    withIndices: number[];
    isArrayOfArrays: boolean;
}