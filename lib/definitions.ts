// 定義通用資料介面

// 服務項目 (目前為靜態資料)
export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  image?: string;
}

// 建案實績 (對應 Database Schema, 但也可先用於靜態資料)
export interface Project {
  id: string;
  slug: string; // 用於網址: /projects/house-in-forest
  title: string;
  description: string; // 簡短描述
  content?: string; // 完整介紹 Markdown
  location?: string;
  category: string; // 住宅, 公共, 商業...
  completionDate?: string; // YYYY-MM
  coverImage: string;
  images: string[]; // 相簿
  isFeatured?: boolean; // 是否顯示在首頁
}
