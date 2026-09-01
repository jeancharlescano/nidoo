import Navbar from "@/components/ui/Navbar";

const LayoutNavBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="pb-20 bg-[#F7F8FC]">{children}</main>
      <Navbar />
    </>
  );
};

export default LayoutNavBar;
