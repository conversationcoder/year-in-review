import { Question, QuestionType } from '../models/questions';

import { Category } from '../models/categories';

const newsQuestions: Question[] = [
  new Question(
    'https://s3.eu-west-2.amazonaws.com/year-in-focus-audio/techOpener.mp3',
    'false',
    'https://s3.eu-west-2.amazonaws.com/year-in-focus-audio/techQ1Correct.mp3',
    'https://s3.eu-west-2.amazonaws.com/year-in-focus-audio/techQ1Incorrect.mp3',
    QuestionType.TRUEFALSE
  ),
  new Question(
    'https://s3.eu-west-2.amazonaws.com/year-in-focus-audio/techQ2.mp3',
    'true',
    'https://s3.eu-west-2.amazonaws.com/year-in-focus-audio/techQ2Correct.mp3',
    'https://s3.eu-west-2.amazonaws.com/year-in-focus-audio/techQ2Incorrect.mp3',
    QuestionType.TRUEFALSE
  ),
];

const newsCategory = () => new Category(newsQuestions);

export { newsCategory };
