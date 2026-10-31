export const catalog = {
  kit: { id: 'kit', name: 'Wind Down Kit', pricePaise: 649900 },
  blanket: { id: 'blanket', name: 'Blanket', pricePaise: 499900 },
  pillow: { id: 'pillow', name: 'Pillow', pricePaise: 179900 },
  mist: { id: 'mist', name: 'Pillow Mist', pricePaise: 59900 },
} as const;
export type ProductId = keyof typeof catalog;
export type CartLines = Partial<Record<ProductId, number>>;
export const separateTotal = catalog.blanket.pricePaise + catalog.pillow.pricePaise + catalog.mist.pricePaise;
export const saving = separateTotal - catalog.kit.pricePaise;
export const money = (paise: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paise / 100);
export const subtotal = (lines: CartLines) => Object.entries(lines).reduce((sum, [id, quantity]) => sum + catalog[id as ProductId].pricePaise * (quantity ?? 0), 0);
export const isValidPincode = (pin: string) => /^[1-9]\d{5}$/.test(pin);