import {
  badScoreAudio,
  goodScoreAudio,
  neutralScoreAudio,
} from '../../content/endOfGameContent';

import { ConversationData } from '../../models/conversation';
import { convertSSMLContainerToString } from '../../responses/ssmlResponses';
import { gameOver } from '../endOfGameFulfillment';

describe('Scoring at the end of the game', () => {
  test("If score is over 75% get 'good' audio", () => {
    const data: ConversationData = {
      numberOfQuestionsAnswered: 5,
      score: 4,
    };
    const response = gameOver(data);
    expect(convertSSMLContainerToString(response)).toContain(goodScoreAudio);
  });

  test("If score is less than 25% get 'bad' audio", () => {
    const data: ConversationData = {
      numberOfQuestionsAnswered: 5,
      score: 1,
    };
    const response = gameOver(data);
    expect(convertSSMLContainerToString(response)).toContain(badScoreAudio);
  });

  test("If score is between 25-75% get 'neutral' audio", () => {
    const data: ConversationData = {
      numberOfQuestionsAnswered: 5,
      score: 3,
    };
    const response = gameOver(data);
    expect(convertSSMLContainerToString(response)).toContain(neutralScoreAudio);
  });

  test("If no 'numberOfQuestionsAnswered' get 'bad' audio", () => {
    const data: ConversationData = {
      score: 3,
    };
    const response = gameOver(data);
    expect(convertSSMLContainerToString(response)).toContain(badScoreAudio);
  });

  test("If no 'score' get 'bad' audio", () => {
    const data: ConversationData = {
      numberOfQuestionsAnswered: 5,
    };
    const response = gameOver(data);
    expect(convertSSMLContainerToString(response)).toContain(badScoreAudio);
  });
});
