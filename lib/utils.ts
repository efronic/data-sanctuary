import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import OpenAI from 'openai';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export async function embed(text: string) {
  console.log('open ai key:', process.env.DATA_SANCTUARY_OPENAI_KEY);
  const openai = new OpenAI({ apiKey: process.env.DATA_SANCTUARY_OPENAI_KEY });
console.log('openai:', openai);
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  console.log('embedding:', embedding);
  return embedding.data[0].embedding;
}
