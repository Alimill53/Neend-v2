import { describe, it, expect } from 'vitest';
import { catalog, separateTotal, saving, subtotal, isValidPincode } from '@/lib/catalog';
describe('Neend pricing', () => {
  it('prices the blanket at ₹4,999', () => expect(catalog.blanket.pricePaise).toBe(499900));
  it('prices the pillow at ₹1,799', () => expect(catalog.pillow.pricePaise).toBe(179900));
  it('prices the mist at ₹599', () => expect(catalog.mist.pricePaise).toBe(59900));
  it('prices the Kit at ₹6,499', () => expect(catalog.kit.pricePaise).toBe(649900));
  it('computes the separate total as ₹7,397', () => expect(separateTotal).toBe(739700));
  it('computes the saving as ₹898', () => expect(saving).toBe(89800));
  it('charges only sellable cart items', () => {
    expect(subtotal({ kit: 1, blanket: 1 })).toBe(1149800);
    expect(subtotal({ kit: 1, blanket: 2 })).toBe(1649700);
    expect(subtotal({ kit: 1 })).toBe(649900);
  });
  it('rejects malformed pincodes without implying delivery', () => {
    expect(isValidPincode('12345')).toBe(false);
    expect(isValidPincode('000000')).toBe(false);
    expect(isValidPincode('560001')).toBe(true);
  });
});