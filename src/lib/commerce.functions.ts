import { createServerFn } from '@tanstack/react-start';
import { getCookie, setCookie, getRequestHeader } from '@tanstack/react-start/server';
import { z } from 'zod';
import type { CartLines } from './catalog';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { CommerceSchema } from './commerce-schema';

async function hash(value: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
}

export const cartOperation = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ product: z.enum(['kit','blanket','pillow','mist']).optional(), delta: z.union([z.literal(-1),z.literal(0),z.literal(1)]).default(0) }))
  .handler(async ({ data }) => {
    let capability = getCookie('neend_cart');
    if (!capability || !/^[a-f0-9]{64}$/.test(capability)) {
      capability = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
      setCookie('neend_cart', capability, { httpOnly: true, sameSite: 'lax', secure: getRequestHeader('x-forwarded-proto') === 'https', path: '/', maxAge: 60 * 60 * 24 * 30 });
    }
    // Possession of the HttpOnly capability authorizes only this guest cart.
    const capabilityHash = await hash(capability);
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const commerce = supabaseAdmin as unknown as SupabaseClient<CommerceSchema>;
    const { data: allowed, error: limitError } = await commerce.rpc('consume_request_limit', { p_key: 'cart:' + capabilityHash, p_limit: 120, p_seconds: 60 });
    if (limitError) throw new Error('Saved carts are temporarily unavailable. Please try again later.');
    if (!allowed) throw new Error('Please wait a moment and try again.');
    const { data: lines, error } = await commerce.rpc('change_guest_cart', { p_hash: capabilityHash, p_product: data.product, p_delta: data.delta });
    if (error) throw new Error('Your cart could not be updated. Please try again.');
    return lines as CartLines;
  });

export const requestNewsletter = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ email: z.string().trim().email().max(254), consent: z.literal(true), website: z.string().max(0) }))
  .handler(async ({ data }) => {
    const ipHash = await hash(getRequestHeader('cf-connecting-ip') ?? getRequestHeader('x-forwarded-for') ?? 'unknown');
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const commerce = supabaseAdmin as unknown as SupabaseClient<CommerceSchema>;
    const { data: allowed, error: limitError } = await commerce.rpc('consume_request_limit', { p_key: 'newsletter:' + ipHash, p_limit: 10, p_seconds: 3600 });
    if (limitError) throw new Error('Newsletter requests are temporarily unavailable. Please try again later.');
    if (!allowed) throw new Error('Please try again later.');
    const { error } = await commerce.from('newsletter_requests').upsert({ email: data.email.toLowerCase(), consent_version: 'draft-interest-v1' }, { onConflict: 'email', ignoreDuplicates: true });
    if (error) throw new Error('We could not save your request. Please try again.');
    return { saved: true };
  });