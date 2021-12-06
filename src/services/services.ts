import { ArrayService } from './array.service';
import { TextUtilsService } from './text-utils.service'

export class Services {

    constructor() {
        
        this.textUtilsService = new TextUtilsService();
        this.arrayService = new ArrayService();
    }

    public textUtilsService: TextUtilsService;
    public arrayService: ArrayService;
}