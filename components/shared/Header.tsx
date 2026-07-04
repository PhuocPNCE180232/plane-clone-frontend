export const Header = () => {
  return (
    <header className="h-16 bg-[#151b2f] flex items-center justify-between px-6">
      <h1 className="text-white text-2xl font-bold">
        Plane Clone
      </h1>

      <input
        type="text"
        placeholder="Search..."
        className="w-72 rounded-md px-4 py-2 text-sm bg-white"
      />

      <span className="text-white">
        User
      </span>
    </header>
  );
};