import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Cropper from 'react-easy-crop';
import { useTranslation } from 'react-i18next';
import getCroppedImg from '../../../utils/cropImage';

export interface AvatarEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl: string | null | undefined;
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

export const AvatarEditDialog: React.FC<AvatarEditDialogProps> = ({
  isOpen,
  onClose,
  currentAvatarUrl,
  onUpload,
  isUploading,
}) => {
  const { t } = useTranslation('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  if (!isOpen) return null;

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl as string);
    }
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedImageFile = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
      if (croppedImageFile) {
        await onUpload(croppedImageFile);
        onClose(); // close modal on success
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-scrim/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-surface text-on-surface rounded-[24px] w-full max-w-md md:max-w-xl shadow-elevation-3 overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-outline-variant">
          <h2 className="font-title-lg text-title-lg">
            Profile Photo
          </h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center min-h-[300px]">
          {imageSrc ? (
            <div className="w-full relative bg-surface-container-low rounded-lg overflow-hidden h-[350px]">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1} // 1:1 aspect ratio for avatars
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <img 
                src={currentAvatarUrl || 'https://via.placeholder.com/200'} 
                alt="Current Avatar" 
                className="w-48 h-48 rounded-full object-cover border-4 border-surface-container-highest shadow-sm mb-6"
              />
              <p className="text-on-surface-variant mb-6 text-body-lg">
                Upload a new photo to change your profile picture.
              </p>
            </div>
          )}

          {/* Zoom Slider */}
          {imageSrc && (
            <div className="w-full mt-6 px-4 flex items-center gap-4">
              <span className="material-symbols-outlined text-on-surface-variant">zoom_out</span>
              <input 
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-label="Zoom"
                className="flex-1 h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary"
                onChange={(e) => setZoom(Number(e.target.value))}
              />
              <span className="material-symbols-outlined text-on-surface-variant">zoom_in</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant bg-surface-container-lowest">
          <div>
            {!imageSrc ? (
              <button
                className="bg-primary text-on-primary font-label-lg px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload new photo
              </button>
            ) : (
              <button
                className="border border-outline-variant text-primary font-label-lg px-6 py-2.5 rounded-full hover:bg-surface-container-low transition-colors"
                onClick={handleReset}
              >
                Cancel Crop
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/jpeg,image/png,image/webp" 
              onChange={onFileChange} 
            />
          </div>
          
          <div className="flex gap-3">
            {imageSrc && (
              <button
                onClick={handleSave}
                disabled={isUploading}
                className="bg-primary text-on-primary font-label-lg px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                    Saving...
                  </>
                ) : (
                  'Save as Profile Photo'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Helper
function readFile(file: File) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}
