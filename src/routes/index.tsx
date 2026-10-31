import { createFileRoute, Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, Check, LampDesk, Droplets, Armchair, Minus, Plus, LoaderCircle, Feather, Leaf, Wind, Footprints } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { SiteHeader, SiteFooter, useShop, productImages } from '@/components/shop-provider';
import { catalog, money, saving, separateTotal, type ProductId } from '@/lib/catalog';
import { requestNewsletter } from '@/lib/commerce.functions';
import heroImage from '@/assets/neend-editorial-hero.jpg';
import mobileHeroImage from '@/assets/neend-editorial-mobile.jpg';
import eveningImage from '@/assets/neend-evening.jpg';
import kitImage from '@/assets/neend-kit.jpg';

export const Route = createFileRoute('/')({
 head: () => ({ meta: [
  { title: 'Neend Co. — The Wind Down Kit | A slower evening' },
  { name: 'description', content: 'Make room for a quieter evening with Neend Co. Explore the Wind Down Kit: a blanket, a pillow and a mist, together for ₹6,499.' },
  { property: 'og:title', content: 'Neend Co. — The Wind Down Kit' },
  { property: 'og:description', content: 'A blanket, a pillow and a mist. A little space for a slower evening.' },
  { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
 ] }), component: Home,
});

function Home() {
 const { change, busy, error, open } = useShop();
 const [quantity, setQuantity] = useState(1);
 const [detail, setDetail] = useState('blanket');
 const [showSticky, setShowSticky] = useState(false);
 const heroButton = useRef<HTMLDivElement>(null);
 const kitControls = useRef<HTMLDivElement>(null);
 const newsletter = useRef<HTMLElement>(null);
 const scope = useRef<HTMLDivElement>(null);
 useEffect(() => {
  const visible = { heroPassed: false, kit: false, newsletter: false };
  const observer = new IntersectionObserver(entries => {
   for (const e of entries) {
    if (e.target === heroButton.current) visible.heroPassed = !e.isIntersecting && e.boundingClientRect.bottom < 0;
    if (e.target === kitControls.current) visible.kit = e.isIntersecting;
    if (e.target === newsletter.current) visible.newsletter = e.isIntersecting;
   }
   setShowSticky(visible.heroPassed && !visible.kit && !visible.newsletter);
  });
  [heroButton.current,kitControls.current,newsletter.current].forEach(el => { if(el) observer.observe(el); });
  return () => observer.disconnect();
 }, []);
 useEffect(() => {
  let dispose: (() => void) | undefined; let canceled = false;
  Promise.all([import('gsap'),import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
   if(canceled) return;
   gsap.registerPlugin(ScrollTrigger);
   const mm = gsap.matchMedia();
   mm.add('(prefers-reduced-motion: no-preference)', () => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-copy > *, .hero-aside', { y: 18, opacity: 0, duration: .9, stagger: .1, ease: 'power2.out' });
      gsap.from('.intro-statement', { y: 20, opacity: 0, duration: .8, scrollTrigger: { trigger: '.intro-section', start: 'top 85%', once: true } });
     gsap.from('.kit-reveal', { y: 16, opacity: 0, duration: .7, stagger: .08, ease: 'power2.out', scrollTrigger: { trigger: '#kit', start: 'top 85%', once: true } });
     gsap.from('.ritual-step', { y: 16, opacity: 0, duration: .7, stagger: .08, ease: 'power2.out', scrollTrigger: { trigger: '#ritual', start: 'top 80%', once: true } });
    },scope);
    return () => ctx.revert();
   });
   dispose = () => mm.revert();
  }).catch(() => {});
  return () => { canceled = true; dispose?.(); };
 }, []);
 async function addKit() { for(let i=0;i<quantity;i++) await change('kit',1,i===quantity-1); }
  return <div ref={scope} className="neend-home">
  <a href="#main" className="skip-link">Skip to content</a>
  <SiteHeader referenceLayout />
  <main id="main">
   <section className="hero" aria-labelledby="hero-title">
     <picture><source media="(max-width: 599px)" srcSet={mobileHeroImage} /><img className="hero-photo" src={heroImage} alt="A woman settling into a quiet window-side bedroom with a sage blanket, ivory pillow and amber mist bottle" width={1920} height={1024} fetchPriority="high" /></picture>
    <div className="page-container hero-inner"><div className="hero-copy">
      <span className="eyebrow hero-eyebrow">For the quieter part of your day</span>
      <h1 id="hero-title">Neend Co.</h1><h2>The Wind Down Kit.</h2>
      <div className="hero-aside"><p>A blanket, a pillow and a mist.<br />Three simple things.<br />One slower evening.</p><div className="hero-action-row"><div ref={heroButton}><Button asChild><a href="#kit">Get the Wind Down Kit <ArrowUpRight /></a></Button></div><Button asChild variant="editorial"><a href="#about" className="hero-scroll" aria-label="Discover Neend"><ArrowDown /> A little room to slow down</a></Button></div><span className="hero-price">The complete Kit · {money(catalog.kit.pricePaise)}</span></div>
     </div></div>
     <div className="hero-bottom page-container"><span>Less rush. More room.</span><span>Blanket / Pillow / Mist</span></div>
   </section>
    <section id="about" className="section intro-section"><div className="page-container"><div className="intro-layout"><span className="eyebrow">A little about Neend</span><div><h2 className="intro-statement">The day asks for a lot.<br />Your evening <span>doesn’t have to.</span></h2><div className="intro-bottom"><p>A few thoughtful essentials to make space for the quieter part of your day. No perfect routine. Just your own way to wind down.</p><a href="#products" className="text-link">Meet your evening essentials <ArrowUpRight /></a></div></div></div><div className="values-row"><span className="flex flex-col items-center gap-3"><Feather size={28} strokeWidth={1.5} aria-hidden="true" />A softer landing</span><span className="flex flex-col items-center gap-3"><Leaf size={28} strokeWidth={1.5} aria-hidden="true" />A simpler evening</span><span className="flex flex-col items-center gap-3"><Wind size={28} strokeWidth={1.5} aria-hidden="true" />A little space</span><span className="flex flex-col items-center gap-3"><Footprints size={28} strokeWidth={1.5} aria-hidden="true" />Your own pace</span></div></div></section>
   <section id="kit" className="section kit-section"><div className="page-container kit-grid">
    <div className="kit-reveal"><img src={kitImage} className="kit-image" alt="Folded sage blanket with an ivory pillow and a mist bottle on a bed" width={1024} height={1024} loading="lazy"/><p className="image-caption">A closer look at your evening essentials.</p></div>
     <div className="kit-copy kit-reveal"><span className="eyebrow">Better together</span><h2>The Wind<br />Down Kit.</h2><p>Three things. One slower evening.</p>
     <div className="kit-inclusions">{(['blanket','pillow','mist'] as ProductId[]).map(id => <div className="inclusion" key={id}><span><Check />{catalog[id].name}</span><span>{money(catalog[id].pricePaise)}</span></div>)}</div>
     <div className="price-line"><strong>{money(catalog.kit.pricePaise)}</strong><s aria-label="Price bought separately">{money(separateTotal)}</s></div><span className="saving">Save {money(saving)} when you choose the Kit</span>
      <div ref={kitControls} className="kit-actions"><div className="quantity"><Button variant="ghost" size="icon" aria-label="Decrease Kit quantity" disabled={quantity===1} onClick={() => setQuantity(q=>q-1)}><Minus/></Button><span aria-live="polite">{quantity}</span><Button variant="ghost" size="icon" aria-label="Increase Kit quantity" disabled={quantity>=99} onClick={() => setQuantity(q=>q+1)}><Plus/></Button></div><Button disabled={busy} onClick={addKit}>{busy && <LoaderCircle className="animate-spin"/>}Get the Wind Down Kit <ArrowUpRight /></Button></div>
     {error && <p role="alert" className="form-error">{error}</p>}
     <p className="purchase-note">Save it to your cart. Ordering opens once delivery and payment details are confirmed.</p>
    </div>
   </div></section>
    <section className="section detail-section"><div className="page-container detail-layout"><img src={productImages[detail as ProductId]} className="detail-photo" alt={`${detail === 'mist' ? 'Pillow mist bottle' : detail} detail in soft natural light`} width={800} height={600} loading="lazy"/><div className="detail-copy"><span className="eyebrow">Thoughtfully simple</span><h2>Little things.<br />A little more room.</h2><p>A few thoughtful essentials, with room to keep your evening simple.</p>
    <Tabs value={detail} onValueChange={setDetail}><TabsList aria-label="Explore products"><TabsTrigger value="blanket">Blanket</TabsTrigger><TabsTrigger value="pillow">Pillow</TabsTrigger><TabsTrigger value="mist">Mist</TabsTrigger></TabsList>
    <TabsContent value="blanket"><h3>A place to settle in.</h3><p className="mt-3">The blanket is one of the three pieces in the Wind Down Kit. Also available on its own.</p><p className="spec-line">Materials, weights and care: TODO_CONFIRM_WITH_CLIENT</p></TabsContent>
    <TabsContent value="pillow"><h3>Make a little room.</h3><p className="mt-3">A pillow for your evening corner. Choose it on its own or as part of the Kit.</p><p className="spec-line">Fabric, fill, dimensions and care: TODO_CONFIRM_WITH_CLIENT</p></TabsContent>
    <TabsContent value="mist"><h3>The finishing touch.</h3><p className="mt-3">The smallest piece in the Kit. Keep the manufacturer's directions close when you use it.</p><p className="spec-line">Ingredients, volume and directions: TODO_CONFIRM_WITH_CLIENT</p></TabsContent>
    </Tabs><a href="#products" className="text-link">Explore individual products</a>
   </div></div></section>
    <section id="ritual" className="section ritual-section"><div className="page-container"><div className="ritual-top"><div><span className="eyebrow">Your evening, unhurried</span><h2>Leave a little room<br />for doing less.</h2></div><p>No perfect routine.<br/>Just a little room to wind down.</p></div><img src={eveningImage} alt="A blanket and pillow on a window-side chair, with mist and a softly lit lamp nearby" width={1536} height={1024} loading="lazy" className="ritual-photo"/><div className="ritual-grid">
    {[[LampDesk,'Dim the lights.','Let the room feel a little quieter. Leave the rest of the day at the door.'],[Droplets,'A moment for the mist.','Follow the product directions when they are confirmed. Keep it simple.'],[Armchair,'Settle in.','A pillow, a blanket, and somewhere to put your phone aside.']].map(([Icon,title,text],i) => {const I=Icon as typeof LampDesk; return <article className="ritual-step" key={String(title)}><span>0{i+1}</span><I/><h3>{String(title)}</h3><p>{String(text)}</p></article>;})}
   </div></div></section>
    <section id="products" className="section"><div className="page-container"><div className="section-heading"><div><span className="eyebrow">The evening essentials</span><h2>Start with a little.</h2></div><p>Your evening, your essentials.<br />Pick a piece of the Kit.</p></div><div className="products-grid">
     {(['blanket','pillow','mist'] as ProductId[]).map((id,i) => <article key={id}><div className="product-image-wrap"><span className="product-number">0{i+1}</span><img className="product-photo" src={productImages[id]} alt={`${catalog[id].name}, shown in the provisional Kit photograph`} width={800} height={1000} loading="lazy"/><Button className="product-add" variant="editorial" size="icon" aria-label={`Add ${catalog[id].name} to cart`} disabled={busy} onClick={() => change(id,1,true)}><Plus /></Button></div><div className="product-info"><div className="product-title"><h3>{catalog[id].name}</h3><span>{money(catalog[id].pricePaise)}</span></div><p>{id==='blanket'?'A little room to settle in.':id==='pillow'?'Make your evening corner yours.':'The small finishing touch.'}</p></div></article>)}
   </div></div></section>
    <section id="sunday" ref={newsletter} className="section newsletter"><div className="page-container newsletter-grid"><div className="newsletter-copy"><span className="eyebrow">A quieter kind of inbox</span><h2>Sleep Better<br />Sunday.</h2><p>A small note for the quieter part of your week. Leave your email to express interest in Sunday evening notes.</p><p className="mt-4 text-sm">The newsletter is not sending yet. We'll keep your request until the details are ready.</p></div><NewsletterForm/></div></section>
    <section id="faq" className="section"><div className="page-container faq-grid"><div><span className="eyebrow">Good to know</span><h2>The practical<br />things.</h2><p>A few things to know before you settle in.</p></div><Accordion type="single" collapsible>
    {faq.map(([q,a],i)=><AccordionItem value={String(i)} key={q}><AccordionTrigger>{q}</AccordionTrigger><AccordionContent>{a}</AccordionContent></AccordionItem>)}
   </Accordion></div></section>
  </main><SiteFooter/>
  {showSticky && !open && <div className="sticky-purchase"><span>{money(catalog.kit.pricePaise)}</span><Button asChild><a href="#kit">Get the Wind Down Kit</a></Button></div>}
 </div>;
}
function NewsletterForm() {
 const submit = useServerFn(requestNewsletter);
 const [email,setEmail] = useState(''); const [consent,setConsent]=useState(false); const [website,setWebsite]=useState('');
 const [busy,setBusy]=useState(false); const [error,setError]=useState(''); const [saved,setSaved]=useState(false);
 return <form className="newsletter-form" noValidate onSubmit={async e=>{e.preventDefault();setError(''); if(!/^\S+@\S+\.\S+$/.test(email)){setError('Enter a valid email address.');return;} if(!consent){setError('Please agree to save your newsletter request.');return;} setBusy(true);try{await submit({data:{email,consent:true,website}});setSaved(true);}catch(e){setError(e instanceof Error?e.message:'We could not save your request.');}finally{setBusy(false);}}}>
  <label htmlFor="newsletter-email">Your email</label><input id="newsletter-email" type="email" autoComplete="email" className="field" placeholder="you@example.com" value={email} onChange={e=>{setEmail(e.target.value);setSaved(false);setError('');}} aria-describedby="newsletter-feedback" aria-invalid={Boolean(error)}/>
  <div hidden aria-hidden="true"><label htmlFor="website">Website</label><input id="website" value={website} onChange={e=>setWebsite(e.target.value)} tabIndex={-1}/></div>
  <label className="consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>I agree to have my email saved for this newsletter request. <Link to="/privacy" className="underline">Read the draft privacy notice.</Link></span></label>
  <Button className="submit" disabled={busy || saved}>{busy && <LoaderCircle className="animate-spin"/>}{saved?'Request saved':'Join Sleep Better Sunday'}</Button>
  <p id="newsletter-feedback" className={error?'form-error':'form-success'} aria-live="polite">{error || (saved?'Your interest is saved. No emails will be sent until the newsletter is ready.':'')}</p>
 </form>;
}
const faq = [
 ['Where do you deliver?', 'Delivery areas, fees and dispatch times are awaiting confirmation. We do not currently show estimated arrival dates. TODO_CONFIRM_WITH_CLIENT'],
 ['Can I return my order?', 'The return window, eligibility and process are being finalised. Ordering remains closed until the policy is approved. TODO_CONFIRM_WITH_CLIENT'],
 ['Is cash on delivery available?', 'Not yet. COD areas, fees and order limits must be confirmed before it is offered. TODO_CONFIRM_WITH_CLIENT'],
 ['Can I pay by UPI or card?', 'Payments are not enabled yet. No payment will be collected while the store is being prepared.'],
 ['Which blanket option should I choose?', 'Available weights, sizes and manufacturer guidance are awaiting confirmation. We do not recommend a blanket based on body weight. TODO_CONFIRM_WITH_CLIENT'],
 ['How do I care for the products?', 'Follow the manufacturer’s care instructions once supplied. Fabric, ingredients and care details have not yet been approved. TODO_CONFIRM_WITH_CLIENT'],
];
