import { nanoid } from 'nanoid';
import { Url } from '../models/Url';

const SHORT_ID_LENGTH = 8;

export async function generateShortId(): Promise<string> {
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    const shortId = nanoid(SHORT_ID_LENGTH);
    const existing = await Url.findOne({ shortId });
    if (!existing) {
      return shortId;
    }
    attempts++;
  }

  throw new Error('Failed to generate unique shortId after multiple attempts');
}

