type CycleProgressBarProps = {
  percent: number;
};

export const CycleProgressBar = ({ percent }: CycleProgressBarProps) => {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[10px] text-gray-500">
        <span>Progress</span>
        <span className="font-semibold text-gray-700">{percent}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-[#3f76ff] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
