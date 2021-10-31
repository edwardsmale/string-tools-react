import { TextUtilsService } from './text-utils.service'
import { TextPosition } from '../interfaces/TextPosition'
import { TextRange } from '../interfaces/TextRange'

export class TextPosService {

    constructor(private textUtilsService: TextUtilsService) {
        this.textUtilsService = textUtilsService;

        this.AreEqual = this.AreEqual.bind(this);
        this.AreInOrder = this.AreInOrder.bind(this);
        this.IsInOrder = this.IsInOrder.bind(this);
        this.FixOrder = this.FixOrder.bind(this);
        this.Add = this.Add.bind(this);
        this.Subtract = this.Subtract.bind(this);
    }

    AreEqual(textPos1: TextPosition, textPos2: TextPosition) {

        return textPos1.char === textPos2.char && textPos1.line === textPos2.line;
    }  

    AreInOrder(textPos1: TextPosition, textPos2: TextPosition) {

        return textPos1.line < textPos2.line || (textPos1.line === textPos2.line && textPos1.char <= textPos2.char);
    }

    IsInOrder(textRange: TextRange) {

        return this.AreInOrder(
            { char: textRange.startChar, line: textRange.startLine },
            { char: textRange.stopChar, line: textRange.stopLine }
        );
    }

    FixOrder(textRange: TextRange) : TextRange {

        if (this.IsInOrder(textRange)) {
            return textRange;
        }
        else {
            return {
                startChar: textRange.stopChar,
                startLine: textRange.stopLine,
                stopChar: textRange.startChar,
                stopLine: textRange.startLine
            };
        }
    }

    Add(textRange: TextRange, x: number, y: number) : TextRange {

        return {
            startChar: textRange.startChar + x,
            startLine: textRange.startLine + y,
            stopChar: textRange.stopChar + x,
            stopLine: textRange.stopLine + y
        };
    }

    Subtract(textRange: TextRange, x: number, y: number) : TextRange {

        return this.Add(textRange, -x, -y);
    }
}

export default TextPosService;