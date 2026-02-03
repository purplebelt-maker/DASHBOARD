// lib/utils/probability.ts
export function getYesNoProbability(markets: any[]) {
  if (!markets || markets.length === 0) return null;

  const first = markets[0];
  if (!first?.outcomes || !first?.outcomePrices) return null;

  const outcomes = JSON.parse(first.outcomes);
  const prices = JSON.parse(first.outcomePrices);

  const yesIndex = outcomes.indexOf("Yes");
  const noIndex = outcomes.indexOf("No");

  return {
    yes: yesIndex !== -1 ? Number(prices[yesIndex]) : null,
    no: noIndex !== -1 ? Number(prices[noIndex]) : null,
  };
}

// Updated function to get generic outcomes
export function getOutcomeProbabilities(markets: any[]) {
  if (!markets || markets.length === 0) return null;

  const first = markets[0];
  if (!first?.outcomes || !first?.outcomePrices) return null;

  const outcomes = JSON.parse(first.outcomes);
  const prices = JSON.parse(first.outcomePrices);

  // Return first two outcomes (if they exist)
  if (outcomes.length < 2) return null;

  return {
    outcome1: {
      name: outcomes[0],
      probability: Number(prices[0]),
    },
    outcome2: {
      name: outcomes[1],
      probability: Number(prices[1]),
    },
  };
}
