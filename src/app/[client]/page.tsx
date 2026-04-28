import { promises as fs } from 'fs';
import path from 'path';
import MediaKitView from './MediaKitView';

// Next.js App Router Static Export requires this for dynamic routes
export async function generateStaticParams() {
  const dataDirectory = path.join(process.cwd(), 'src/data/clients');
  try {
    const filenames = await fs.readdir(dataDirectory);
    return filenames
      .filter((name) => name.endsWith('.json'))
      .map((name) => ({
        client: name.replace(/\.json$/, ''),
      }));
  } catch (error) {
    console.error("Error reading clients directory", error);
    return [];
  }
}

export default async function ClientPage({ params }: { params: Promise<{ client: string }> }) {
  const resolvedParams = await params;
  const dataDirectory = path.join(process.cwd(), 'src/data/clients');
  const filePath = path.join(dataDirectory, `${resolvedParams.client}.json`);
  
  let data;
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    data = JSON.parse(fileContents);
  } catch (error) {
    return <div>Error: Client data not found.</div>;
  }

  return <MediaKitView data={data} />;
}
