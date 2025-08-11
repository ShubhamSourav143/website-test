export function parsePaymentCode(codeRaw: string): number | null {
  const code = (codeRaw || '').trim().toUpperCase();
  if (!code.startsWith('R')) return null;
  const num = Number(code.slice(1));
  if (!Number.isFinite(num) || num < 1) return null;
  return Math.floor(num);
}

export function isFakePaymentsEnabled(): boolean {
  // Default enabled unless explicitly disabled
  return process.env.NEXT_PUBLIC_USE_FAKE_PAYMENTS !== 'false';
}


