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
