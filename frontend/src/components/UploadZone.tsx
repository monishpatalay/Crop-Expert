import { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';

type Props = {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
};

export function UploadZone({ onFileSelected, disabled }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelected(file);
    }
  };

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  return (
    <div
      className={`upload-zone ${isDragging ? 'is-dragging' : ''} ${disabled ? 'is-disabled' : ''}`}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        if (!disabled) handleFiles(event.dataTransfer.files);
      }}
      onClick={openPicker}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
          event.preventDefault();
          openPicker();
        }
      }}
      aria-label="Upload a potato leaf photo"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="visually-hidden"
        onChange={(event) => handleFiles(event.target.files)}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
      />
      <UploadCloud size={32} strokeWidth={1.5} aria-hidden="true" />
      <p className="upload-zone__title">Drop a leaf photo here</p>
      <p className="upload-zone__hint">or click to browse — JPG or PNG</p>
    </div>
  );
}
