// 避免被 Next.js 靜態生成誤判
export const dynamic = 'force-dynamic';

import { handlers } from '@/lib/auth';
export const { GET, POST } = handlers;
