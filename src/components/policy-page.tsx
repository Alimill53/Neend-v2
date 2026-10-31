import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { SiteHeader, SiteFooter } from './shop-provider';
export function PolicyPage({ title, children }: { title: string; children: ReactNode }) {
  return <><SiteHeader /><main className="page-container policy-page"><Link to="/" className="text-link">Back to Neend Co.</Link><h1>{title}</h1><p className="policy-status">Draft · awaiting approval</p><div className="policy-content">{children}</div></main><SiteFooter /></>;
}