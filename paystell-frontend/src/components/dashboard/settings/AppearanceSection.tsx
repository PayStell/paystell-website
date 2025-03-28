import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";

const AppearanceSection = () => {
  return (
    <div className="bg-card rounded-lg w-full p-8 mt-8">
      <h2 className="text-xl font-semibold mb-6">Appearance</h2>
      <ThemeToggle />
    </div>
  );
};

export default AppearanceSection;
