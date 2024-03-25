import { Timestamp } from 'firebase/firestore';
import { PlayerID } from '../../types/CoveyTownSocket';

export default class GameResult {
  private _gameType: string;

  private _gameDate: Timestamp;

  private _gamePlayers: PlayerID[];

  private _gameWinner: PlayerID;

  public constructor(
    gameType: string,
    gameDate: Timestamp,
    gamePlayers: PlayerID[],
    gameWinners: PlayerID,
  ) {
    this._gameType = gameType;
    this._gameDate = gameDate;
    this._gamePlayers = gamePlayers;
    this._gameWinner = gameWinners;
  }

  get gameType(): string {
    return this._gameType;
  }

  get gameDate(): Timestamp {
    return this._gameDate;
  }

  get gamePlayers(): PlayerID[] {
    return this._gamePlayers;
  }

  get gameWinner(): PlayerID {
    return this._gameWinner;
  }
}
