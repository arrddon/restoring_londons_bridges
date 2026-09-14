import BridgeApp from '@/components/bridge-app';
import { redirect } from 'next/navigation';
import { bridges } from '@/lib/bridge-config';
import { pageTitle } from '@/lib/page-title';
export async function generateMetadata({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return { title: pageTitle(path, bridges) };
}
export default async function Page({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const legacy = { 'bridge-a': 'AlbertBridge', 'bridge-b': 'HammersmithBridge' }[path[0]];
  if (legacy) redirect(`/${[legacy, ...path.slice(1)].map(encodeURIComponent).join('/')}`);
  return <BridgeApp path={path} />;
}
