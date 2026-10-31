<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Preserve TanStack Start routing; shared commerce state and cart UI live in the root provider so cart contents survive navigation.
- Keep catalog prices in integer paise in one shared module so Kit savings and checkout subtotals cannot drift.
- Authorize guest carts through server-issued HttpOnly capabilities stored only as hashes in Cloud; never expose cart tables to anonymous Data API reads.
- Keep payment, delivery and newsletter sending unavailable until providers and approved business rules exist; durable newsletter interest requests are not active subscriptions.
- Load GSAP after hydration with matchMedia cleanup so SSR and reduced-motion visits remain fully readable.
- Scope homepage reference header and inset photographic hero to `.neend-home` and the SiteHeader referenceLayout option; supporting routes retain their existing header so commerce and policy navigation stay consistent.
- Use the explicit commerce schema contract for generated-client typing while hosted type regeneration is unavailable; replace it with regenerated types when Cloud resumes.
