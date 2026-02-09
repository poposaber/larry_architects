
import NewsForm from '@/components/admin/news-form';
import { getNewsById } from '@/lib/actions';
import { notFound } from 'next/navigation';

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const news = await getNewsById(id);

  if (!news) {
    notFound();
  }

  // Convert Date to string for serializable props
  const serializedNews = {
      ...news,
      date: news.date.toISOString(),
  };

  return <NewsForm mode="edit" initialData={serializedNews} />;
}
