export type Tinterview = {
  from: string;
  text: string;
  time?: string;
};
export type PromptSetup = {
  role?: string;
  workPlace?: string;
  maxQuestions?: number|string;
};

export type TLocalStorage = {
  id: string;
  promptInformation: PromptSetup;
  interview: Tinterview[];
};

export type ConstructPromptType = PromptSetup & {
  history: Tinterview[];
  additionalInformation?: string|null
};

export type ConstructPromptTypeBurst = PromptSetup&{
  question:string,
  answer?:string,
}