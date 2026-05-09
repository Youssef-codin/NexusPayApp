export const CATS = [
  { id: 'subscription', label: 'SUBSCRIPTION' },
  { id: 'rent', label: 'RENT' },
  { id: 'shopping', label: 'SHOPPING' },
  { id: 'food', label: 'FOOD' },
  { id: 'transport', label: 'TRANSPORT' },
  { id: 'utilities', label: 'UTILITIES' },
  { id: 'entertainment', label: 'ENTERTAINMENT' },
  { id: 'other', label: 'OTHER' },
];

export const AVATAR_PALETTES = [
  { bg: '#00ff87', fg: '#000' },
  { bg: '#000', fg: '#00ff87' },
  { bg: '#e4e1e9', fg: '#000' },
  { bg: '#1a1a1a', fg: '#fff' },
];

export function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export const fmtEGP = (n: number) =>
  n.toLocaleString('en-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
