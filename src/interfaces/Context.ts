export interface Context {
    regex: string | null;
    searchString: string | null;
    headers: string[] | null;
    withIndices: number[];
    isSplit: boolean;
}