import { ConversationData, Response, ResponseType } from '../models/models';
import { OptionRoundCollection, RoundCollection } from '../models/rounds';

import { buildSSMLAudioResponse } from '../responses/genericResponse';
import { rounds } from '../content/roundContent';
import { startCategory } from './categoryFulfillment';
import { unexpectedErrorAudio } from '../content/errorContent';

const roundHelpFulfillment = (data: ConversationData): Response => {
  const roundNumber = data.currentRound || 1;
  const round: OptionRoundCollection = rounds.getRoundCollection(roundNumber);
  if (round instanceof RoundCollection) {
    return new Response(
      ResponseType.ASK,
      buildSSMLAudioResponse(round.helpAudio)
    );
  } else {
    return new Response(
      ResponseType.CLOSE,
      buildSSMLAudioResponse(unexpectedErrorAudio)
    );
  }
};

const roundRepeatFullfillment = (data: ConversationData): Response => {
  return giveUserRoundOptions(data);
};

const giveUserRoundOptions = (data: ConversationData): Response => {
  const roundNumber = data.currentRound || 1;
  const round = rounds.getRoundCollection(roundNumber);
  if (round instanceof RoundCollection) {
    return buildResponse(round, data);
  } else {
    return new Response(ResponseType.CLOSE, gameOver());
  }
};

const selectRound = (data: ConversationData): Response => {
  incrementRoundNumber(data);
  return giveUserRoundOptions(data);
};

const buildResponse = (
  round: RoundCollection,
  data: ConversationData
): Response => {
  if (round.getTopics().size === 1) {
    let response: Response = new Response(
      ResponseType.CLOSE,
      buildSSMLAudioResponse(unexpectedErrorAudio)
    );
    round.getTopics().forEach(topic => (response = startCategory(topic, data)));
    return response;
  } else {
    return new Response(
      ResponseType.ASK,
      buildSSMLAudioResponse(round.introductionAudio)
    );
  }
};

const incrementRoundNumber = (data: ConversationData) => {
  const currentRound = data.currentRound || 0;
  data.currentRound = currentRound + 1;
};

const gameOver = () => {
  return 'Game over!';
};

export { selectRound, roundHelpFulfillment, roundRepeatFullfillment };
