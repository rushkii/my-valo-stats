import {
  CanvasGradient,
  CanvasPattern,
  CanvasTextAlign,
  CanvasTextBaseline,
  TextMetrics
} from 'canvas';

export type MeasureType = TextMetrics & {
  emHeightAscent?: number;
  emHeightDescent?: number;
  alphabeticBaseline?: number;
};

export interface DrawRoundedRectOpts {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}

export interface MatchType {
  matchId: string;
  queueType: string;
  queueTypeLoc: string;
  gameLengthMillis: number;
  gameStartMillis: number;
  matchResult: string;
  mapTitleLoc: string;
  mapBackground: string;
  mapBackgroundSplash: string;
  wins: number;
  loses: number;
  participants: ParticipantType[];
  platformType: string;
}

export interface ParticipantType {
  playerPUUID: string;
  playerName: string;
  rank: {
    rank: number;
    rankName: string;
  };
  accountLevel: number;
  agentIcon: string;
  agentNameLoc: string;
  team: string;
  kda: string;
  score: number;
  econRating: number;
  plants: number;
  defuses: number;
  firstBlood: number;
  isExpandable: boolean;
}

export type ContentElement = ExtractedElement | string;
export interface ExtractedElement {
  tagName: string;
  attributes: { [key: string]: string | undefined };
  content: ContentElement[];
}

export interface WriteTextWithRoundedOpts {
  text: string;
  font: string;
  textColor: string | CanvasGradient | CanvasPattern;
  backgroundColor: string | CanvasGradient | CanvasPattern;
  align: CanvasTextAlign;
  baseline: CanvasTextBaseline;
  x: number;
  y: number;
  padding: number;
  radius: number;
}
