import Navbar from "@/components/ui/navbar";

type Props = {
  children: React.ReactNode;
};

const BaseLayout = ({ children }: Props) => {
  return (
    <div className="scroll-smooth">
      <Navbar />
      <div className="mx-auto space-y-10 py-5 min-h-[80vh] w-full">
        {children}
      </div>
    </div>
  );
};

export default BaseLayout;
