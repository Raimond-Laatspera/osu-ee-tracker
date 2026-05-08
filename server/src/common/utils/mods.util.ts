export const MOD_BITS: Record<number, string> = {
  1: 'NF',
  2: 'EZ',
  4: 'TD',
  8: 'HD',
  16: 'HR',
  32: 'SD',
  64: 'DT',
  128: 'RX',
  256: 'HT',
  512: 'NC', // always paired with DT (512+64)
  1024: 'FL',
  2048: 'AT',
  4096: 'SO',
  8192: 'AP',
  16384: 'PF', // always paired with SD
  32768: '4K',
  65536: '5K',
  131072: '6K',
  262144: '7K',
  524288: '8K',
  1048576: 'FI',
  2097152: 'RD',
  16777216: '9K',
};

export function parseMods(bitfield: number): string[] {
  if (!bitfield) return [];
  return Object.entries(MOD_BITS)
    .filter(([bit]) => (bitfield & Number(bit)) !== 0)
    .map(([, name]) => name);
}
