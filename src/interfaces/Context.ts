import { ColumnInfo } from "./ColumnInfo";

export interface Context {
    isTabDelimited: boolean;
    regex: string | null;
    searchString: string | null;
    columnInfo: ColumnInfo;
    newColumnInfo: ColumnInfo;
}