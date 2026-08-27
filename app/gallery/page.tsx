import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Gallery - Gagah Athallah Fatha",
  description:
    "A visual gallery from the personal portfolio of Gagah Athallah Fatha, showcasing moments, work, and experiences behind his projects.",
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen flex justify-center">
      <div className="w-full max-w-3xl min-h-screen border-x-0 md:border-x border-[#f0f0f0] dark:border-[#242424] px-8 md:px-12 pt-0 pb-8">




        <Navbar />

        <section className="mt-18">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex flex-col gap-4">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-neutral-100 group">
                  <Image
                    src="/gallery/foto1.webp"
                    alt="Gallery photo 1"
                    fill
                    className="object-cover"
                    priority
                    sizes="(min-width: 768px) 384px, 100vw"
                  />
                </div>
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100 group">
                  <Image
                    src="/gallery/foto3.webp"
                    alt="Gallery photo 3"
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 384px, 100vw"
                  />
                </div>
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100 group">
                  <Image
                    src="/gallery/foto5.webp"
                    alt="Gallery photo 5"
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 384px, 100vw"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col gap-4">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-neutral-100 group">
                  <Image
                    src="/gallery/foto7.webp"
                    alt="Gallery photo 7"
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 384px, 100vw"
                  />
                </div>
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100 group">
                  <Image
                    src="/gallery/foto2.webp"
                    alt="Gallery photo 2"
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 384px, 100vw"
                  />
                </div>
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100 group">
                  <Image
                    src="/gallery/foto4.webp"
                    alt="Gallery photo 4"
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 384px, 100vw"
                  />
                </div>
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100 group">
                  <Image
                    src="/gallery/foto6.webp"
                    alt="Gallery photo 6"
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 384px, 100vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
