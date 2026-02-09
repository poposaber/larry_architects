import { getServiceById } from '@/lib/actions';
import ServiceForm, { SerializedService } from '@/components/admin/service-form';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: PageProps) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    notFound();
  }

  const initialData: SerializedService = {
    ...service
  };

  return <ServiceForm mode="edit" initialData={initialData} />;
}