import { NicheCurriculum, InterleavedFeedItem, StaminaGate } from '@/types';

/**
 * Generates an interleaved round-robin sequence of cards for active nodes
 * across all selected niches, starting from the current cardsViewed offsets.
 */
export function generateInterleavedQueue(
  selectedNiches: string[],
  unlockedNodesMap: Record<string, { nodeIndex: number; cardsViewed: number }>,
  curriculaMap: Record<string, NicheCurriculum>,
  gate: StaminaGate
): InterleavedFeedItem[] {
  // Collect remaining cards for the current active node of each niche
  const activeNicheQueues: Array<{
    nicheId: string;
    nicheTitle: string;
    nodeIndex: number;
    cards: any[];
    startingViewed: number;
  }> = [];

  for (const nicheId of selectedNiches) {
    const curriculum = curriculaMap[nicheId];
    if (!curriculum) continue;

    const progress = unlockedNodesMap[nicheId] || { nodeIndex: 0, cardsViewed: 0 };
    const activeNode = curriculum.nodes[progress.nodeIndex];
    if (!activeNode) continue; // Niche fully completed (no active node)

    // Slice only the cards that the student has not yet viewed in this node
    const remainingCards = activeNode.cards.slice(progress.cardsViewed);

    if (remainingCards.length > 0) {
      activeNicheQueues.push({
        nicheId,
        nicheTitle: curriculum.title,
        nodeIndex: progress.nodeIndex,
        cards: remainingCards,
        startingViewed: progress.cardsViewed,
      });
    }
  }

  if (activeNicheQueues.length === 0) {
    return [];
  }

  const queue: InterleavedFeedItem[] = [];

  // Determine the maximum length of remaining cards in any niche
  const maxLength = Math.max(...activeNicheQueues.map((q) => q.cards.length));

  // Interleave round-robin card by card
  for (let cardOffset = 0; cardOffset < maxLength; cardOffset++) {
    for (const nicheQueue of activeNicheQueues) {
      if (cardOffset < nicheQueue.cards.length) {
        const originalCard = nicheQueue.cards[cardOffset];
        const content = originalCard.variants[gate] || originalCard.variants.short;

        queue.push({
          _id: originalCard.id,
          type: 'card',
          nicheId: nicheQueue.nicheId,
          nodeIndex: nicheQueue.nodeIndex,
          conceptKey: originalCard.conceptKey,
          order: nicheQueue.startingViewed + cardOffset + 1, // 1-indexed relative card position in node
          gate,
          content,
        });
      }
    }
  }

  return queue;
}
