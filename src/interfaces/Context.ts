export interface Context {
    isTabDelimited: boolean;
    regex: string | null;
    searchString: string | null;
    numberOfColumns: number | null;
    isColumnNumeric: boolean[] | null;
    isColumnIntegral: boolean[] | null;
    headers: string[] | null;
}