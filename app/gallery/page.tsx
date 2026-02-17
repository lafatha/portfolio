import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-3xl min-h-screen border-x border-neutral-200 px-8 md:px-12 pt-0 pb-8">
        <Navbar />
        {/* Gallery content can be added here later */}
        <Footer />
      </div>
    </main>
  );
}




