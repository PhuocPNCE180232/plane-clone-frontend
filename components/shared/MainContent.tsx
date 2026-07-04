type MainContentProps = {
  children: React.ReactNode;
};

export const MainContent = ({ children }: MainContentProps) => {
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50">
    <div className="mx-auto max-w-7xl p-8">
        {children}
    </div>
</main>
  );
};