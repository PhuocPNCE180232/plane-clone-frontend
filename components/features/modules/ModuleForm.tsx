"use client";

import React, { useState } from "react";
import { createModuleSchema } from "@/lib/validations/module";
import { Archive, Clock, Play, Pause, CheckCircle, XCircle, Check } from "lucide-react";

type Props = {
	onClose: () => void;
};

const DateRangeToggle = () => {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="rounded-md border px-3 py-1 text-sm bg-white text-black"
      >
         Start date → End date
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-72 rounded-md border bg-white p-3 shadow-lg z-20">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-600">Start date</label>
            <input
              name="startDate"
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-black"
            />

            <label className="text-xs text-gray-600">End date</label>
            <input
              name="endDate"
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-black"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const StatusDropdown = ({ name = "status" }: { name?: string }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Backlog");

  const options: { key: string; label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[] = [
    { key: "Backlog", label: "Backlog", icon: Archive },
    { key: "Planned", label: "Planned", icon: Clock },
    { key: "In Progress", label: "In Progress", icon: Play },
    { key: "Paused", label: "Paused", icon: Pause },
    { key: "Completed", label: "Completed", icon: CheckCircle },
    { key: "Cancelled", label: "Cancelled", icon: XCircle },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 rounded-md border px-3 py-1 text-sm bg-white text-black"
      >
        {selected}
      </button>

      <input type="hidden" name={name} value={selected} />

      {open && (
        <div className="absolute left-0 top-full mt-2 w-48 rounded-md border bg-white p-2 shadow-lg z-30">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSel = selected === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  setSelected(opt.key);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </div>
                {isSel ? <Check className="h-4 w-4 text-green-600" /> : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const ModuleForm = ({ onClose }: Props) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const payload = {
      title: (form.elements.namedItem("title") as HTMLInputElement)?.value,
      description: (form.elements.namedItem("description") as HTMLTextAreaElement)?.value,
      startDate: (form.elements.namedItem("startDate") as HTMLInputElement)?.value,
      endDate: (form.elements.namedItem("endDate") as HTMLInputElement)?.value,
    };

    const res = createModuleSchema.safeParse(payload);
    if (!res.success) {
      const first = res.error.issues[0];
      alert(first.message || "Validation error");
      return;
    }

    console.log("Create Module", res.data);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="title"
        placeholder="Title"
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black"
      />

      <textarea
        name="description"
        placeholder="Description"
        rows={4}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black"
      />

      <div className="flex items-center gap-2">
        <DateRangeToggle />

        <StatusDropdown />
        <button type="button" className="rounded-md border px-3 py-1 text-sm bg-white text-black">
          Lead
        </button>
        <button type="button" className="rounded-md border px-3 py-1 text-sm bg-white text-black">
          Members
        </button>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onClose} className="rounded-md border px-3 py-1 text-sm bg-white text-black">
          Cancel
        </button>
        <button type="submit" className="rounded-md bg-[#3f76ff] px-4 py-2 text-white">
          Create Module
        </button>
      </div>
    </form>
  );
};
