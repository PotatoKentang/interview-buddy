import { create } from "zustand";
import { chatCompletion } from "../lib/chatgpt/chatCompletion";
import { constructEvaluationPrompt } from "../lib/chatgpt/constructEvaluationPrompt";
import { constructInterviewPrompt } from "../lib/chatgpt/constructInterviewPrompt";
import { PromptSetup, TLocalStorage, Tinterview } from "../lib/types"; // Corrected import path
import { getLocalStorageDataByID } from "../utils/local-storage";

interface Ztype {
  interview: Tinterview[];
  fetchInterviewHistory: (id: string | string[]) => Promise<void>;
  promptInformation: PromptSetup;
  setPromptInformation: (promptInformation?: PromptSetup) => void;
  additionalInformation: string | null; // Add this property
  setAdditionalInformation: (information: string | null) => void; // Add this method
  setInterview: (interview: Tinterview[]) => void;
  startInterview: () => Promise<string>;
  getInterviewResponse: (
    interviewAnswerByUser: undefined | Tinterview
  ) => Promise<string>;
}

const useInterviewStore = create<Ztype>((set, get) => ({
  interview: [
    {
      from: "system",
      text: `Great response! The interviewee provided a clear and detailed example of a challenge they faced while working on a frontend project and how they approached and resolved it. They identified the challenge of implementing a complex product filtering system for an e-commerce website and discussed the steps they took to address it.

      The interviewee's approach to requirements analysis and clear communication with the client shows their understanding of the importance of gathering and clarifying project requirements. The optimization of the data structure on the backend to handle a large product database demonstrates their ability to identify and address performance issues.

      The use of asynchronous AJAX requests, modular and reusable frontend components, and techniques like debouncing and throttling reflects the interviewee's proficiency in frontend technologies and best practices. The utilization of Redux for state management and real-time updates showcases their knowledge of state management solutions and their ability to handle complex interactions.

      The interviewee also mentioned testing and optimization as crucial aspects of their approach, highlighting their attention to quality assurance and performance optimization. The feedback-seeking approach and usability testing with potential users further demonstrate their commitment to delivering user-centric solutions.

      Overall, the interviewee provided a comprehensive and well-structured response, showcasing their problem-solving skills and ability to handle complex frontend challenges.

      Rating: 9/10

      Constructive feedback: The interviewee's response was excellent, providing a detailed explanation of their approach and resolution to the challenge. To further enhance their response, they could have also mentioned any specific tools or libraries they used for testing and performance profiling, as well as any specific performance improvements they made during the optimization process. Adding these details would have further highlighted their technical expertise in frontend development.`,
    },
  ],
  promptInformation: {
    role: "HRD",
    workPlace: "Google",
    maxQuestions: 2,
  },
  additionalInformation: null, // Initialize additionalInformation
  setAdditionalInformation: (information) => {
    set({ additionalInformation: information });
  },
  setPromptInformation: (promptInformation) => {
    set((state) => ({
      promptInformation: { ...state.promptInformation, ...promptInformation },
    }));
  },
  setInterview: (interview) => {
    set(() => ({ interview: interview }));
  },
  startInterview: async () => {
    const promptMessage = await constructInterviewPrompt({
      ...get().promptInformation,
      history: get().interview,
      additionalInformation: get().additionalInformation,
    });
    console.log(promptMessage);
    const response: string = await chatCompletion(promptMessage);
    set((state) => ({
      interview: [
        ...state.interview,
        { text: response, time: new Date().toISOString(), from: "interviewer" },
      ],
    }));
    return response;
  },
  getInterviewResponse: async (interviewAnswerByUser) => {
    // Save the interview answer provided by the user to the interview state
    console.log("this is the interview answer by user:", interviewAnswerByUser);
    if (interviewAnswerByUser != null) {
      set((state) => ({
        interview: [...state.interview, { ...interviewAnswerByUser }],
      }));
    }

    const maxQuestions = await get().interview.filter(
      (interviewData) => interviewData.from === "interviewer"
    ).length;
    let promptMessage;
    console.log("total asked question", maxQuestions);
    const isEvaluating =
      get().promptInformation.maxQuestions <=
      (maxQuestions || maxQuestions.toString());
    if (isEvaluating) {
      console.log("if prompt");
      promptMessage = await constructEvaluationPrompt({
        ...get().promptInformation,
        history: get().interview,
      });
    } else {
      console.log("else prompt");
      console.log(get().interview);
      promptMessage = await constructInterviewPrompt({
        ...get().promptInformation,
        history: get().interview,
        additionalInformation: get().additionalInformation,
      });
    }
    console.log(promptMessage);
    // Get the response from chatCompletion based on the constructed prompt
    const response: string = await chatCompletion(promptMessage);
    console.log("isEvaluating", isEvaluating);
    console.log("after parsing", response);
    // Save the bot's response to the interview state
    set((state) => ({
      interview: [
        ...state.interview,
        {
          text: response,
          time: new Date().toISOString(),
          from: isEvaluating ? "system" : "interviewer",
        },
      ],
    }));

    return response;
  },
  fetchInterviewHistory: async (id: string | string[]) => {
    const interviewHistory: TLocalStorage = await getLocalStorageDataByID(id);
    if (interviewHistory) {
      set((state) => ({
        interview: interviewHistory.interview,
        promptInformation: interviewHistory.promptInformation,
      }));
    } else {
      set((state) => ({
        interview: [],
      }));
    }
  },
}));

export default useInterviewStore;
