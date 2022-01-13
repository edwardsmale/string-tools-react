import { ArrayService } from './array.service';
import { CompressionService } from './compression.service';
import { ContextService } from './context.service';
import { RegexService } from './regex.service';
import { SortService } from './sort.service';
import { TextPosService } from './text-pos-service';
import { TextUtilsService } from './text-utils.service'

export class Services {

    constructor() {
        
        this.array = new ArrayService();
        this.context = new ContextService();
        this.regex = new RegexService();

        this.text = new TextUtilsService(this.regex);

        this.sort = new SortService(this.text);
        this.textPos = new TextPosService(this.text);

        this.compression = new CompressionService(this.text, this.array);
    }

    public array: ArrayService;
    public compression: CompressionService;
    public context: ContextService;
    public regex: RegexService;
    
    public text: TextUtilsService;

    public sort: SortService;
    public textPos: TextPosService;
}