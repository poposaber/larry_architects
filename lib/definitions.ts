import { z } from 'zod';
// 從 Prisma 自動生成的 Client 匯入型別
import type { 
  Project as PrismaProject, 
  Service as PrismaService, 
  News as PrismaNews,
  PageContent as PrismaPageContent,
  Contact as PrismaContact,
  PageKey as PrismaPageKey,
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
export type PageKey = PrismaPageKey;

export const PageKey = {
  INTRO: 'INTRO',
  VISION: 'VISION',
} as const;

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

export const updateSchema = z.object({
  content: z.string().min(1, '內容不能為空'),
});

export const projectSchema = z.object({
  title: z.string().min(1, '標題為必填'),
  slug: z.string().min(1, 'Slug 為必填').regex(/^[a-z0-9-]+$/, 'Slug 只能包含小寫字母、數字與連字號'),
  category: z.string().min(1, '分類為必填'),
  description: z.string().min(1, '簡述為必填'),
  content: z.string().min(1, '內容為必填'),
  location: z.string().optional(),
  completionDate: z.string().optional(),
  coverImage: z.string().optional(),
  isFeatured: z.boolean().optional(),
});

export const newsSchema = z.object({
  title: z.string().min(1, '標題為必填'),
  slug: z.string().min(1, 'Slug 為必填').regex(/^[a-z0-9-]+$/, 'Slug 只能包含小寫字母、數字與連字號'),
  content: z.string().min(1, '內容為必填'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: '無效的日期格式',
  }),
  coverImage: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export const serviceSchema = z.object({
  title: z.string().min(1, '標題為必填'),
  slug: z.string().min(1, 'Slug 為必填').regex(/^[a-z0-9-]+$/, 'Slug 只能包含小寫字母、數字與連字號'),
  description: z.string().min(1, '簡述為必填'),
  content: z.string().min(1, '內容為必填'),
  coverImage: z.string().optional(),
});

// 定義頁面與標題的對應關係，方便顯示友善名稱
export const PAGE_TITLES: Record<string, string> = {
  [PageKey.INTRO]: '事務所簡介',
  [PageKey.VISION]: '未來期許',
};

// 定義每個頁面的簡短描述
export const PAGE_DESCRIPTIONS: Record<string, string> = {
  [PageKey.INTRO]: '編輯「關於我們」頁面中的事務所介紹文字。',
  [PageKey.VISION]: '編輯「關於我們」頁面中的願景與期許內容。',
};