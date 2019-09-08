export interface UserAccessTree {
    modules : {
        module : string;
        listeners : {
            listener : string;
            actions : string[] | '*';
        }[] | '*';
    }[];
}