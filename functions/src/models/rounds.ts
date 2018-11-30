import { Unknown } from './models';

class Rounds {
  private rounds: RoundCollection[];

  constructor(rounds: RoundCollection[]) {
    this.rounds = rounds;
  }

  public getRoundCollection(
    roundCollectionNumber: number
  ): OptionRoundCollection {
    if (roundCollectionNumber > this.rounds.length) {
      return new Unknown('out of bounds for round collection');
    } else {
      return this.rounds[roundCollectionNumber - 1];
    }
  }
}

class RoundCollection {
  constructor(
    public introductionAudio: string,
    public helpAudio: string,
    public repeatAudio: string,
    public noInputAudio: string,
    private topics: Set<Topic>
  ) {}

  public getTopics(): Set<Topic> {
    return this.topics;
  }
}

type OptionRoundCollection = RoundCollection | Unknown;

enum Topic {
  SPORT = 'sport',
  NEWS = 'news',
  SCIENCE = 'science',
  TECH = 'tech',
  POLITICS = 'politics',
}

export { Topic, Rounds, RoundCollection, OptionRoundCollection };
