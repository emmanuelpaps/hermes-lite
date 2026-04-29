import { promises as fs } from 'fs';
import path from 'path';
import { Metadata } from 'next';
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

export async function generateMetadata({ params }: { params: Promise<{ client: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const dataDirectory = path.join(process.cwd(), 'src/data/clients');
  const filePath = path.join(dataDirectory, `${resolvedParams.client}.json`);
  
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return {
      title: `Propuesta para ${data.clientName} | Frontera Número Uno`,
      description: `Ecosistema Digital Exclusivo para ${data.clientName}, desarrollado por Frontera Número Uno y Apolograma.`,
      openGraph: {
        title: `Propuesta Ejecutiva: ${data.clientName}`,
        description: `Ecosistema Digital Exclusivo para ${data.clientName}, desarrollado por Frontera Número Uno y Apolograma.`,
        images: [
          {
            url: data.clientLogo || '/icon.png',
            width: 1200,
            height: 630,
            alt: `Logo de ${data.clientName}`,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: 'Media Kit | Frontera Número Uno',
    };
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
