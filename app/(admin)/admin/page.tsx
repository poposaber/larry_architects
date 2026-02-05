import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { logout } from '@/lib/actions';

export default async function AdminDashboard() {
  const session = await auth();
  
  // 雖然 middleware 已有保護，但為了雙重保險與型別安全
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">後台管理中心</h1>
                <p className="text-zinc-500 mt-2">歡迎回來，{session.user.name}</p>
            </div>
            <form action={logout}>
              <button className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                登出
              </button>
            </form>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dashboard Cards Placeholder */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">最新消息管理</h3>
                <p className="text-zinc-500 text-sm mb-4">發布與編輯最新的事務所動態。</p>
                <span className="text-orange-600 text-sm font-medium">前往管理 &rarr;</span>
            </div>
             <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">作品集管理</h3>
                <p className="text-zinc-500 text-sm mb-4">新增、編輯建築作品與專案。</p>
                <span className="text-orange-600 text-sm font-medium">前往管理 &rarr;</span>
            </div>
             <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">聯絡表單訊息</h3>
                <p className="text-zinc-500 text-sm mb-4">查看來自官網的訪客留言。</p>
                <span className="text-orange-600 text-sm font-medium">前往查看 &rarr;</span>
            </div>
        </div>
      </div>
    </div>
  );
}
