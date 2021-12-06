import { ArrayService } from './array.service';
import { SortService } from './sort.service';
import { TextUtilsService } from './text-utils.service'

export class Services {

    constructor() {
        
        this.textUtilsService = new TextUtilsService();
        this.arrayService = new ArrayService();
        this.sortService = new SortService(this.textUtilsService);
    }

    public textUtilsService: TextUtilsService;
    public arrayService: ArrayService;
    public sortService: SortService;
}