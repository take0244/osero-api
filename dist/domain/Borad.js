"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
const StoneStats_1 = require("./model/StoneStats");
class Board {
    constructor() {
        this.stoneMap = [];
        this.size = 8;
        this.reset();
    }
    reset() {
        for (let i = 0; i < this.size; i++) {
            this.stoneMap.push([]);
            for (let j = 0; j < this.size; j++) {
                this.stoneMap[i].push(StoneStats_1.StoneStatus.NONE);
            }
        }
        this.stoneMap[3][3] = StoneStats_1.StoneStatus.WHITE;
        this.stoneMap[4][4] = StoneStats_1.StoneStatus.WHITE;
        this.stoneMap[4][3] = StoneStats_1.StoneStatus.BLACK;
        this.stoneMap[3][4] = StoneStats_1.StoneStatus.BLACK;
    }
    reverse(point, stone, tryFlag = false) {
        let result = false;
        const { x, y } = point;
        if (this.stoneMap[x][y] !== StoneStats_1.StoneStatus.NONE)
            return false;
        if (x >= this.size || y >= this.size || y < 0 || x < 0)
            throw new Error(`outside board x: ${x} y: ${y}`);
        const rev = (p, next, stones = []) => {
            const [pastX, pastY] = [point.x, point.y];
            const { x, y } = p;
            const isNext = stones.length === 1;
            const isStart = x === pastX && y === pastY;
            if ((x >= this.size || y >= this.size || y < 0 || x < 0)
                || (!isStart && this.stoneMap[x][y] === StoneStats_1.StoneStatus.NONE)
                || (isNext && (this.stoneMap[x][y] === stone || this.stoneMap[x][y] === StoneStats_1.StoneStatus.NONE))) {
                return;
            }
            if (this.stoneMap[x][y] == stone && stones.length > 1) {
                result = true;
                if (!tryFlag)
                    stones.forEach(({ x, y }) => this.stoneMap[x][y] = stone);
                return;
            }
            stones.push(p);
            rev(next(p), next, stones);
        };
        const N = (point) => ({ x: point.x, y: point.y - 1 });
        const W = (point) => ({ x: point.x + 1, y: point.y });
        const E = (point) => ({ x: point.x - 1, y: point.y });
        const S = (point) => ({ x: point.x, y: point.y + 1 });
        const NW = (point) => ({ x: point.x + 1, y: point.y - 1 });
        const NE = (point) => ({ x: point.x - 1, y: point.y - 1 });
        const SW = (point) => ({ x: point.x + 1, y: point.y + 1 });
        const SE = (point) => ({ x: point.x - 1, y: point.y + 1 });
        [N, W, E, S, NW, NE, SW, SE].forEach((func) => rev(point, func));
        return result;
    }
    getSquare(point) {
        const { x, y } = point;
        return this.stoneMap[x][y];
    }
    isPuttable(stone) {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.stoneMap[i][j] !== StoneStats_1.StoneStatus.NONE)
                    continue;
                if (this.reverse({ x: i, y: j, }, stone, true))
                    return true;
            }
        }
        return false;
    }
    getData() {
        return this.stoneMap;
    }
    isEnd() {
        return this.count()[StoneStats_1.StoneStatus.NONE] === 0 || this.count()[StoneStats_1.StoneStatus.BLACK] === 0 || this.count()[StoneStats_1.StoneStatus.WHITE] === 0;
    }
    count() {
        const result = { [StoneStats_1.StoneStatus.BLACK]: 0, [StoneStats_1.StoneStatus.WHITE]: 0, [StoneStats_1.StoneStatus.NONE]: 0 };
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                result[this.stoneMap[i][j]] += 1;
            }
        }
        return result;
    }
    toString() {
        let result = "";
        for (let y = 0; y < this.size; y++) {
            result += '|';
            for (let x = 0; x < this.size; x++) {
                result += this.stoneMap[x][y] + '|';
            }
            result += "\n";
        }
        return result;
    }
}
exports.Board = Board;
