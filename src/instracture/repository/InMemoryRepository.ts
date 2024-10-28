import { debug } from "../../aop/log";
import { Board } from "../../domain/Borad";
import { Game } from "../../domain/Game";
import { Turn } from "../../domain/model/Turn";
import { Repository } from "../../usecase/usecase";

type StoreValue = { game: Game, userTurn: Record<string, Turn>, onChange?: Array<(board: Board) => void>};
export class InMemoryRepository implements Repository {
  game: Game|null = null;
  cache: { [key: string]: StoreValue } = {};
  onChange?: Array<(board: Board) => void>;

  storeGame(key: string, arg: StoreValue) {
    this.cache[key] = arg;
  }
  getGame(key: string): StoreValue {
    return this.cache[key];
  }
  getLastRoomId() {
    return Object.keys(this.cache).length;
  }
}
  
export default InMemoryRepository;
