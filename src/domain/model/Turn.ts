export enum Turn {
    ONE,
    TWO,
}
export const switchTurn = (t: Turn) => t === Turn.ONE ? Turn.TWO : Turn.ONE