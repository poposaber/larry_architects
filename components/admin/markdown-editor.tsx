import React from 'react';

interface MarkdownEditorProps {
  label?: string;
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  error?: string;
  textareaClassName?: string;
  showHint?: boolean;
}

export default function MarkdownEditor({
  label = "Markdown 內容",
  name = "content",
  defaultValue = "",
  placeholder = "請輸入 Markdown 內容...",
  rows = 20,
  error,
  textareaClassName = "",
  showHint = false
}: MarkdownEditorProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        className={`w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 font-mono text-sm outline-none focus:ring-2 focus:ring-orange-500 ${textareaClassName}`}
        placeholder={placeholder}
      />
      {showHint && (
        <p className="mt-2 text-xs text-zinc-500">
            提示：使用 # 標題, **粗體**, - 列表 等 Markdown 語法來排版。
        </p>
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
