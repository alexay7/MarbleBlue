import {Types} from "mongoose";

export type Chu3UserRatingType = {
    musicId: number;
    difficultId: number;
    romVersionCode: number;
    score: number;
}

export type Chu3UserMusicFavoriteType = {
    id: number;
}

export type Chu3UserRivalType = Chu3UserMusicFavoriteType & {
    ktAlias: string;
}

export type Chu3UserMiscType = {
    _id:Types.ObjectId;

    cardId: string;

    recentRatingList: Chu3UserRatingType[];
    ratingBaseHotList: Chu3UserRatingType[];
    ratingBaseList: Chu3UserRatingType[];

    favoriteMusicList: Chu3UserMusicFavoriteType[];
    favoriteCharacterList: Chu3UserMusicFavoriteType[];
    rivalList: Chu3UserRivalType[];

    chatSymbols:number[];
}