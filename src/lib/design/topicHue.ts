/**
 * Maps a topic string or slug to its designated CSS variable name.
 * Every component requiring topic color MUST call this function.
 */
export function hueForTopic(topic: string = ''): string {
  const t = topic.toLowerCase();
  
  if (t.includes('ai') || t.includes('tech') || t.includes('software') || t.includes('cyber') || t.includes('code') || t.includes('model')) {
    return '--hue-tech';
  }
  if (t.includes('psych') || t.includes('mind') || t.includes('focus') || t.includes('cognitive') || t.includes('stoic') || t.includes('brain')) {
    return '--hue-psych';
  }
  if (t.includes('marketing') || t.includes('growth') || t.includes('viral') || t.includes('distribution') || t.includes('startup')) {
    return '--hue-marketing';
  }
  if (t.includes('writing') || t.includes('content') || t.includes('prose') || t.includes('essay') || t.includes('literature')) {
    return '--hue-writing';
  }
  if (t.includes('money') || t.includes('business') || t.includes('econ') || t.includes('price') || t.includes('pricing') || t.includes('market') || t.includes('finance')) {
    return '--hue-money';
  }
  if (t.includes('space') || t.includes('astro') || t.includes('physics') || t.includes('science') || t.includes('cosm')) {
    return '--hue-space';
  }
  if (t.includes('health') || t.includes('bio') || t.includes('longevity') || t.includes('neuro')) {
    return '--hue-health';
  }

  return '--hue-default';
}
