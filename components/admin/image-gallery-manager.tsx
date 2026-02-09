import Image from 'next/image';

interface ImageGalleryManagerProps {
  images?: string[];
  title?: string;
  description?: string;
  uploadLabel?: string;
  uploadName?: string;
  deleteName?: string;
  helperText?: string;
}

export default function ImageGalleryManager({
  images,
  title = "內容圖片",
  description = "這些圖片將顯示在詳情頁。",
  uploadLabel = "新增圖片 (可多選)",
  uploadName = "contentImagesFiles",
  deleteName = "deleteImages",
  helperText
}: ImageGalleryManagerProps) {
  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{title}</h3>
          {description && <p className="text-xs text-zinc-500 mt-1">{description}</p>}
        </div>
      </div>

      {/* Existing Images Grid */}
      {images && images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {images.map((img, index) => (
            <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50">
              <Image 
                src={img} 
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 has-[:checked]:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 has-[:checked]:opacity-100">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id={`${deleteName}-${index}`} 
                    name={deleteName} 
                    value={img}
                    className="w-5 h-5 cursor-pointer accent-red-600"
                  />
                  <label htmlFor={`${deleteName}-${index}`} className="text-white text-xs font-semibold cursor-pointer select-none">
                    刪除
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <label htmlFor={uploadName} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
        {uploadLabel}
      </label>
      <input
        type="file"
        id={uploadName}
        name={uploadName}
        multiple
        accept="image/*"
        className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-50 file:text-zinc-700 hover:file:bg-zinc-100"
      />
      {helperText && <p className="mt-1 text-xs text-zinc-500">{helperText}</p>}
    </div>
  );
}
