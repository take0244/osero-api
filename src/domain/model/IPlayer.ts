import { Board } from "../Borad";
import { StoneStatus } from "./StoneStats";

export interface IPlayer {
    put(borad: Board, x: number, y: number): boolean;
    getMyStone(): StoneStatus;
}