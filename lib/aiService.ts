// Added logging and latency metrics
export async function getGroqCompletion(prompt: string) {
  const start = Date.now();
  // groq logic
  console.log('Groq request took ' + (Date.now() - start) + 'ms');
}
