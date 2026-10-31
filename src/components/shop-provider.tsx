import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { ShoppingBag, Minus, Plus, Trash2, LoaderCircle, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { catalog, money, subtotal, type CartLines, type ProductId } from '@/lib/catalog';
import { cartOperation } from '@/lib/commerce.functions';
import kitImage from '@/assets/neend-kit.jpg';
import blanketImage from '@/assets/neend-blanket.jpg';
import pillowImage from '@/assets/neend-pillow.jpg';
import mistImage from '@/assets/neend-mist.jpg';

export const productImages = { kit: kitImage, blanket: blanketImage, pillow: pillowImage, mist: mistImage };
type Shop = { lines: CartLines; open: boolean; setOpen: (v: boolean) => void; busy: boolean; error: string; change: (id: ProductId, delta: -1 | 0 | 1, reveal?: boolean) => Promise<void> };
const ShopContext = createContext<Shop | null>(null);
export function useShop() { const value = useContext(ShopContext); if (!value) throw new Error('Shop provider missing'); return value; }
export function ShopProvider({ children }: { children: ReactNode }) {
  const operation = useServerFn(cartOperation);
  const [lines, setLines] = useState<CartLines>({});
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const location = useLocation();
  useEffect(() => { operation({ data: { delta: 0 } }).then(setLines).catch(() => setError('Your saved cart is temporarily unavailable. Please try again.')); }, []);
  useEffect(() => { setOpen(false); }, [location.pathname]);
  async function change(id: ProductId, delta: -1 | 0 | 1, reveal = false) {
    setBusy(true); setError('');
    try {
      setLines(await operation({ data: { product: id, delta } }));
      if (reveal) { setOpen(true); setNotice(`${catalog[id].name} added to cart.`); }
    } catch (e) { setError(e instanceof Error ? e.message : 'Your cart could not be updated.'); }
    finally { setBusy(false); }
  }
  return <ShopContext.Provider value={{ lines, open, setOpen, busy, error, change }}>{children}
    <Sheet open={open} onOpenChange={setOpen}><SheetContent className="cart-sheet w-full sm:max-w-[480px]">
      <SheetTitle className="text-2xl font-medium">Your cart</SheetTitle><SheetDescription className="mt-2">A little space for a slower evening.</SheetDescription>
      {error && <p className="form-error" role="alert">{error}</p>}
      <p className="sr-only" aria-live="polite">{notice}</p>
      {!Object.keys(lines).length ? <div className="cart-empty"><ShoppingBag size={40} strokeWidth={1} /><h3>Your evening starts here.</h3><p>Your cart is empty.</p><Button onClick={() => { setOpen(false); window.location.assign('/#kit'); }}>Explore the Kit</Button></div> : <>
      <div className="cart-items">{Object.entries(lines).map(([key, qty]) => { const id = key as ProductId; return <div className="cart-item" key={id}>
        <img src={productImages[id]} alt={catalog[id].name} width={96} height={112} />
        <div className="min-w-0 flex-1"><h3>{catalog[id].name}</h3><p>{money(catalog[id].pricePaise)}</p><div className="quantity"><Button variant="ghost" size="icon" aria-label={`Decrease ${catalog[id].name} quantity`} disabled={busy} onClick={() => change(id,-1)}><Minus /></Button><span>{qty}</span><Button variant="ghost" size="icon" aria-label={`Increase ${catalog[id].name} quantity`} disabled={busy} onClick={() => change(id,1)}><Plus /></Button></div></div>
        <Button size="icon" variant="ghost" aria-label={`Remove ${catalog[id].name}`} disabled={busy} onClick={() => change(id,0)}><Trash2 /></Button>
      </div>; })}</div>
      <div className="cart-bottom"><div className="flex justify-between text-xl"><span>Subtotal</span><b>{money(subtotal(lines))}</b></div><p className="text-sm text-muted-foreground my-4">Delivery and tax details are awaiting confirmation. No payment will be taken.</p><Button asChild className="w-full"><Link to="/checkout">Review checkout</Link></Button>{busy && <LoaderCircle className="animate-spin mt-4" aria-label="Updating cart" />}</div></>}
    </SheetContent></Sheet>
  </ShopContext.Provider>;
}

export function SiteHeader({ referenceLayout = false }: { referenceLayout?: boolean }) {
  const { lines, setOpen } = useShop();
  const count = Object.values(lines).reduce((n, q) => n + (q ?? 0), 0);
  if (referenceLayout) return <header className="site-header reference-header"><div className="reference-header-top"><Button asChild variant="secondary" className="reference-header-kit"><a href="/#kit">Explore the Kit <ArrowUpRight /></a></Button><Link to="/" className="wordmark" aria-label="Neend Co. home">neend<span>co.</span></Link><div className="reference-header-right"><a href="/#about">Our story</a><Button variant="ghost" size="icon" aria-label={`Open cart, ${count} items`} onClick={() => setOpen(true)} className="relative"><ShoppingBag size={22} strokeWidth={1.5} />{count > 0 && <span className="cart-count">{count}</span>}</Button></div></div><nav className="reference-nav" aria-label="Main navigation"><a href="/#products">The essentials</a><a href="/#ritual">The evening ritual</a></nav></header>;
  return <header className="site-header"><div className="page-container header-inner"><Link to="/" className="wordmark" aria-label="Neend Co. home">neend<span>co.</span></Link><nav aria-label="Main navigation"><a href="/#about">Our story</a><a href="/#products">The essentials</a><a href="/#ritual">The evening ritual</a></nav><div className="header-actions"><Button asChild variant="editorial" className="header-kit"><a href="/#kit">Explore the Kit <ArrowUpRight /></a></Button><Button variant="ghost" size="icon" aria-label={`Open cart, ${count} items`} onClick={() => setOpen(true)} className="relative"><ShoppingBag size={22} strokeWidth={1.5} />{count > 0 && <span className="cart-count">{count}</span>}</Button></div></div></header>;
}
export function SiteFooter() {
  return <footer className="site-footer"><div className="page-container"><div className="footer-grid"><div><span className="eyebrow">Make room for evening</span><p className="footer-statement">Less rush.<br />More room.</p><a href="/#kit" className="footer-cta">Find your Wind Down Kit <ArrowUpRight /></a></div><div><h3>The evening essentials</h3><a href="/#kit">The Wind Down Kit</a><a href="/#products">Individual products</a><a href="/#sunday">Sleep Better Sunday</a></div><div><h3>The practical things</h3><Link to="/shipping">Shipping</Link><Link to="/returns">Returns</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div></div><Link to="/" className="footer-wordmark" aria-label="Neend Co. home">neend co.</Link><div className="footer-bottom"><span>© 2026 Neend Co.</span><span>For the quieter part of your day.</span></div></div></footer>;
}