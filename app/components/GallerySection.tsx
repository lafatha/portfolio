"use client";

import { useState } from "react";
import Image from "next/image";

const leftPhotos = [
  { src: "/gallery/foto1.webp", alt: "Gallery photo 1", aspect: "aspect-square" },
  { src: "/gallery/foto4.webp", alt: "Gallery photo 4", aspect: "aspect-[4/3]" },
  { src: "/gallery/foto6.webp", alt: "Gallery photo 6", aspect: "aspect-[4/3]" },
];

const rightPhotos = [
  { src: "/gallery/foto2.webp", alt: "Gallery photo 2", aspect: "aspect-[4/3]" },
  { src: "/gallery/foto3.webp", alt: "Gallery photo 3", aspect: "aspect-square" },
  { src: "/gallery/foto5.webp", alt: "Gallery photo 5", aspect: "aspect-[4/3]" },
];

export default function GallerySection() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <section className="mb-16">
      <div className="projects-header">
        <h2 className="projects-title">
          Gallery
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          {leftPhotos.map((photo, index) => (
            <div
              key={index}
              className={`relative w-full ${photo.aspect} rounded-lg overflow-hidden bg-neutral-100 group cursor-pointer`}
              onClick={() => setSelectedPhoto(photo.src)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(min-width: 768px) 384px, 100vw"
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {rightPhotos.map((photo, index) => (
            <div
              key={index}
              className={`relative w-full ${photo.aspect} rounded-lg overflow-hidden bg-neutral-100 group cursor-pointer`}
              onClick={() => setSelectedPhoto(photo.src)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(min-width: 768px) 384px, 100vw"
              />
            </div>
          ))}
        </div>
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/80 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[85vh] aspect-auto">
            <Image
              src={selectedPhoto}
              alt="Gallery preview"
              width={1200}
              height={900}
              className="object-contain w-full h-full max-h-[85vh] rounded-lg mx-auto"
            />
          </div>
        </div>
      )}
    </section>
  );
}
