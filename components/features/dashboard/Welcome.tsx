import { Sun } from "lucide-react";

export const Welcome = () => {
  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Sun className="h-5 w-5 text-yellow-400" />
        <span className="text-sm text-gray-400">Friday, Jul 4</span>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Good morning, Cristiano Ronaldo

      </h1>
    </section>
  );
};