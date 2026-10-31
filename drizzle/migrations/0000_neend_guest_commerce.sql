CREATE TABLE public.guest_carts (capability_hash text PRIMARY KEY, lines jsonb NOT NULL DEFAULT '{}'::jsonb, updated_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.guest_carts TO service_role;
ALTER TABLE public.guest_carts ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.newsletter_requests (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text NOT NULL UNIQUE, consent_version text NOT NULL, requested_at timestamptz NOT NULL DEFAULT now(), status text NOT NULL DEFAULT 'pending_sender');
GRANT ALL ON public.newsletter_requests TO service_role;
ALTER TABLE public.newsletter_requests ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.request_limits (key text PRIMARY KEY, count integer NOT NULL DEFAULT 0, window_start timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.request_limits TO service_role;
ALTER TABLE public.request_limits ENABLE ROW LEVEL SECURITY;
CREATE FUNCTION public.consume_request_limit(p_key text, p_limit integer, p_seconds integer) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r public.request_limits;
BEGIN
INSERT INTO public.request_limits(key,count) VALUES(p_key,0) ON CONFLICT DO NOTHING;
SELECT * INTO r FROM public.request_limits WHERE key=p_key FOR UPDATE;
IF r.window_start < now() - make_interval(secs => p_seconds) THEN UPDATE public.request_limits SET count=1,window_start=now() WHERE key=p_key; RETURN true; END IF;
IF r.count >= p_limit THEN RETURN false; END IF;
UPDATE public.request_limits SET count=count+1 WHERE key=p_key; RETURN true;
END $$;
REVOKE ALL ON FUNCTION public.consume_request_limit(text,integer,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.consume_request_limit(text,integer,integer) TO service_role;
CREATE FUNCTION public.change_guest_cart(p_hash text,p_product text DEFAULT NULL,p_delta integer DEFAULT 0) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE r public.guest_carts; n integer;
BEGIN
INSERT INTO public.guest_carts(capability_hash) VALUES(p_hash) ON CONFLICT DO NOTHING;
SELECT * INTO r FROM public.guest_carts WHERE capability_hash=p_hash FOR UPDATE;
IF p_product IS NOT NULL THEN
IF p_product NOT IN ('kit','blanket','pillow','mist') OR p_delta NOT IN (-1,0,1) THEN RAISE EXCEPTION 'Invalid cart change'; END IF;
n := CASE WHEN p_delta=0 THEN 0 ELSE COALESCE((r.lines->>p_product)::integer,0)+p_delta END;
IF n > 99 THEN RAISE EXCEPTION 'Quantity limit reached'; END IF;
IF n <= 0 THEN r.lines := r.lines - p_product; ELSE r.lines := jsonb_set(r.lines,ARRAY[p_product],to_jsonb(n)); END IF;
UPDATE public.guest_carts SET lines=r.lines, updated_at=now() WHERE capability_hash=p_hash;
END IF;
RETURN r.lines;
END $$;
REVOKE ALL ON FUNCTION public.change_guest_cart(text,text,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.change_guest_cart(text,text,integer) TO service_role;