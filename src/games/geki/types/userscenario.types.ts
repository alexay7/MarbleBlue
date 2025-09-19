import {Types} from "mongoose";

export type GekiUserScenarioType = {
    _id: Types.ObjectId;

    userId: string;

    scenarioId: number;
    playCount: number;
}