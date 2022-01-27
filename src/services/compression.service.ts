import { ArrayService } from "./array.service";
import { TextUtilsService } from "./text-utils.service";
import { TextData } from "../interfaces/TextData";

export class CompressionService {

    constructor(private textUtilsService: TextUtilsService, private arrayService: ArrayService) {
        this.textUtilsService = textUtilsService;
        this.arrayService = arrayService;
    }

    CompressCode = (code: string) => {

        return btoa(unescape(encodeURIComponent(code)));
    }

    DecompressCode = (compressedCode: string) => {

        return decodeURIComponent(escape(atob(compressedCode)));
    }

    CompressFiles = (readers: Promise<any>[], callback: (input: TextData) => void): void => {

        let wordScores: any = {};
      
        Promise.all(readers).then(values => {

            const delimiters = " \t\r\n|,";

            for (let i = 0; i < values.length; i++) {

                const value = values[i];

                let pos = 0;

                while (pos < value.length) {

                    const wordStart = pos;

                    while (pos < value.length && !delimiters.includes(value[pos])) {

                        pos++;
                    }

                    if (pos - wordStart >= 3) {

                        const word = value.slice(wordStart, pos);

                        if (!wordScores[word]) {

                            wordScores[word] = 2;
                        }
                        else {

                            wordScores[word] += 2 - word.length;
                        }
                    }

                    while (pos < value.length && delimiters.includes(value[pos])) {

                        pos++;
                    }
                }
            }

            // Sort the words by their scores, which represents how many characters
            // will be added (positive score) or removed (negative score) if the
            // word is included in the index.

            // Exclude any with a non-negative score, and take the first
            // 65536 only.

            let dictionary: string[] = [];

            for (let entry in wordScores) {

                if (wordScores[entry] < -16) {

                    dictionary.push(entry);

                    if (dictionary.length >= 65535) {
                        break;
                    }
                }
            }

            dictionary.sort();

            let compressedLines: string[] = [];

            const token = String.fromCharCode(1);

            let maxWidth = 0;

            Promise.all(readers).then(values => {

                const delimiters = " \t|,";

                for (let i = 0; i < values.length; i++) {
                
                    const lines = this.textUtilsService.TextToLines(values[i] as string);

                    for (let j = 0; j < lines.length; j++) {

                        const line = lines[j];

                        let compressedLine = "";
                        
                        let pos = 0;

                        while (pos < line.length) {

                            const ch = line[pos];

                            if (delimiters.includes(ch)) {

                                compressedLine += ch;
                                pos++;
                            }
                            else {
                            
                                let wordEnd = pos + 1;

                                while (wordEnd < line.length && !delimiters.includes(line[wordEnd])) {

                                    wordEnd++;
                                }
                                
                                const word = line.slice(pos, wordEnd);

                                pos = wordEnd;

                                const dictionaryIndex = this.arrayService.BinarySearchStringArray(dictionary, word);

                                if (dictionaryIndex < 0) {

                                    compressedLine += word;
                                }
                                else {
                                    
                                    compressedLine += token + String.fromCharCode(dictionaryIndex);
                                }
                            }
                        }

                        compressedLines.push(compressedLine);

                        if (compressedLine.length > maxWidth) {
                            maxWidth = compressedLine.length;
                        }
                    }

                    callback(new TextData(compressedLines, dictionary, compressedLines.length, maxWidth));
                }
            });
        });
    }

    DecompressTextData = (textData: TextData): TextData => {

        let decompressed: string[][] = [];

        let lineCount = 0;
        let maxWidth = 0;

        for (let i = 0; i < textData.lines.length; i++) {

            let current: string[] = [];

            for (let j = 0; j < textData.lines[i].length; j++) {

                const line = textData.lines[i][j];

                if (!line.includes(String.fromCharCode(1))) {

                    current.push(line);

                    if (line.length > maxWidth) {

                        maxWidth = line.length;
                    }
                }
                else {
                    const decompressedLine = this.DecompressString(line, textData.dictionary);

                    current.push(decompressedLine);

                    lineCount++;

                    if (decompressedLine.length > maxWidth) {

                        maxWidth = decompressedLine.length;
                    }
                }
            }

            decompressed.push(current);
        }

        return new TextData(decompressed, null, lineCount, maxWidth);
    }

    DecompressString = (str: string, dictionary: string[]): string => {

        const split = str.split(String.fromCharCode(1));

        let decompressed = split[0];

        for (let i = 1; i < split.length; i++) {

            const index = split[i].charCodeAt(0);

            decompressed += dictionary[index];

            decompressed += split[i].slice(1);
        }

        return decompressed;
    }
}