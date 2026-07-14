"use client";

import {
  Folder,
  Users,
  CircleDot,
  Clock,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

type ProjectCardProps = {
  id: string;
  title: string;
  description: string;
  members: number;
  issues: number;
  createdAt?: string;
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
  id,
  title,
  description,
  members,
  issues,
  createdAt,
}: ProjectCardProps) => {
  const accentClass = colourFor(title);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const params = useParams();
  const slug = (params?.workspaceSlug as string) ?? "workspaceSlug";
  
  const projectId = id;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="
        group relative flex flex-col
        rounded-xl border border-gray-200
        bg-white p-5 shadow-sm
        hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300
        transition-all duration-200
      "
    >
      {/* Hover-reveal three-dot menu */}
      <div className="absolute right-3 top-3" ref={menuRef}>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsMenuOpen(!isMenuOpen);
          }}
          className={`
            rounded p-1 text-gray-300
            hover:bg-gray-100 hover:text-gray-600
            transition-all
            ${isMenuOpen ? "opacity-100 bg-gray-100 text-gray-600" : "opacity-0 group-hover:opacity-100"}
          `}
          aria-label="More options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-full z-10 mt-1 w-36 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
            <Link
              href={`/${slug}/projects/${projectId}/settings`}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Settings className="h-3.5 w-3.5 text-gray-400" />
              Settings
            </Link>
          </div>
        )}
      </div>

      <Link href={`/${slug}/projects/${projectId}`} className="flex-1 flex flex-col">
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
            {createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : "Unknown"}
          </span>
        </div>
      </Link>
    </div>
  );
};

// Keep Folder in scope to avoid unused-import lint warning when icon is referenced in JSDoc
void Folder;