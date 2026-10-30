export function openFestiAIChat(prompt?: string): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-festi-chat', { detail: { prompt } }));
  }
}
