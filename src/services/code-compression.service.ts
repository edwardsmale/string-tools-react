import { TextUtilsService } from './text-utils.service'

export class CodeCompressionService {

    constructor(private textUtilsService: TextUtilsService) {
        this.textUtilsService = textUtilsService;
    }

    CompressCode = (code: string) => {

        return btoa(unescape(encodeURIComponent(code)));
    }

    DecompressCode = (compressedCode: string) => {

        return decodeURIComponent(escape(atob(compressedCode)));
    }
}