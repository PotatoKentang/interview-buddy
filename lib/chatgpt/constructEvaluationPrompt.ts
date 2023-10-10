import { ConstructPromptType } from "../types";

export const constructEvaluationPrompt = ({
  role,
  workPlace,
  maxQuestions,
  history,
}: ConstructPromptType) => {
  // Convert the history array to JSON format
  const historyJSON = JSON.stringify(history);

  return [
    {
      role: "system",
      content: `Welcome to the Evaluation Interview for the role of ${role} at ${workPlace}. You are the evaluator system, and your task is to evaluate the interviewee's performance. Please follow these guidelines:
      1. Evaluate: provide a rating on a scale of 1-10, considering relevance, wording, and insights. Additionally, offer constructive feedback objectively based in the history response {from:"user"}.
    `,
    },
    {
      role: "assistant",
      content: historyJSON,
    },
  ];
};
