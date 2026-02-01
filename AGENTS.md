# 專案概述
這是賴乾淵建築師事務所網頁的全端專案，使用 Next.js + PostgreSQL（資料庫服務採用 Docker Compose 自建 PostgreSQL 18.x；部署環境可替換為相容的雲端 PostgreSQL 服務），並且使用 Docker Compose 管理資料庫安裝。

## 技術棧使用
### Frontend
- Framework：Node.js v24.x (重要：不要使用 v18 的語法)
- Language：TypeScript v5.x（strict mode 必須開啟）
- Styling：TailWind CSS v3.x
- Forms：React Hook Form + Zod
- Image：next/image
- Markdown：react-markdown + @tailwindcss/typography
### Backend
- Database：PostgreSQL v18.x
- ORM：Prisma v7.3.x
- Auth：NextAuth (Auth.js)
- File Upload：本地 or S3 相容 (MinIO)
### Infrastructure
- 容器：Docker v29.x
- Orchestration：Docker Compose v5.x
- Env 管理：.env

## 禁止使用的套件
- Firebase / Supabase / Appwrite 等 BaaS（避免資料外流風險與供應商綁定）
- Sequelize（改用 Prisma 或 Drizzle，需先確認現有專案選型）
- any 等型別逃逸相關工具（例如 eslint-disable 全域關閉型別檢查）

## 專案結構
- app/：Next.js App Router
	- (public)/：公開頁面
	- (admin)/：後台頁面
	- api/：Route Handlers
- components/：可重用 UI 元件
- features/：以功能為單位的模組
- lib/：工具函式、資料庫與第三方整合
- styles/：全域樣式與 Tailwind 設定
- public/：靜態資源
- tests/：測試
- prisma/：prisma相關資源(如schema.prisma)


# 程式碼風格

## 命名慣例
- 檔案名稱：kebab-case（例：user-controller.ts）
- 類別名稱：PascalCase（例：UserController）
- 函數、物件名稱：camelCase（例：getUserById）
- 常數：UPPER_SNAKE_CASE（例：MAX_RETRY_COUNT）

## TypeScript 要求
- 禁止使用 `any`，必須明確定義型別
- 優先使用 interface 而非 type
- 所有公開函數都要有 JSDoc 註解
- 使用 async/await，避免 .then() 鏈

## 錯誤處理
- 使用自訂錯誤類別（繼承 Error）
- 所有 async 函數都要 try-catch
- 錯誤訊息必須包含上下文資訊

## 日誌管理
- 前端：僅紀錄必要的 UI 行為（避免蒐集個資），開發環境使用 console，正式環境禁用 console.log
- 伺服端：使用結構化日誌（JSON），包含 requestId、userId（若有）與路徑
- 錯誤需記錄 stack，並加上上下文（功能模組、輸入摘要）


# 安全規範

## 絕對禁止
- 在前端或 Git 中存放資料庫密碼、API Key、私密連線字串
- 任何未授權的個資蒐集（包含表單、追蹤碼）
- 未驗證輸入直接寫入資料庫
- 在公開頁面顯示管理功能

## 必須遵守
- 所有 API 路由需做輸入驗證（使用 zod）
- 登入後臺使用 NextAuth
- 所有輸出需做序列化與欄位白名單
- 使用 CSRF/同源策略與 HTTPS（部署階段落實）
- 重要操作必須有審計紀錄（create/update/delete）


# 測試規範

## 測試涵蓋要求
- 服務層（資料庫存取）需有基本單元測試
- API 路由需有輸入驗證與錯誤處理測試
- 重要頁面需有基本互動測試（至少一條主流程）

## 測試框架
- 單元測試：Vitest
- E2E 測試：Playwright

## 測試原則
- 每個測試只驗證一件事
- 使用描述性的測試名稱
- 測試要能獨立執行


# 特殊規則

## Git Commit 規範
遵循 Conventional Commits：
- `feat:` 新功能
- `fix:` 修復 bug
- `refactor:` 重構
- `test:` 測試相關
- `docs:` 文件更新

## 效能要求
- 資料庫查詢必須有適當索引
- API 回應時間不得超過 500ms

## 當遇到不確定的情況
如果你不確定該怎麼做，請：
1. 先暫停，不要猜測
2. 詢問使用者
3. 參考專案中已有的類似實作

## 網頁設計準則
- 主要色系以橘色為主
- 網頁語言以中文為主，但日後可能會增加更改語言功能(英文、日文等...)，請為此保留開放的程式架構
- 注意網頁顯示在手機、平板、電腦等不同大小螢幕上的適配性
### 頁面設計細節
- Hero Section 請滿版設計
- 非首頁之頁面請在頁面上方顯示頁面路徑
- 有圖片等可能需要加載且需要空間顯示之物件，請保留空間以避免layout shift
- 盡量用相同的方式實現同一視覺效果，例如文字粗體等等
#### 各頁面內容
- 關於事務所：
1. 提供服務：標題，每個服務為一個按鈕塊，點入後以該服務名稱為標題，以下有文字，可能有圖片參雜其中
2. 沿革：標題及文字
3. 未來期許：標題及文字