import { PageMenu } from './PageMenu.js';
import { ApiDependency } from './dependencies/ApiDependency.js';
import { DataDependency } from './dependencies/DataDependency.js';
import { ModuleResource } from './ModuleResource.js';

export abstract class Page extends ModuleResource {

    protected parent : PageMenu | null;

    protected title : string;

    protected icon : string;

    public setIcon(icon : string) : Page {
        this.icon = icon;
        return this;
    }
    public getIcon() : string {
        return this.icon;
    }

    public setTitle(title : string) : Page {
        this.title = title;
        return this;
    }
    public getTitle(): string {
        return this.title;
    }

    public abstract getApiDependencies() : ApiDependency[];

    public abstract getDataDependencies(): DataDependency[];
}