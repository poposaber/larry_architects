import Image from 'next/image';

interface ImageUploaderProps {
  label?: string;
  subLabel?: string;
  name?: string; // input name for file
  hiddenName?: string; // input name for existing value
  previewUrl?: string | null;
  helperText?: string;
  accept?: string;
}

export default function ImageUploader({
  label = "封面圖片",
  subLabel = "更換圖片",
  name = "coverImageFile",
  hiddenName = "coverImage",
  previewUrl,
  helperText = "支援 jpg, png, webp",
  accept = "image/*"
}: ImageUploaderProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">{label}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor={name} className="block text-sm text-zinc-500 dark:text-zinc-400 mb-2">
            {subLabel}
          </label>
          <input
            type="file"
            id={name}
            name={name}
            accept={accept}
            className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 block mb-2"
          />
          {helperText && <span className="text-xs text-zinc-400">{helperText}</span>}
          <input type="hidden" name={hiddenName} value={previewUrl || ''} />
        </div>
        
        {previewUrl && (
          <div className="group relative aspect-video rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200">
            <Image 
              src={previewUrl} 
              alt="Preview" 
              fill 
              className="object-cover"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 text-center group-hover:opacity-0 transition-opacity">
              <span className="text-xs text-white">目前圖片</span>
            </div>
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 has-[:checked]:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 has-[:checked]:opacity-100">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id={`delete-${name}`}
                  name="deleteCoverImage"
                  className="w-5 h-5 cursor-pointer accent-red-600"
                />
                <label htmlFor={`delete-${name}`} className="text-white text-xs font-semibold cursor-pointer select-none">
                  刪除
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
