export interface MockStellarTransaction {
  id: string;
  timestamp: string; // ISO 8601 format
  type: 'payment' | 'deposit' | 'withdrawal' | 'trade' | 'other';
  status: 'success' | 'failed' | 'pending';
  amount: number;
  asset: string; // e.g., 'XLM', 'USDC', 'BTC'
  sourceAccount?: string;
  destinationAccount?: string;
  memo?: string;
}

// Generate more realistic mock data spanning different times and assets
const generateMockData = (days = 90): MockStellarTransaction[] => {
  const data: MockStellarTransaction[] = [];
  const now = new Date();
  const assets = ['XLM', 'USDC', 'USD', 'EUR'];
  const types: MockStellarTransaction['type'][] = ['payment', 'deposit', 'withdrawal', 'trade'];
  const statuses: MockStellarTransaction['status'][] = ['success', 'success', 'success', 'failed', 'pending']; // Weighted towards success

  for (let i = 0; i < days * 5; i++) { // Generate ~5 transactions per day
    const randomDaysAgo = Math.floor(Math.random() * days);
    const randomHour = Math.floor(Math.random() * 24);
    const randomMinute = Math.floor(Math.random() * 60);
    const timestamp = new Date(now);
    timestamp.setDate(timestamp.getDate() - randomDaysAgo);
    timestamp.setHours(randomHour, randomMinute, 0, 0);

    const asset = assets[Math.floor(Math.random() * assets.length)];
    const amount = parseFloat((Math.random() * (asset === 'XLM' ? 5000 : 1000) + (asset === 'XLM' ? 10 : 1)).toFixed(2));

    data.push({
      id: `tx_${i}_${Date.now()}`,
      timestamp: timestamp.toISOString(),
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      amount: amount,
      asset: asset,
      sourceAccount: `G...SOURCE${i % 10}`,
      destinationAccount: `G...DEST${i % 5}`,
      memo: Math.random() > 0.7 ? `Memo ${i}` : undefined,
    });
  }
  return data.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()); // Sort chronologically
};

export const mockStellarTransactions: MockStellarTransaction[] = generateMockData(); 