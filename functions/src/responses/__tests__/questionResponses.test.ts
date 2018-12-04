import {
  ConversationData,
  ResponseType,
  Unknown,
} from '../../models/conversation';
import {
  MultipleChoiceQuestion,
  TrueFalseQuestion,
} from '../../models/questions';
import {
  askNextQuestion,
  buildQuestionResponse,
  endOfCategory,
  getMultipleChoiceFeedback,
  getTrueFalseFeedback,
} from '../questionResponses';

import { Category } from '../../models/categories';
import { Topic } from '../../models/rounds';
import { categories } from '../../content/categoryContent';
import { convertSSMLContainerToString } from '../ssmlResponses';
import { unexpectedErrorResponse } from '../../utils/logger';

describe('Build question response', () => {
  test('If there is no current question but a next question return an error response', () => {
    const data = { startRepromptIssued: true };
    const currentQuestion = new Unknown('error');
    const nextQuestion = new TrueFalseQuestion('', false, '', '');
    const response = buildQuestionResponse(
      data,
      currentQuestion,
      nextQuestion,
      'true'
    );
    expect(response.responseType).toEqual(ResponseType.CLOSE);
    expect(unexpectedErrorResponse).toBeCalled;
  });

  test('If there is no current question and no next question return an error', () => {
    const data = { startRepromptIssued: true };
    const currentQuestion = new Unknown('error');
    const nextQuestion = new Unknown('error');
    const response = buildQuestionResponse(
      data,
      currentQuestion,
      nextQuestion,
      'true'
    );
    expect(response.responseType).toEqual(ResponseType.CLOSE);
    expect(unexpectedErrorResponse).toBeCalled;
  });

  test('If there is a current question and a next question askNextQuestion', () => {
    const data = { startRepromptIssued: true };
    const currentQuestion = new TrueFalseQuestion('', false, '', '');
    const nextQuestion = new TrueFalseQuestion('', true, '', '');
    buildQuestionResponse(data, currentQuestion, nextQuestion, 'true');
    expect(askNextQuestion).toBeCalled;
  });

  test('If there is a current question and no next question call endOfCategory', () => {
    const data = { startRepromptIssued: true };
    const currentQuestion = new TrueFalseQuestion('', true, '', '');
    const nextQuestion = new Unknown('error');
    buildQuestionResponse(data, currentQuestion, nextQuestion, 'true');
    expect(endOfCategory).toBeCalled;
  });
});

describe('End of category', () => {
  test('End of category audio is included', () => {
    const topic = Topic.NEWS;
    const data: ConversationData = {
      startRepromptIssued: true,
      currentTopic: topic,
    };
    const question = new TrueFalseQuestion('', false, '', '');
    const category = categories.getCategory(topic);
    if (category instanceof Category) {
      const response = endOfCategory(data, question, 'true');
      const ssml = convertSSMLContainerToString(response.responseSSML);
      expect(ssml).toContain(category.teaserAudio);
    }
  });

  test('Category is removed from ConversationData', () => {
    const data: ConversationData = {
      startRepromptIssued: true,
      currentTopic: Topic.NEWS,
    };
    const question: TrueFalseQuestion = new TrueFalseQuestion(
      '',
      true,
      'correctAudio',
      'incorrectAudio'
    );
    const answer = 'false';
    endOfCategory(data, question, answer);
    const expectedData: ConversationData = {
      startRepromptIssued: true,
      currentRound: 1,
    };
    expect(data).toEqual(expectedData);
  });

  test('True False Feedback should be used to check a true false question', () => {
    const data: ConversationData = {
      startRepromptIssued: true,
      currentTopic: Topic.NEWS,
    };
    const question: TrueFalseQuestion = new TrueFalseQuestion(
      '',
      true,
      'correctAudio',
      'incorrectAudio'
    );
    const answer = 'false';
    endOfCategory(data, question, answer);
    expect(getTrueFalseFeedback).toBeCalled;
  });

  test('Multiple Choice Feedback should be used to check a Multiple Choice question', () => {
    const data: ConversationData = {
      startRepromptIssued: true,
      currentTopic: Topic.NEWS,
    };
    const question: MultipleChoiceQuestion = new MultipleChoiceQuestion(
      '',
      'a',
      'correctAudio',
      'incorrectAudio',
      'incorrectAudio',
      'incorrectAudio'
    );
    const answer = 'false';
    endOfCategory(data, question, answer);
    expect(getMultipleChoiceFeedback).toBeCalled;
  });
});

describe('Feedback for True False Question', () => {
  test("If answers match and the answer is true return 'correct' response", () => {
    const question: TrueFalseQuestion = new TrueFalseQuestion(
      '',
      true,
      'correct',
      'incorrect'
    );
    const response = getTrueFalseFeedback(question, 'true');
    expect(response).toEqual(question.correctAnswerAudio);
  });

  test("If answers match and the answer is false return 'correct' response", () => {
    const question: TrueFalseQuestion = new TrueFalseQuestion(
      '',
      false,
      'correct',
      'incorrect'
    );
    const response = getTrueFalseFeedback(question, 'false');
    expect(response).toEqual(question.correctAnswerAudio);
  });

  test("If answers do not match and the answer is false return 'incorrect' response", () => {
    const question: TrueFalseQuestion = new TrueFalseQuestion(
      '',
      false,
      'correct',
      'incorrect'
    );
    const response = getTrueFalseFeedback(question, 'true');
    expect(response).toEqual(question.incorrectAnswerAudio);
  });

  test("If answers do not match and the answer is true return 'incorrect' response", () => {
    const question: TrueFalseQuestion = new TrueFalseQuestion(
      '',
      true,
      'correct',
      'incorrect'
    );
    const response = getTrueFalseFeedback(question, 'false');
    expect(response).toEqual(question.incorrectAnswerAudio);
  });

  test("If answer is an unexpected string and the answer is true return 'incorrect' response", () => {
    const question: TrueFalseQuestion = new TrueFalseQuestion(
      '',
      true,
      'correct',
      'incorrect'
    );
    const response = getTrueFalseFeedback(question, 'cat');
    expect(response).toEqual(question.incorrectAnswerAudio);
  });

  test("If answer is an unexpected string and the answer is false return 'incorrect' response", () => {
    const question: TrueFalseQuestion = new TrueFalseQuestion(
      '',
      false,
      'correct',
      'incorrect'
    );
    const response = getTrueFalseFeedback(question, 'cat');
    expect(response).toEqual(question.incorrectAnswerAudio);
  });
});

describe('Feedback for Multiple Choice Question', () => {
  test('If answer is A get A Audio', () => {
    const question: MultipleChoiceQuestion = new MultipleChoiceQuestion(
      '',
      '',
      'AAudio',
      'BAudio',
      'CAudio',
      'DAudio'
    );
    const response = getMultipleChoiceFeedback(question, 'A');
    expect(response).toEqual(question.AAudio);
  });

  test('If answer is B get B Audio', () => {
    const question: MultipleChoiceQuestion = new MultipleChoiceQuestion(
      '',
      '',
      'AAudio',
      'BAudio',
      'CAudio',
      'DAudio'
    );
    const response = getMultipleChoiceFeedback(question, 'B');
    expect(response).toEqual(question.BAudio);
  });

  test('If answer is C get C Audio', () => {
    const question: MultipleChoiceQuestion = new MultipleChoiceQuestion(
      '',
      '',
      'AAudio',
      'BAudio',
      'CAudio',
      'DAudio'
    );
    const response = getMultipleChoiceFeedback(question, 'C');
    expect(response).toEqual(question.CAudio);
  });

  test('If answer is D get D Audio', () => {
    const question: MultipleChoiceQuestion = new MultipleChoiceQuestion(
      '',
      '',
      'AAudio',
      'BAudio',
      'CAudio',
      'DAudio'
    );
    const response = getMultipleChoiceFeedback(question, 'D');
    expect(response).toEqual(question.DAudio);
  });
});