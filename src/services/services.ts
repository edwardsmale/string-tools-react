import { TextUtilsService } from './text-utils.service'

export class Services {

    constructor() {
        
        this.textUtilsService = new TextUtilsService();
    }

    public textUtilsService: TextUtilsService;
}