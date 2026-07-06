"use client";

import React, { useState } from "react";
import { Hash } from "lucide-react";

const ESTIMATE_SYSTEMS = [
  { id: "fibonacci", name: "Fibonacci", values: "0, 1, 2, 3, 5, 8, 13, 21" },
  { id: "linear", name: "Linear", values: "1, 2, 3, 4, 5, 6, 7, 8" },
  { id: "t-shirt", name: "T-Shirt Sizes", values: "XS, S, M, L, XL" },
];

export const EstimatesSettings = () => {
  const [activeSystem, setActiveSystem] = useState("fibonacci");

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Estimates</h3>
        <p className="text-sm text-gray-500">Configure how you want to estimate issues in this project.</p>
      </div>

      <div className="space-y-4 max-w-2xl">
        {ESTIMATE_SYSTEMS.map((system) => (
          <div
            key={system.id}
            onClick={() => setActiveSystem(system.id)}
            className={`
              flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all
              ${activeSystem === system.id 
                ? "border-blue-500 bg-blue-50/50" 
                : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
              }
            `}
          >
            <div className="mt-1">
              <input
                type="radio"
                name="estimateSystem"
                checked={activeSystem === system.id}
                onChange={() => setActiveSystem(system.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Hash className={`h-4 w-4 ${activeSystem === system.id ? "text-blue-500" : "text-gray-400"}`} />
                <h4 className="text-sm font-semibold text-gray-900">{system.name}</h4>
              </div>
              <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                {system.values}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          onClick={() => alert("Cập nhật hệ thống estimate thành công (Mock)")}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
