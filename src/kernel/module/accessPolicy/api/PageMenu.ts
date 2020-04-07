import { Page } from './Page';
import { ModuleResource } from './ModuleResource';
import { ApiDependency } from './dependencies/ApiDependency';
import { DataDependency } from './dependencies/DataDependency';

export abstract class PageMenu extends ModuleResource {

    protected allChildren: (Page | PageMenu)[] = [];

    protected pages: Page[] = [];

    protected menus: PageMenu[] = [];

    public getName(): string {
        return this.name;
    }

    public addChild(child: Page);
    public addChild(child: PageMenu);
    public addChild(child: Page | PageMenu) {

        this.allChildren.push(child);

        if (child instanceof Page) {
            this.pages.push(child);
        }

        if (child instanceof PageMenu) {
            this.menus.push(child);
        }
    }


    public getChildren(): (Page | PageMenu)[] {
        return ([] as (Page | PageMenu)[]).concat(this.allChildren);
    }

    public getApiDependencies(): ApiDependency[] {

        let allChildDependencies: ApiDependency[] = [];

        this.getChildren().forEach((api) => {
           allChildDependencies.concat(api.getApiDependencies());
        });

        return Array.from(allChildDependencies.values());
    }

    public getDataDependencies() : DataDependency[]{

        let allChildDependencies : DataDependency[] = [];
        this.getChildren().forEach((api) => {
            allChildDependencies.concat(api.getDataDependencies());
        });

        return allChildDependencies;
    }



}