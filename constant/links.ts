export const tts = (text: string) => {
  return `https://api.streamelements.com/kappa/v2/speech?voice=Sean&text=${text}`
}