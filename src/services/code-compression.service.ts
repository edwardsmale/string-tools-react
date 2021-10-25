export class CodeCompressionService {

    CompressCode = (code: string) => {

        return btoa(unescape(encodeURIComponent(code)));
    }

    DecompressCode = (compressedCode: string) => {

        return decodeURIComponent(escape(atob(compressedCode)));
    }
}