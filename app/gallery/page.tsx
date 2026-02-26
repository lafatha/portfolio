import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";

export default function GalleryPage() {
  return (
    <main className="min-h-screen flex justify-center">
      <div className="w-full max-w-3xl min-h-screen border-x border-neutral-200 px-8 md:px-12 pt-0 pb-8">
        <Navbar />

        <section className="mt-18">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex flex-col gap-4">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-neutral-100 group">
                  <Image
                    src="/gallery/foto1.jpg"
                    alt="Gallery photo 1"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 flex items-end bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="w-full px-3 pb-3 text-xs text-white leading-snug">
                      {/* Ganti dengan penjelasan singkat foto 1 */}
                    </p>
                  </div>
                </div>
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100 group">
                  <Image
                    src="/gallery/foto4.jpg"
                    alt="Gallery photo 4"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-end bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="w-full px-3 pb-3 text-xs text-white leading-snug">
                      {/* Ganti dengan penjelasan singkat foto 4 */}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col gap-4">
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100 group">
                  <Image
                    src="/gallery/foto2.jpeg"
                    alt="Gallery photo 2"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-end bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="w-full px-3 pb-3 text-xs text-white leading-snug">
                      {/* Ganti dengan penjelasan singkat foto 2 */}
                    </p>
                  </div>
                </div>
                <div className="relative w-full aspect-[3/3] rounded-lg overflow-hidden bg-neutral-100 group">
                  <Image
                    src="/gallery/foto3.jpeg"
                    alt="Gallery photo 3"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-end bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="w-full px-3 pb-3 text-xs text-white leading-snug">
                      {/* Ganti dengan penjelasan singkat foto 3 */}
                    </p>
                  </div>
                </div>
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100 group">
                  <Image
                    src="/gallery/foto5.jpeg"
                    alt="Gallery photo 5"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-end bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="w-full px-3 pb-3 text-xs text-white leading-snug">
                      {/* Ganti dengan penjelasan singkat foto 5 */}
                    </p>
                  </div>
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

