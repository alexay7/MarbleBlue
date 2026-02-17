export interface SdvxGameApigenType {
    _id: string;

    id: number;
    name: string;
    nameEnglish?: string;
    commonRate?: number;
    uncommonRate?: number;
    rareRate?: number;
    price?: number;
    version?: number;
    noDuplicate?: boolean;

    catalog?: {
        id: number;
        rarity: number;
        itemType: number;
        itemId: number;
    }[];
}