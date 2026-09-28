'use client';

import { useEffect } from 'react';

interface LightboxProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

export default function Lightbox({ src, alt = 'Foto Sampah', onClose }: LightboxProps) {
  // Tutup dengan tombol ESC
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Cegah scroll body saat lightbox terbuka
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Preview foto"
    >
      {/* Tombol tutup */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/40 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold transition-all"
        aria-label="Tutup preview"
      >
        ✕
      </button>

      {/* Gambar - klik pada gambar tidak menutup modal */}
      <div onClick={(e) => e.stopPropagation()} className="max-w-4xl max-h-[90vh] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain rounded-2xl shadow-2xl max-h-[85vh]"
        />
        <p className="text-white/70 text-center text-sm mt-3">{alt} · Klik di luar untuk menutup · ESC</p>
      </div>
    </div>
  );
}
