import { getContacts, deleteContact } from '@/lib/actions';
import { Trash2, ArrowLeft, Mail, Phone, Clock, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default async function ContactsPage() {
  const contacts = await getContacts();

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
                <Mail className="w-8 h-8 text-orange-600" />
                聯絡表單訊息
              </h1>
              <p className="text-zinc-500 mt-2">查看與管理來自網站的聯絡訊息。</p>
            </div>
          </div>
        </header>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 font-medium">
                <tr>
                  <th className="px-6 py-4 w-48">姓名 / 聯絡方式</th>
                  <th className="px-6 py-4">訊息內容</th>
                  <th className="px-6 py-4 w-40">時間</th>
                  <th className="px-6 py-4 w-24 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 align-top">
                      <div className="font-medium text-zinc-900 dark:text-white mb-1">
                        {contact.name}
                      </div>
                      <div className="text-zinc-500 text-xs flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3" />
                          <a href={`mailto:${contact.email}`} className="hover:text-orange-600 hover:underline">
                            {contact.email}
                          </a>
                        </div>
                        {contact.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3" />
                            <a href={`tel:${contact.phone}`} className="hover:text-orange-600 hover:underline">
                              {contact.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">
                        {contact.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center text-zinc-500 text-xs">
                        <Clock className="w-3 h-3 mr-1.5" />
                        {new Date(contact.createdAt).toLocaleDateString('zh-TW', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                        <br />
                        {new Date(contact.createdAt).toLocaleTimeString('zh-TW', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top text-right">
                      <form action={deleteContact}>
                        <input type="hidden" name="id" value={contact.id} />
                        <button
                          type="submit"
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                          title="刪除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {contacts.length === 0 && (
            <div className="p-12 text-center text-zinc-500">
              <div className="flex justify-center mb-4">
                <MessageSquare className="w-12 h-12 text-zinc-200 dark:text-zinc-700" />
              </div>
              <p>目前沒有任何聯絡訊息。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}