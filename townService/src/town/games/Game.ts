import { nanoid } from 'nanoid';
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebaseconfig';
import Player from '../../lib/Player';
import {
  GameInstance,
  GameInstanceID,
  GameMove,
  GameResult,
  PlayerID,
  WinnableGameState,
} from '../../types/CoveyTownSocket';

/**
 * This class is the base class for all games. It is responsible for managing the
 * state of the game. @see GameArea
 */
export default abstract class Game<StateType extends WinnableGameState, MoveType> {
  private _state: StateType;

  private _date: Date;

  protected _testMode: boolean;

  public readonly id: GameInstanceID;

  protected _result?: GameResult;

  protected _players: Player[] = [];

  /**
   * Creates a new Game instance.
   * @param initialState State to initialize the game with.
   * @param emitAreaChanged A callback to invoke when the state of the game changes. This is used to notify clients.
   */
  public constructor(initialState: StateType, testMode = false) {
    this.id = nanoid() as GameInstanceID;
    this._state = initialState;
    this._date = new Date();
    this._testMode = testMode;
  }

  public get state() {
    return this._state;
  }

  protected set state(newState: StateType) {
    this._state = newState;
  }

  /**
   * Apply a move to the game.
   * This method should be implemented by subclasses.
   * @param move A move to apply to the game.
   * @throws InvalidParametersError if the move is invalid.
   */
  public abstract applyMove(move: GameMove<MoveType>): void;

  /**
   * Attempt to join a game.
   * This method should be implemented by subclasses.
   * @param player The player to join the game.
   * @throws InvalidParametersError if the player can not join the game
   */
  protected abstract _join(player: Player): void;

  /**
   * Attempt to leave a game.
   * This method should be implemented by subclasses.
   * @param player The player to leave the game.
   * @throws InvalidParametersError if the player can not leave the game
   */
  protected abstract _leave(player: Player): void;

  /**
   * Attempt to join a game.
   * @param player The player to join the game.
   * @throws InvalidParametersError if the player can not join the game
   */
  public join(player: Player): void {
    this._join(player);
    this._players.push(player);
  }

  /**
   * Attempt to leave a game.
   * @param player The player to leave the game.
   * @throws InvalidParametersError if the player can not leave the game
   */
  public leave(player: Player): void {
    this._leave(player);
    this._players = this._players.filter(p => p.id !== player.id);
  }

  public toModel(): GameInstance<StateType> {
    return {
      state: this._state,
      id: this.id,
      result: this._result,
      players: this._players.map(player => player.id),
    };
  }

  /**
   * Returns the kind of game being played.
   */
  public abstract gameType(): string;

  get players(): PlayerID[] {
    return this._players.map(player => player.id);
  }

  get date(): Date {
    return this._date;
  }

  get winner(): PlayerID {
    return this._state.winner || '';
  }

  private async _writeGameResult(colName: string, userID: PlayerID): Promise<number> {
    const collectionRef = collection(db, colName);
    const collectionSnap = await getDocs(collectionRef);

    if (collectionSnap.empty) {
      return 1;
    }

    const docRef = doc(db, colName, userID);
    const docSnap = await getDoc(docRef);

    const gameResult = {
      Date: this.date,
      GameType: this.gameType(),
      Winner: this.winner,
      Players: this.players,
    };

    try {
      if (docSnap.exists()) {
        await updateDoc(docRef, { Results: arrayUnion(gameResult) });
      } else {
        await setDoc(docRef, { Results: [gameResult] });
      }
      return 0;
    } catch (error) {
      return 1;
    }
  }

  /**
   * Writes the game results to the Firestore database.
   * @returns 0 on success, 1 on failure.
   */
  public async writeGameResults(colName: string) {
    const codes = new Set<number>();

    const userIDs = this.players;

    // eslint-disable-next-line guard-for-in
    for (const userID of userIDs) {
      // eslint-disable-next-line no-await-in-loop
      codes.add(await this._writeGameResult(colName, userID));
    }

    if (codes.has(1)) {
      return 1;
    }

    return 0;
  }
}
