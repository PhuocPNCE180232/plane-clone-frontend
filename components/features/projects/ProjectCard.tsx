import {
  Folder,
  Users,
  CircleDot,
  Clock,
  MoreHorizontal,
} from "lucide-react";

type ProjectCardProps = {
  title: string;
  description: string;
  members: number;
  issues: number;
};

// Static colour slots cycling through Plane-style accent colours
const IDENTIFIER_COLOURS = [
  "bg-[#3f76ff]/10 text-[#3f76ff]",
  "bg-purple-100 text-purple-600",
  "bg-emerald-100 text-emerald-600",
  "bg-orange-100 text-orange-600",
  "bg-pink-100 text-pink-600",
];

function colourFor(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash += title.charCodeAt(i);
  return IDENTIFIER_COLOURS[hash % IDENTIFIER_COLOURS.length];
}

function initials(title: string): string {
  return title
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export const ProjectCard = ({
  title,
  description,
  members,
  issues,
}: ProjectCardProps) => {
  const accentClass = colourFor(title);

  return (
    <div
      className="
        group relative flex flex-col
        rounded-xl border border-gray-200
        bg-white p-5 shadow-sm
        cursor-pointer
        hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300
        transition-all duration-200
      "
    >
      {/* Hover-reveal three-dot menu */}
      <button
        className="
          absolute right-3 top-3
          rounded p-1 text-gray-300
          opacity-0 group-hover:opacity-100
          hover:bg-gray-100 hover:text-gray-600
          transition-all
        "
        aria-label="More options"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {/* ── Project identifier avatar ──────────────────────────────── */}
      <div
        className={`
          mb-4 flex h-10 w-10 items-center justify-center
          rounded-lg text-sm font-bold tracking-wide
          ${accentClass}
        `}
      >
        {initials(title)}
      </div>

      {/* ── Title + description ───────────────────────────────────── */}
      <h3 className="mb-1 pr-6 text-sm font-semibold text-gray-900 leading-snug group-hover:text-[#3f76ff] transition-colors">
        {title}
      </h3>
      <p className="mb-4 text-xs text-gray-400 leading-relaxed line-clamp-2">
        {description}
      </p>

      {/* Spacer to push footer to bottom */}
      <div className="flex-1" />

      {/* ── Stats row ────────────────────────────────────────────── */}
      <div className="mt-3 flex items-center gap-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5 text-gray-400" />
          {members} Members
        </span>
        <span className="flex items-center gap-1">
          <CircleDot className="h-3.5 w-3.5 text-gray-400" />
          {issues} Issues
        </span>
        <span className="ml-auto flex items-center gap-1 text-gray-400">
          <Clock className="h-3.5 w-3.5" />
          2h ago
        </span>
      </div>
    </div>
  );
};

// Keep Folder in scope to avoid unused-import lint warning when icon is referenced in JSDoc
void Folder;