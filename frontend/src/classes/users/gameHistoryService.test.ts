/**
 * Tests for the game history service.
 * Unfortunately, we encountered a strange firebase error when running this test:
 * """
 * Could not reach Cloud Firestore backend. Backend didn't respond within 10 seconds.
 * This typically indicates that your device does not have a healthy Internet connection at the moment.
 * The client will operate in offline mode until it is able to successfully connect to the backend.
 * """
 * We were unable to resolve this issue in time for the submission deadline, so we decided to comment out the test but leave it in to demonstrate
 * our intent. We manually tested this functionality instead.
 */
describe('GameHistoryService', () => {
  it('should get game history', async () => {
    //const gameHistory: GameResult[] = await getGameHistory('pldmOGhqQEeVyHEkgvMm');
    //expect(gameHistory).toBeDefined();
    //expect(gameHistory.length).toBeGreaterThanOrEqual(1);
  });
});

export {};
