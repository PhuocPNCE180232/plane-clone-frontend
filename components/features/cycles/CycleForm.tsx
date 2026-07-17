"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCycleSchema } from "@/lib/validations/cycle";
import { createCycle } from "@/lib/services/cycle.service";
import { useAppStore } from "@/hooks/use-app-store";

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
				<div className="absolute left-0 top-full mt-2 w-64 rounded-md border bg-white p-3 shadow-lg z-20">
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

export const CycleForm = ({ onClose }: Props) => {
	const queryClient = useQueryClient();
	const { activeProjectId } = useAppStore();

	const { mutate: handleCreateCycle, isPending } = useMutation({
		mutationFn: createCycle,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cycles"] });
			onClose();
		},
		onError: (error) => {
			console.error("Failed to create cycle:", error);
			alert("Failed to create cycle. Please try again.");
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const payload = {
			title: (form.elements.namedItem("title") as HTMLInputElement)?.value,
			description: (form.elements.namedItem("description") as HTMLTextAreaElement)?.value,
			startDate: (form.elements.namedItem("startDate") as HTMLInputElement)?.value,
			endDate: (form.elements.namedItem("endDate") as HTMLInputElement)?.value,
		};

		const res = createCycleSchema.safeParse(payload);
		if (!res.success) {
			const first = res.error.issues[0];
			alert(first.message || "Validation error");
			return;
		}

		handleCreateCycle({
			project_id: activeProjectId || "p1",
			name: res.data.title,
			description: res.data.description || "",
			start_date: res.data.startDate || "",
			end_date: res.data.endDate || "",
			progress: 0,
		});
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
			</div>

			<div className="flex justify-end gap-3">
				<button type="button" onClick={onClose} className="rounded-md border px-3 py-1 text-sm bg-white text-black">
					Cancel
				</button>
				<button type="submit" disabled={isPending} className="rounded-md bg-[#3f76ff] px-4 py-2 text-white disabled:opacity-60">
					{isPending ? "Creating..." : "Create cycle"}
				</button>
			</div>
		</form>
	);
};
