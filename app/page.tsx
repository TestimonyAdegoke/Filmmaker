import PortfolioShell from '@/components/portfolio-shell';
import { getProjects, getSettings, getTracks } from '@/lib/content';

export const revalidate = 60;

export default async function HomePage() {
  const [projects, tracks, settings] = await Promise.all([getProjects(), getTracks(), getSettings()]);
  return <PortfolioShell projects={projects} tracks={tracks} settings={settings}/>;
}
