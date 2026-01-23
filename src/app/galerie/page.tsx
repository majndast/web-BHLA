"use client";

import { useState } from "react";

// Demo data
const albums = [
  {
    id: "1",
    title: "Zahájení sezóny 2024/2025",
    date: "2025-01-15",
    coverColor: "#D61F2C",
    imageCount: 24,
  },
  {
    id: "2",
    title: "HC Blatná vs SK Lední Medvědi",
    date: "2025-01-10",
    coverColor: "#144A86",
    imageCount: 18,
  },
  {
    id: "3",
    title: "Vánoční turnaj 2024",
    date: "2024-12-22",
    coverColor: "#2E7D32",
    imageCount: 35,
  },
  {
    id: "4",
    title: "TJ Hokej Strakonice vs HC Vlci Písek",
    date: "2024-12-15",
    coverColor: "#0B1F3B",
    imageCount: 22,
  },
  {
    id: "5",
    title: "Přípravné zápasy",
    date: "2024-11-20",
    coverColor: "#FF9800",
    imageCount: 15,
  },
  {
    id: "6",
    title: "Sezóna 2023/2024 - Finále",
    date: "2024-03-15",
    coverColor: "#9C27B0",
    imageCount: 42,
  },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function GalleryPage() {
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Galerie</h1>
          <p className="text-secondary max-w-2xl mx-auto">
            Fotografie ze zápasů a akcí Blatské Hokejové Ligy Amatérů
          </p>
        </div>

        {/* Albums Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <button
              key={album.id}
              onClick={() => setSelectedAlbum(album.id)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow text-left"
            >
              {/* Cover Image Placeholder */}
              <div
                className="h-48 flex items-center justify-center relative"
                style={{ backgroundColor: album.coverColor }}
              >
                <svg className="w-20 h-20 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-4.44-6.19l-2.35 3.02-1.56-1.88c-.2-.25-.58-.24-.78.01l-1.74 2.23c-.26.33-.02.81.39.81h8.98c.41 0 .65-.47.4-.8l-2.55-3.39c-.19-.26-.59-.26-.79 0z"/>
                </svg>
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-sm px-2 py-1 rounded">
                  {album.imageCount} fotek
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-primary mb-1">{album.title}</h3>
                <p className="text-sm text-secondary">{formatDate(album.date)}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Empty State for future */}
        <div className="mt-12 text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-secondary mb-2">Nahrávání fotek bude dostupné v admin panelu</p>
          <p className="text-sm text-gray-400">Zde se budou zobrazovat alba s fotografiemi ze zápasů</p>
        </div>

        {/* Modal for album view - placeholder */}
        {selectedAlbum && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-primary">
                  {albums.find((a) => a.id === selectedAlbum)?.title}
                </h2>
                <button
                  onClick={() => setSelectedAlbum(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                    >
                      <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-4.44-6.19l-2.35 3.02-1.56-1.88c-.2-.25-.58-.24-.78.01l-1.74 2.23c-.26.33-.02.81.39.81h8.98c.41 0 .65-.47.4-.8l-2.55-3.39c-.19-.26-.59-.26-.79 0z"/>
                      </svg>
                    </div>
                  ))}
                </div>
                <p className="text-center text-secondary mt-6">
                  Fotografie budou nahrány přes admin panel
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
