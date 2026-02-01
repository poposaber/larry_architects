export function Footer() {
  return (
    <footer className="w-full border-t bg-white dark:bg-zinc-950 dark:border-zinc-800 py-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-6 px-4 md:px-6">
        
        {/* 左側：聯絡資訊 */}
        <div className="flex flex-col items-center md:items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <p>地址：台北市大安區...</p>
          <p>電話：(02) 2345-6789</p>
          <p>傳真：(02) 2345-6789</p>
        </div>

        {/* 右側：版權宣告 */}
        <div className="flex flex-col items-center md:items-end justify-center md:h-full">
          <p className="text-center text-sm leading-loose text-zinc-500 dark:text-zinc-500 md:text-right">
            © {new Date().getFullYear()} 賴乾淵建築師事務所 (Larry Architects). <br className="md:hidden" />All rights reserved.
          </p>
        </div>
      
      </div>
    </footer>
  );
}
