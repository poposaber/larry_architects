import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { logout } from '@/lib/actions';
import { DashboardCard } from '@/components/admin/DashboardCard';

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
            <DashboardCard
              title="最新消息管理"
              description="發布與編輯最新的事務所動態。"
              href="/admin/news"
              linkText="前往管理"
            />
            <DashboardCard
              title="作品集管理"
              description="新增、編輯建築作品與專案。"
              href="/admin/projects"
              linkText="前往管理"
            />
            <DashboardCard
              title="服務項目管理"
              description="更新我們提供的建築服務內容。"
              href="/admin/services"
              linkText="前往管理"
            />
            <DashboardCard
              title="頁面內容管理"
              description="編輯事務所簡介、未來期許等靜態頁面內容。"
              href="/admin/page-contents"
              linkText="前往管理"
            />
            <DashboardCard
              title="聯絡表單訊息"
              description="查看來自官網的訪客留言。"
              href="/admin/contacts"
              linkText="前往查看"
            />
        </div>
      </div>
    </div>
  );
}
