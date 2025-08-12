
import Header from "@/components/layout/Header";
import LeftSidebar from "@/components/layout/LeftSidebar";

export default function Home() {
  return (
    <main className="min-h-screen min-w-screen bg-[#F9FAFB] flex flex-col">
      <Header />
      <section className="flex flex-1">
        <LeftSidebar />
        <section className="flex-1 p-5">
        </section>
      </section>
    </main>
  );
}
