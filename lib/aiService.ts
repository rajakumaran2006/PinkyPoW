export async function getGroqCompletion(prompt: string) {
  // Implementation here
}
export async function getGeminiCompletion(prompt: string) {
  console.log('Falling back to Gemini...');
  return { text: "Response from Gemini" };
}
