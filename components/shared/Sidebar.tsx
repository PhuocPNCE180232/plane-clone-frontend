"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  Home,
  FileEdit,
  UserCircle,
  Pin,
  FolderOpen,
  CircleDot,
  Boxes,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";

// ─── Nav item type ────────────────────────────────────────────────────────────

type NavItem = {
  icon: React.ReactNode;
  title: string;
  href: string;
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export const Sidebar = () => {
  const pathname  = usePathname();
  const params    = useParams();

  // Read the real workspaceSlug from URL params.
  // Falls back to the literal "workspaceSlug" so existing routes continue
  // to work while the app has no real auth/workspace selection.
  const slug = (params?.workspaceSlug as string) ?? "workspaceSlug";

  // ── Nav definitions ──────────────────────────────────────────────────────

  const menus: NavItem[] = [
    { icon: <Home      className="h-4 w-4" />, title: "Home",      href: `/${slug}`        },
    { icon: <FileEdit  className="h-4 w-4" />, title: "Drafts",    href: `/${slug}/drafts` },
    { icon: <UserCircle className="h-4 w-4" />,title: "Your Work", href: `/${slug}/your-work` },
    { icon: <Pin       className="h-4 w-4" />, title: "Stickies",  href: `/${slug}/stickies`  },
  ];

  const workspace: NavItem[] = [
    { icon: <FolderOpen className="h-4 w-4" />, title: "Projects",   href: `/${slug}/projects` },
    { icon: <CircleDot  className="h-4 w-4" />, title: "Work Items", href: `/${slug}/issues`   },
    { icon: <Boxes      className="h-4 w-4" />, title: "Modules",    href: `/${slug}/modules`  },
    { icon: <RefreshCw  className="h-4 w-4" />, title: "Cycles",     href: `/${slug}/cycles`   },
  ];

  // ── Active check ─────────────────────────────────────────────────────────
  // A link is active when the pathname exactly matches its href, OR the
  // pathname starts with href + "/" (covers nested sub-routes).
  // The home route is exact-only to avoid it lighting up on every page.

  const isActive = (href: string): boolean => {
    const homeHref = `/${slug}`;
    if (href === homeHref) return pathname === homeHref || pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  // ── Link class helper ─────────────────────────────────────────────────────

  const linkClass = (href: string) =>
    [
      "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
      isActive(href)
        ? "bg-gray-100 font-medium text-[#3f76ff]"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    ].join(" ");

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <aside className="flex w-60 shrink-0 flex-col gap-4 border-r border-gray-200 bg-white p-3">

      {/* Workspace name + new item button */}
      <div>
        <h2 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Plane Clone
        </h2>
        <button className="w-full rounded-md border border-gray-200 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          + New work item
        </button>
      </div>

      {/* Personal nav */}
      <nav className="flex flex-col gap-0.5">
        {menus.map((item) => (
          <Link key={item.title} href={item.href} className={linkClass(item.href)}>
            <span className={isActive(item.href) ? "text-[#3f76ff]" : "text-gray-400"}>
              {item.icon}
            </span>
            {item.title}
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <hr className="border-gray-100" />

      {/* Workspace nav */}
      <div>
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          Workspace
        </p>
        <nav className="flex flex-col gap-0.5">
          {workspace.map((item) => (
            <Link key={item.title} href={item.href} className={linkClass(item.href)}>
              <span className={isActive(item.href) ? "text-[#3f76ff]" : "text-gray-400"}>
                {item.icon}
              </span>
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      {/* More (static) */}
      <div className="mt-auto">
        <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
          More
        </button>
      </div>
    </aside>
  );
};