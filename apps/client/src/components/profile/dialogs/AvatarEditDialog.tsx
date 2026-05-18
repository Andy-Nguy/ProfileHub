import React, { useState, useRef, useCallback, useEffect } from 'react';
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

/** Reads a File as a base64 data URL */
function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result as string));
    reader.addEventListener('error', reject);
    reader.readAsDataURL(file);
  });
}

const ACCEPTED = 'image/jpeg,image/png,image/webp,image/gif';
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

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
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Reset when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setCroppedAreaPixels(null);
      setFileError(null);
    }
  }, [isOpen]);

  const processFile = useCallback(async (file: File) => {
    setFileError(null);
    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }
    if (file.size > MAX_BYTES) {
      setFileError('Image must be smaller than 10 MB.');
      return;
    }
    const dataUrl = await readFile(file);
    setImageSrc(dataUrl);
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
  }, []);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  const onCropComplete = useCallback((_: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleSave = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const file = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      if (file) {
        await onUpload(file);
        onClose();
      }
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, rotation, onUpload, onClose]);

  const handleCancelEdit = () => {
    setImageSrc(null);
    setZoom(1);
    setRotation(0);
    setFileError(null);
  };

  const handleRotate = (deg: number) => {
    setRotation((prev) => (prev + deg + 360) % 360);
  };

  if (!isOpen) return null;

  const displayAvatar = currentAvatarUrl || `https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&size=300`;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit Profile Photo"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
    >
      {/* Modal Card */}
      <div
        className="relative bg-white rounded-2xl w-full shadow-2xl overflow-hidden flex flex-col transition-all duration-300"
        style={{ maxWidth: '520px', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {imageSrc ? 'Crop & Adjust Photo' : 'Profile Photo'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {imageSrc ? 'Drag image to crop or rotate' : 'View or update your current photo'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-white">
          {!imageSrc ? (
            /* STATE 1: Display Mode (Like FB/LinkedIn) */
            <div className="p-8 flex flex-col items-center justify-center gap-6">
              {/* Profile Photo Display Frame */}
              <div className="relative group">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-xl ring-1 ring-gray-100 bg-gray-50">
                  <img
                    src={displayAvatar}
                    alt="Current profile"
                    className="w-full h-full object-cover select-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&size=300`;
                    }}
                  />
                </div>
                {/* Clean hover shortcut to directly upload */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-1 rounded-full bg-black/40 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white"
                >
                  <span className="material-symbols-outlined text-2xl">photo_camera</span>
                  <span className="text-xs font-semibold tracking-wider">CHANGE PHOTO</span>
                </button>
              </div>

              {/* Detail Info */}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  Visible to everyone on ProfileHub
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Upload a high-quality square or portrait image
                </p>
              </div>

              {fileError && (
                <div className="w-full flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                  <span>{fileError}</span>
                </div>
              )}
            </div>
          ) : (
            /* STATE 2: Crop Mode (Like FB/LinkedIn) */
            <div className="p-6 space-y-5">
              {/* Cropper Box */}
              <div
                className="relative w-full bg-gray-900 rounded-2xl overflow-hidden shadow-inner"
                style={{ height: '340px' }}
              >
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  style={{
                    containerStyle: { borderRadius: '16px' },
                    cropAreaStyle: {
                      border: '3px solid rgba(255, 255, 255, 0.95)',
                      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
                    },
                  }}
                />
              </div>

              {/* Adjustments Panel */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-4 border border-gray-100">
                {/* Zoom Control */}
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-gray-500 w-12 shrink-0">Zoom</span>
                  <button
                    onClick={() => setZoom((z) => Math.max(1, z - 0.1))}
                    className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                    aria-label="Zoom out"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>remove</span>
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 h-1.5 rounded-full accent-indigo-600 cursor-pointer bg-gray-200"
                    aria-label="Zoom"
                  />
                  <button
                    onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                    className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                    aria-label="Zoom in"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                  </button>
                  <span className="text-xs font-bold text-gray-500 w-10 text-right shrink-0">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                {/* Rotate Control */}
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-gray-500 w-12 shrink-0">Rotate</span>
                  <div className="flex items-center gap-2 flex-1">
                    <button
                      onClick={() => handleRotate(-90)}
                      className="flex items-center gap-1 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 px-3.5 py-1.5 rounded-lg transition-colors border border-gray-200 shadow-sm"
                      aria-label="Rotate left"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>rotate_left</span>
                      Left
                    </button>
                    <button
                      onClick={() => handleRotate(90)}
                      className="flex items-center gap-1 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 px-3.5 py-1.5 rounded-lg transition-colors border border-gray-200 shadow-sm"
                      aria-label="Rotate right"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>rotate_right</span>
                      Right
                    </button>
                    {rotation !== 0 && (
                      <button
                        onClick={() => setRotation(0)}
                        className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors px-2 py-1.5 ml-auto"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center">
                Drag to reposition • Scroll or pinch to zoom
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50/60">
          {!imageSrc ? (
            /* STATE 1 Footer */
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl shadow-sm transition-all hover:shadow duration-200"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>upload</span>
                Upload Photo
              </button>
              <button
                onClick={onClose}
                className="text-sm font-semibold text-gray-600 hover:text-gray-800 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </>
          ) : (
            /* STATE 2 Footer (Crop Mode) */
            <>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-800 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                Back
              </button>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isUploading}
                  className="flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 px-5 py-2.5 rounded-xl shadow-sm transition-colors"
                >
                  {isUploading ? (
                    <>
                      <span
                        className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                        style={{ animation: 'spin 0.7s linear infinite' }}
                      />
                      Saving…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>
                      Apply Photo
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Native Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={ACCEPTED}
          onChange={onFileChange}
        />
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>,
    document.body
  );
};
