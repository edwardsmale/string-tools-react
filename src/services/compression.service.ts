import { ArrayService } from "./array.service";
import { TextUtilsService } from "./text-utils.service";
import { Input } from "../interfaces/Input";

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

    CompressFiles = (readers: Promise<any>[], callback: (input: Input) => void): void => {

        let wordScores: any = {};
      
        Promise.all(readers).then(values => {

            for (let i = 0; i < values.length; i++) {
            
                const lines = this.textUtilsService.TextToLines(values[i] as string);

                for (let j = 0; j < lines.length; j++) {

                    const words = this.textUtilsService.TextToWords(lines[j]);

                    for (let w = 0; w < words.length; w++) {
                    
                        const word = words[w];

                        if (!wordScores[word]) {

                            wordScores[word] = 2;
                        }
                        else {

                            wordScores[word] += 2 - word.length;
                        }
                    }
                }
            }

            // Sort the words by their scores, which represents how many characters
            // will be added (positive score) or removed (negative score) if the
            // word is included in the index.

            // Exclude any with a non-negative score, and take the first
            // 65536 only.

            let sortedWordScores = [];

            for (let entry in wordScores) {

                if (wordScores[entry] < -32) {

                    sortedWordScores.push([entry, wordScores[entry]]);
                }
            }
                
            sortedWordScores.sort(function(a, b) {
                return a[1] - b[1];
            });

            const length = Math.min(65536, sortedWordScores.length);

            let dictionary: string[] = [];

            for (let i = 0; i < length; i++) {

                dictionary.push(sortedWordScores[i][0]);
            }

            dictionary.sort();

            let compressedLines: string[] = [];

            Promise.all(readers).then(values => {

                for (let i = 0; i < values.length; i++) {
                
                    const lines = this.textUtilsService.TextToLines(values[i] as string);

                    for (let j = 0; j < lines.length; j++) {

                        let line = lines[j];

                        let compressedLine = "";
                        
                        let pos = 0;

                        while (pos < line.length) {

                            let ch = line[pos];

                            if (ch === "\t" || ch === " " || ch === "|" || ch === ",") {

                                compressedLine += ch;
                                pos++;
                            }
                            else {
                            
                                let wordEnd = pos;

                                while (wordEnd < line.length && 
                                    line[wordEnd] !== "\t" && 
                                    line[wordEnd] !== " " && 
                                    line[wordEnd] !== "|" && 
                                    line[wordEnd] !== ",") {

                                    wordEnd++;
                                }
                                
                                const word = line.slice(pos, wordEnd);

                                pos = wordEnd;

                                const dictionaryIndex = this.arrayService.BinarySearchStringArray(dictionary, word);

                                if (dictionaryIndex >= 0) {

                                    compressedLine += word;
                                }
                                else {
                                    
                                    compressedLine += String.fromCharCode(1);
                                    compressedLine += String.fromCharCode(dictionaryIndex);
                                }
                            }
                        }

                        compressedLines.push(compressedLine);
                    }

                    callback(new Input(compressedLines, dictionary));
                }
            });
        });
    }
}