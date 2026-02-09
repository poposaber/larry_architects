import { getServices, deleteService } from '@/lib/actions';
import { Plus, Pencil, Trash2, ArrowLeft, Briefcase } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <Link 
            href="/admin" 
            className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> 返回管理中心
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-orange-600" />
                服務項目管理
              </h1>
              <p className="text-zinc-500 mt-2">新增、編輯或刪除事務所提供的服務內容。</p>
            </div>
            <Link
              href="/admin/services/create"
              className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5 mr-1" /> 新增服務
            </Link>
          </div>
        </header>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 font-medium">
                <tr>
                  <th className="px-6 py-4">封面</th>
                  <th className="px-6 py-4">標題</th>
                  <th className="px-6 py-4">路徑 (Slug)</th>
                  <th className="px-6 py-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {services.map((service) => (
                  <tr key={service.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 w-24">
                      <div className="relative w-16 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-700">
                        {service.coverImage ? (
                          <Image
                            src={service.coverImage}
                            alt={service.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-zinc-400 bg-zinc-50 dark:bg-zinc-800">
                             <Briefcase className="w-4 h-4 opacity-20" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900 dark:text-white group-hover:text-orange-600 transition-colors">
                        {service.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 font-mono text-xs">
                      {service.slug}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/services/${service.id}`}
                          className="p-2 text-zinc-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-full transition-colors"
                          title="編輯"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <form action={deleteService}>
                          <input type="hidden" name="id" value={service.id} />
                          <button
                            type="submit"
                            className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                            title="刪除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {services.length === 0 && (
            <div className="p-12 text-center text-zinc-500">
              目前沒有任何服務項目，點擊右上角新增。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}