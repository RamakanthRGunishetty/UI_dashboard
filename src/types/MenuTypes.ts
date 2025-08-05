export interface MenuItem {
    subHeaderLabel: string;
    list: SubMenuItem[];
}

export interface SubMenuItem {
    listLabel?: string ;
    icon?: string;
    id?: string;
    isActive?: boolean;
    subList? : {
        subListLabel: string | undefined;
        action: ()=>{} | void;
        id?: string;
        isActive?: boolean;
    }[]
}