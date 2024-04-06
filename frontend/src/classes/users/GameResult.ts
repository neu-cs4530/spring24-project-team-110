import { Timestamp } from 'firebase/firestore';
import { PlayerID } from '../../types/CoveyTownSocket';

export default class GameResult {
  private _gameType: string;

  private _date: Timestamp;

  private _players: PlayerID[];

  private _winner: PlayerID;

  public constructor(gameType: string, date: Timestamp, players: PlayerID[], winner: PlayerID) {
    this._gameType = gameType;
    this._date = date;
    this._players = players;
    this._winner = winner;
  }

  get gameType(): string {
    return this._gameType;
  }

  get date(): Timestamp {
    return this._date;
  }

  get players(): PlayerID[] {
    return this._players;
  }

  get winner(): PlayerID {
    return this._winner;
  }
}
