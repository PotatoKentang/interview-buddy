import { ConstructPromptTypeBurst } from "../types";

export const constructEvaluationPromptBurst = ({
  question,
  answer,
  role,
  workPlace
}: ConstructPromptTypeBurst) => {
  // Convert the history array to JSON format
  return [
    {
      role: "system",
      content: `Welcome to the Evaluation Interview. You are the evaluator system, and your task is to evaluate the interviewee's answer. Please follow these guidelines:
      1. Evaluate: provide a rating on a scale of 1-10, considering relevance, wording, and insights. Additionally, offer constructive feedback objectively based in the history response {from:"user"}.
      2. Don't ask for a follow up question.
    `,
    },
    {
      role: "assistant",
      content: question,
    },
    {
      role: "user",
      content: answer,
    },
  ];
};
