"use client";

import React, { useState } from "react";
import { Settings, CheckCircle2, Tags, Hash } from "lucide-react";
import { GeneralSettings } from "./GeneralSettings";
import { StatesSettings } from "./StatesSettings";
import { LabelsSettings } from "./LabelsSettings";
import { EstimatesSettings } from "./EstimatesSettings";

const tabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "states", label: "States", icon: CheckCircle2 },
  { id: "labels", label: "Labels", icon: Tags },
  { id: "estimates", label: "Estimates", icon: Hash },
];

export const ProjectSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="flex h-full flex-col md:flex-row gap-6 p-6">
      {/* Sidebar Tabs */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
          Project Settings
        </h2>
        <nav className="flex flex-col gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white rounded-xl border border-gray-200 p-6 shadow-sm min-h-[500px]">
        {activeTab === "general" && <GeneralSettings />}
        {activeTab === "states" && <StatesSettings />}
        {activeTab === "labels" && <LabelsSettings />}
        {activeTab === "estimates" && <EstimatesSettings />}
      </main>
    </div>
  );
};
