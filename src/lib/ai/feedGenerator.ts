import Anthropic from '@anthropic-ai/sdk';
import { FeedCardVariants } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Helper function to extract JSON from AI response (handles markdown code blocks and truncation)
function extractJSON(text: string): string {
  let cleaned = text.trim();
  const completeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (completeBlockMatch) {
    cleaned = completeBlockMatch[1].trim();
  } else {
    const incompleteBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*)/);
    if (incompleteBlockMatch) {
      cleaned = incompleteBlockMatch[1].trim();
    }
  }

  if (!cleaned.startsWith('{') && !cleaned.startsWith('[')) {
    const jsonStart = cleaned.search(/[{\[]/);
    if (jsonStart !== -1) {
      cleaned = cleaned.substring(jsonStart);
    }
  }

  return cleaned;
}

export async function generateTriVariantFeedCard(
  courseTitle: string,
  conceptTitle: string,
  conceptContent: string
): Promise<FeedCardVariants> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `You are an expert learning designer. Transform the following learning content into three variants for our "Stamina Feed" based on the student's active reading time:
- 'short' (Gate 1): Quick micro-learning hook (~15-30 words). Minimal reading effort. Designed for the start of the session.
- 'medium' (Gate 2): Expanded paragraph content (~80-150 words). Adds context and a real-world example.
- 'long' (Gate 3): Detailed mini-article / case study (~300-500 words). Highly informative with estimated reading time/progress.

Course: ${courseTitle}
Concept Topic: ${conceptTitle}
Content details:
${conceptContent}

Generate a JSON object containing exactly these three variants:
{
  "short": {
    "headline": "A catchy, short hook or question",
    "summary": "1-2 line tweet/quote style summary (15-30 words)",
    "takeaway": "Single short sentence key takeaway"
  },
  "medium": {
    "summary": "Core concept summary (30-50 words)",
    "explanation": "Clear explanation paragraph (50-80 words)",
    "bullets": ["Bullet point detail 1", "Bullet point detail 2"],
    "example": "A concrete, quick real-world example or code snippet"
  },
  "long": {
    "title": "An engaging, article-style title",
    "introduction": "Introductory paragraph (40-60 words)",
    "content": "A detailed, in-depth explanation or case study / code breakdown (200-350 words). Use markdown formatting like bold text or inline code if appropriate.",
    "takeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"]
  }
}

Return ONLY the raw valid JSON object. Do not include markdown code block syntax around the JSON itself.`,
      },
    ],
  });

  const textContent = response.content[0];
  if (textContent.type !== 'text') {
    throw new Error('Unexpected response type from AI');
  }

  try {
    const jsonText = extractJSON(textContent.text);
    const parsed = JSON.parse(jsonText);
    return parsed as FeedCardVariants;
  } catch (error) {
    console.error('Failed to parse AI tri-variant response:', textContent.text, error);
    throw new Error('Failed to parse tri-variant content');
  }
}
