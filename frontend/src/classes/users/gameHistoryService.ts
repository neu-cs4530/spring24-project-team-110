// imports the firebase config file at project root
import { getDoc, doc, DocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../../../firebaseconfig';
import GameResult from './GameResult';

/**
 * Retrieves a user's game history from the firestore db.
 * @param userId the user's id
 * @returns the user's game history
 */
export default async function getGameHistory(userId: string): Promise<GameResult[]> {
  // retrieves a user's game history from the firestore db
  const document: DocumentSnapshot = await getDoc(doc(db, 'GameHistory', userId));
  return document
    .data()
    ?.Results.map(
      (res: DocumentData) => new GameResult(res.GameType, res.Date, res.Players, res.Winner),
    );
}
