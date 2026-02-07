import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowLeft, Building2, Calendar, MapPin } from 'lucide-react';
import { deleteProject } from '@/lib/actions';
import { getProjects } from '@/lib/actions';


export default async function ProjectsListPage() {
  const projects = await getProjects();

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
                    <Building2 className="w-8 h-8 text-orange-600" />
                    作品集管理
                    </h1>
                    <p className="text-zinc-500 mt-2">新增、編輯或刪除建築專案。</p>
                </div>
                <Link
                    href="/admin/projects/new"
                    className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-1" /> 新增作品
                </Link>
            </div>
        </header>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 font-medium">
                        <tr>
                            <th className="px-6 py-4">專案名稱</th>
                            <th className="px-6 py-4">分類</th>
                            <th className="px-6 py-4">地點 / 完工日期</th>
                            <th className="px-6 py-4 text-center">狀態</th>
                            <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {projects.map((project) => (
                            <tr key={project.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-zinc-900 dark:text-white text-base">
                                        {project.title}
                                    </div>
                                    <div className="text-zinc-500 text-xs mt-1 font-mono">
                                        /{project.slug}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                                        {project.category}
                                     </span>
                                </td>
                                <td className="px-6 py-4 text-zinc-500">
                                    <div className="flex items-center gap-1 mb-1">
                                        <MapPin className="w-3.5 h-3.5" /> {project.location || '-'}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs">
                                        <Calendar className="w-3.5 h-3.5" /> {project.completionDate || '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {project.isFeatured && (
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                                            精選
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/projects/${project.id}`}
                                            className="p-2 text-zinc-400 hover:text-orange-600 transition-colors"
                                            title="編輯"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <form action={deleteProject}>
                                            <input type="hidden" name="id" value={project.id} />
                                            <button 
                                                className="p-2 text-zinc-400 hover:text-red-600 transition-colors"
                                                title="刪除"
                                                type="submit"
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
            
            {projects.length === 0 && (
                <div className="p-12 text-center text-zinc-500">
                    目前沒有任何作品資料，點擊右上角新增。
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
