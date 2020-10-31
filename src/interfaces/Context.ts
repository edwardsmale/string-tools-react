export interface Context {
    isTabDelimited: boolean;
    regex: string | null;
    searchString: string | null;
    isColumnNumeric: boolean[] | null;
}