import axios from "axios";

export async function chatCompletion(promptRoles: any) {
  const apiUrl = "https://api.openai.com/v1/chat/completions";

  const requestData = {
    model: "gpt-3.5-turbo",
    messages: promptRoles,
    temperature: .9,
  };

  try {
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
      },
    });
    const assistantResponse = (await response.data.choices[0]?.message
      ?.content) || {
      from: "system",
      text: "I'm sorry, I don't understand. Can you please rephrase your question?",
    };
    if (assistantResponse) {
      return assistantResponse
    } else {
      console.error("Assistant response is null or empty");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
}
