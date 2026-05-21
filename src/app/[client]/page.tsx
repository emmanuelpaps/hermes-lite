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
      title: data.meta?.title || `Propuesta para ${data.clientName} | Frontera Número Uno`,
      description: data.meta?.description || `Ecosistema Digital Exclusivo para ${data.clientName}, desarrollado por Frontera Número Uno y Apolograma.`,
      colorScheme: data.theme?.mode === 'light' ? 'light' : 'dark',
      openGraph: {
        title: data.meta?.title || `Propuesta Ejecutiva: ${data.clientName}`,
        description: data.meta?.description || `Ecosistema Digital Exclusivo para ${data.clientName}, desarrollado por Frontera Número Uno y Apolograma.`,
        images: [
          {
            url: data.meta?.ogImage ? `https://fronteranumero1.tecza.com.mx${data.meta.ogImage}` : (data.clientLogo ? `https://fronteranumero1.tecza.com.mx${data.clientLogo}` : `https://fronteranumero1.tecza.com.mx/assets/fn1-logo-stacked.png`),
            alt: `Propuesta para ${data.clientName}`,
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
    
    // Theme Engine: Inject Master Design System if template is specified
    if (data.themeTemplate) {
      try {
        const designPath = path.join(process.cwd(), 'src/data/designs', `${data.themeTemplate}.json`);
        const designContents = await fs.readFile(designPath, 'utf8');
        const designData = JSON.parse(designContents);
        data.theme = { ...designData, ...data.theme }; // Client theme overrides master template
      } catch (e) {
        console.warn(`Master theme ${data.themeTemplate} not found.`);
      }
    }
  } catch (error) {
    return <div>Error: Client data not found.</div>;
  }

  return <MediaKitView data={data} />;
}
