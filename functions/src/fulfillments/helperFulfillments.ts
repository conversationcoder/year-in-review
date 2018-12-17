import {
  ConversationData,
  DialogflowResponse,
  Unknown,
} from '../models/conversation';
import { getTopic, questionRepromptFulfillment } from './questionFulfillment';
import {
  trueFalseHelp,
  multipleChoiceHelp,
  fillInTheBlankHelp,
  trueFalseUnknownInput,
  multipleChoiceUnknownInput,
  fillInTheBlankUnknownInput,
  trueFalseNoInput,
  multipleChoiceNoInput,
  fillInTheBlankNoInput,
  repeat,
} from '../content/genericQuestionContent';
import {
  roundFallbackFulfillment,
  roundHelpFulfillment,
  roundNoInputFulfillment,
  roundRepeatFullfillment,
} from './roundFulfillment';
import {
  Question,
  TrueFalseQuestion,
  MultipleChoiceQuestion,
} from '../models/questions';
import { unrecognisedInputWelcomeFulfillment } from './welcomeFulfillment';

const helpFulfillment = (data: ConversationData): DialogflowResponse => {
  const topic = getTopic(data);
  if (topic instanceof Unknown) {
    return roundHelpFulfillment(data);
  } else {
    return questionRepromptFulfillment(data, getQuestionSpecificHelpAudio);
  }
};

const noInputFulfillment = (data: ConversationData): DialogflowResponse => {
  const topic = getTopic(data);
  if (topic instanceof Unknown) {
    return roundNoInputFulfillment(data);
  } else {
    return questionRepromptFulfillment(data, getQuestionSpecificNoInputAudio);
  }
};

const fallbackFulfillment = (data: ConversationData): DialogflowResponse => {
  const topic = getTopic(data);
  if (!data.finishedWelcomeIntent) {
    return unrecognisedInputWelcomeFulfillment(data);
  }
  if (topic instanceof Unknown) {
    return roundFallbackFulfillment(data);
  } else {
    return questionRepromptFulfillment(
      data,
      getQuestionSpecificUnknownInputAudio
    );
  }
};

const repeatFulfillment = (data: ConversationData): DialogflowResponse => {
  const topic = getTopic(data);
  if (topic instanceof Unknown) {
    return roundRepeatFullfillment(data);
  } else {
    return questionRepromptFulfillment(data, () => repeat);
  }
};

const getQuestionSpecificHelpAudio = (question: Question): string => {
  if (question instanceof TrueFalseQuestion) {
    return trueFalseHelp;
  }
  if (question instanceof MultipleChoiceQuestion) {
    return multipleChoiceHelp;
  } else {
    return fillInTheBlankHelp;
  }
};

const getQuestionSpecificUnknownInputAudio = (question: Question): string => {
  if (question instanceof TrueFalseQuestion) {
    return trueFalseUnknownInput;
  }
  if (question instanceof MultipleChoiceQuestion) {
    return multipleChoiceUnknownInput;
  } else {
    return fillInTheBlankUnknownInput;
  }
};

const getQuestionSpecificNoInputAudio = (question: Question): string => {
  if (question instanceof TrueFalseQuestion) {
    return trueFalseNoInput;
  }
  if (question instanceof MultipleChoiceQuestion) {
    return multipleChoiceNoInput;
  } else {
    return fillInTheBlankNoInput;
  }
};

export {
  helpFulfillment,
  noInputFulfillment,
  fallbackFulfillment,
  repeatFulfillment,
};
