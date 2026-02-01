# 賴乾淵建築師事務所 (Larry Architects)

這是賴乾淵建築師事務所的官方網站全端專案。本專案採用 Next.js App Router 架構，搭配 PostgreSQL 資料庫與 Docker 容器化環境進行開發。

## 🛠 技術堆疊 (Tech Stack)

- **前端框架**: [Next.js](https://nextjs.org/) (App Router)
- **程式語言**: TypeScript v5+
- **樣式處理**: Tailwind CSS
- **資料庫**: PostgreSQL 18.x
- **ORM**: Prisma v7.x
- **認證系統**: NextAuth.js (Beta)
- **基礎設施**: Docker & Docker Compose

## 🚀 快速開始 (Getting Started)

### 前置需求

請確保您的開發環境已安裝以下工具：
- [Node.js](https://nodejs.org/) v24.x 或更高版本
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (包含 Docker Compose)

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

專案根目錄已包含標準的 `.env` 設定，預設連線至 Docker 本地資料庫。若有需要修改（例如資料庫密碼），請編輯 `.env` 檔案。

### 3. 啟動開發環境

我們使用 Docker Compose 來管理本地資料庫。

```bash
# 啟動 PostgreSQL 資料庫容器 (背景執行)
docker compose up -d

# 同步資料庫 Schema
npx prisma db push
```

### 4. 啟動開發伺服器

```bash
npm run dev
```

瀏覽器打開 [http://localhost:3000](http://localhost:3000) 即可看到首頁。

## 📂 專案結構

- `app/`: Next.js 應用程式主目錄 (App Router)
  - `(public)/`: 前台公開頁面
  - `(admin)/`: 後台管理系統
  - `api/`: API Route Handlers
- `components/`: 通用 UI 元件
- `features/`: 功能模組
- `lib/`: 工具函式庫與設定 (Prisma, Utils...)
- `prisma/`: 資料庫 Schema 與設定
- `public/`: 靜態資源 (圖片、字型)
- `styles/`: 全域樣式設定
- `tests/`: 測試檔案

## 📜 開發規範

詳細的開發規範、程式碼風格與架構決策，請參閱 [AGENTS.md](./AGENTS.md)。