
import Greeting from "@/components/Greeting";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-[#F1F0FB] p-4">
      <div className="w-full max-w-4xl mx-auto text-center space-y-8">
        <Greeting />
      </div>
    </div>
  );
};

export default Index;
