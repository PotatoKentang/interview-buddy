import { ConstructPromptType, Tinterview } from "../types";

export const constructInterviewPrompt = async ({
  role,
  workPlace,
  maxQuestions,
  history,
  additionalInformation
}: ConstructPromptType) => {
  let userPrompt = "start interview"; // Default user prompt if history is empty
  let historicalInterview: Tinterview[] = [];

  // Check if there is a user prompt in the history
  if (history && history.length > 0) {
    userPrompt = history[history.length - 1].text;
    historicalInterview = history.slice(0, history.length - 1);
  }

  // Create the assistant's content string
  let assistantContent = "";

  assistantContent += `History: ${JSON.stringify(historicalInterview)}`;

  if (additionalInformation) {
    assistantContent += `Additional Information: [${additionalInformation}]\n`;
  }

  return [
    {
      role: "system",
      content: `Welcome to the simulated interview for the role of ${role} at ${workPlace}. You are the interviewer, and your task is to conduct a productive interview. Please follow these guidelines:
        1. Conversation Flow: Maintain a natural and engaging conversation by asking relevant questions based on the interviewee's responses and providing context from the provided history.
        2. Avoid Repetition: Ensure that you don't repeat the same question. Keep the conversation dynamic.
        3. Max Questions: You are limited to asking a maximum of ${maxQuestions} questions.
        4. Maintain a professional tone throughout the interview.
        Let's begin the interview or continue if it's already ongoing.`,
    },
    {
      role: "assistant",
      content: assistantContent,
    },
    {
      role: "user",
      content: `${userPrompt}`,
    },
  ];
};
