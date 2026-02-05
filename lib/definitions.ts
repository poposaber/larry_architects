import { z } from 'zod';
// 從 Prisma 自動生成的 Client 匯入型別
import type { 
  Project as PrismaProject, 
  Service as PrismaService, 
  News as PrismaNews,
  PageContent as PrismaPageContent,
  Contact as PrismaContact,
  PageKey
} from '@/lib/generated/prisma/client';

// --------------------------------------------------------
// Database Types (直接映射資料庫結構)
// --------------------------------------------------------

// 將 Prisma 型別重新匯出，方便前端一致引用
// 如果將來需要對型別做擴充 (例如 Join 變數)，也可以在這裡繼承修改
export type Project = PrismaProject;
export type Service = PrismaService;
export type News = PrismaNews;
export type PageContent = PrismaPageContent;
export type Contact = PrismaContact;
export { PageKey };

// --------------------------------------------------------
// Zod Schemas (前端表單驗證規則)
// --------------------------------------------------------

// 聯絡我們表單
export const contactFormSchema = z.object({
  name: z.string().min(1, { message: "請輸入姓名" }),
  email: z.email({ message: "請輸入有效的電子郵件" }),
  phone: z.string().optional(),
  message: z.string().min(5, { message: "訊息內容請勿少於 5 字" }),
});

// 根據 Zod Schema 推導出的 TS 型別 (給 React Hook Form 用)
export type ContactFormInput = z.infer<typeof contactFormSchema>;
