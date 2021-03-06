import { ColumnInfo } from "./ColumnInfo";

export interface Context {
    regex: string | null;
    searchString: string | null;
    columnInfo: ColumnInfo;
    newColumnInfo: ColumnInfo;
    withIndices: number[] | null;
}