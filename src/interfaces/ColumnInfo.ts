export interface ColumnInfo {
    numberOfColumns: number | null;
    isColumnNumeric: boolean[] | null;
    isColumnIntegral: boolean[] | null;
    headers: string[] | null;
}