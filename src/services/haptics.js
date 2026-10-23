import { selectionFeedback } from '../services/haptics';
export async function selectionFeedback() {
  try {
    await Haptics.selectionAsync();
  } catch (error) {
  }
}
