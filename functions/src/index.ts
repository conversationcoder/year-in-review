import * as functions from 'firebase-functions';

import { ConversationData, ResponseType } from './models/models';
import {
  doNotPlayFulfillment,
  helpAtStartFulfillment,
  invalidResponseFulfillment,
  startYearInReviewFulfillment,
  welcomeFulfillment,
} from './fulfillments/welcomeFulfillment';
import {
  fallbackFulfillment,
  helpFulfillment,
  noInputFulfillment,
  repeatFulfillment,
} from './fulfillments/helperFulfillments';

import { convertSSMLContainerToString } from './responses/ssmlResponses';
import { dialogflow } from 'actions-on-google';
import { respondBasedOnResponseType } from './responses/dialogflowResponses';
import { startCategory } from './fulfillments/categoryFulfillment';
import { trueFalseFulfullment } from './fulfillments/trueFalseFulfillment';

const app = dialogflow<ConversationData, {}>({
  debug: true,
});

app.intent('Welcome Intent', conv => {
  const response = convertSSMLContainerToString(welcomeFulfillment());
  conv.ask(response);
});

app.intent('Welcome Intent - ready', conv => {
  // Removing the welcome intent contexts
  conv.contexts.set('welcomeintent-followup', 0);
  conv.contexts.set('welcomeintent-help-followup', 0);
  respondBasedOnResponseType(startYearInReviewFulfillment, conv);
});

app.intent('Welcome Intent - fallback', conv => {
  respondBasedOnResponseType(invalidResponseFulfillment, conv);
});

app.intent('Welcome Intent - no input', conv => {
  respondBasedOnResponseType(invalidResponseFulfillment, conv);
});

app.intent('Welcome Intent - help', conv => {
  const response = convertSSMLContainerToString(helpAtStartFulfillment());
  conv.ask(response);
});

app.intent('Welcome Intent - help - fallback', conv => {
  const response = convertSSMLContainerToString(doNotPlayFulfillment());
  conv.close(response);
});

app.intent('Welcome Intent - help - help', conv => {
  const response = convertSSMLContainerToString(doNotPlayFulfillment());
  conv.close(response);
});

app.intent('Help', conv => {
  respondBasedOnResponseType(helpFulfillment, conv);
});

app.intent('Repeat', conv => {
  respondBasedOnResponseType(repeatFulfillment, conv);
});

app.intent('No Input', conv => {
  respondBasedOnResponseType(noInputFulfillment, conv);
});

app.intent('Fallback', conv => {
  respondBasedOnResponseType(fallbackFulfillment, conv);
});

app.intent<{ topicChoice: string }>(
  'News-Sport-Tech Round',
  (conv, { topicChoice }) => {
    const fulfillment = startCategory(topicChoice, conv.data);
    const response = convertSSMLContainerToString(fulfillment.responseSSML);
    if (fulfillment.responseType === ResponseType.ASK) {
      conv.ask(response);
    } else {
      conv.close(response);
    }
  }
);

app.intent<{ answer: string }>(
  'News-Sport-Tech Round - trueFalse',
  (conv, { answer }) => {
    const fulfillment = trueFalseFulfullment(answer, conv.data);
    const response = convertSSMLContainerToString(fulfillment.responseSSML);
    if (fulfillment.responseType === ResponseType.ASK) {
      conv.ask(response);
    } else {
      conv.close(response);
    }
  }
);

app.intent('Quit App', conv => {
  const response = convertSSMLContainerToString(doNotPlayFulfillment());
  conv.close(response);
});

exports.yearInReviewFulfillment = functions
  .region('europe-west1')
  .https.onRequest(app);
