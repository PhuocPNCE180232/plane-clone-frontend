"use client";

import { useEffect, useState } from "react";
import { Sun } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "short",
  day: "numeric",
});

const getGreeting = (hour: number) => {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export const Welcome = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());

    updateTime();
    const intervalId = window.setInterval(updateTime, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const accountName = user?.name?.trim() || user?.email?.split("@")[0] || "there";
  const greeting = currentTime ? getGreeting(currentTime.getHours()) : "Welcome";
  const formattedDate = currentTime ? dateFormatter.format(currentTime) : "";

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Sun className="h-5 w-5 text-yellow-400" />
        <span className="text-sm text-gray-400">{formattedDate}</span>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900">
        {greeting}, {accountName}
      </h1>
    </section>
  );
};
