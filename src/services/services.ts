import { ArrayService } from './array.service';
import { CodeCompressionService } from './code-compression.service';
import { ContextService } from './context.service';
import { RegexService } from './regex.service';
import { SortService } from './sort.service';
import { TextPosService } from './text-pos-service';
import { TextUtilsService } from './text-utils.service'

export class Services {

    constructor() {
        
        this.text = new TextUtilsService();
        this.array = new ArrayService();
        this.regex = new RegexService();
        this.codeCompression = new CodeCompressionService();

        this.sort = new SortService(this.text);
        this.textPos = new TextPosService(this.text);
        this.context = new ContextService(this.text, this.array);
    }

    public text: TextUtilsService;
    public array: ArrayService;
    public regex: RegexService;
    public codeCompression: CodeCompressionService;

    public sort: SortService;
    public textPos: TextPosService;
    public context: ContextService;
}