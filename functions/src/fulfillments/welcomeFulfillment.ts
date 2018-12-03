import {
  ConversationData,
  Response,
  ResponseType,
} from '../models/conversation';
import {
  askAgainAudio,
  doNotPlayAudio,
  helpAtStartAudio,
  welcomeAudio,
} from '../content/welcomeContent';

import { buildSSMLAudioResponse } from '../responses/ssmlResponses';
import { chooseRound } from './roundFulfillment';

const welcomeFulfillment = () => {
  return buildSSMLAudioResponse(welcomeAudio);
};

const askAgainFulfillment = (data: ConversationData) => {
  return buildSSMLAudioResponse(askAgainAudio);
};

const setReprompt = (data: ConversationData) => {
  return (data.startRepromptIssued = true);
};

const doNotPlayFulfillment = () => {
  return buildSSMLAudioResponse(doNotPlayAudio);
};

const helpAtStartFulfillment = () => {
  return buildSSMLAudioResponse(helpAtStartAudio);
};

const startYearInReviewFulfillment = (data: ConversationData): Response => {
  return chooseRound(data);
};

const invalidResponseFulfillment = (data: ConversationData): Response => {
  if (data.startRepromptIssued === true) {
    return new Response(ResponseType.CLOSE, doNotPlayFulfillment());
  } else {
    setReprompt(data);
    return new Response(ResponseType.ASK, askAgainFulfillment(data));
  }
};

export {
  welcomeFulfillment,
  startYearInReviewFulfillment,
  doNotPlayFulfillment,
  helpAtStartFulfillment,
  invalidResponseFulfillment,
};
