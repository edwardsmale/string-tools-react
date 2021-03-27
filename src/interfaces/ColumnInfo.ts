export interface ColumnInfo {
    numberOfColumns: number;
    isColumnNumeric: boolean[] | null;
    isColumnIntegral: boolean[] | null;
    headers: string[] | null;
}