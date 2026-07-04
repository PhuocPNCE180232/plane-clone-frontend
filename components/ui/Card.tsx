type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`
        rounded-xl
        border
        border-gray-200
        bg-white
        shadow-sm
        p-6
        transition-all
        ${className}
      `}
    >
      {children}
    </div>
  );
};