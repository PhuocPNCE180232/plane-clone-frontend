"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  BarChart2,
  Boxes,
  CircleDot,
  FolderOpen,
  Home,
  Layers,
  MoreHorizontal,
  ChevronLeft,
  Settings,
  Pin,
  RefreshCw,
  UserCircle,
  Users,
  FileText,
  Bell,
  MessageSquare,
  CircleHelp,
} from "lucide-react";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

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
  const slug = (params?.workspaceSlug as string) ?? "workspaceSlug";
  const projectId = params?.projectId as string;

  // ── Nav definitions ──────────────────────────────────────────────────────

  // 1. Menu cá nhân (Luôn hiển thị)
  const menus: NavItem[] = [
    { icon: <Home       className="h-4 w-4" />, title: "Home",      href: `/${slug}`        },
    { icon: <Bell       className="h-4 w-4" />, title: "Inbox",     href: `/${slug}/inbox`  },
    { icon: <UserCircle className="h-4 w-4" />, title: "Your Work", href: `/${slug}/your-work` },
    { icon: <Pin        className="h-4 w-4" />, title: "Stickies",  href: `/${slug}/stickies`  },
  ];

  // 2. Menu Workspace (Chỉ hiện ở màn ngoài)
  const workspace: NavItem[] = [
    { icon: <FolderOpen    className="h-4 w-4" />, title: "Projects",   href: `/${slug}/projects` },
    { icon: <Users         className="h-4 w-4" />, title: "Members",    href: `/${slug}/members`  },
    { icon: <BarChart2     className="h-4 w-4" />, title: "Analytics",  href: `/${slug}/analytics` },
    { icon: <MessageSquare className="h-4 w-4" />, title: "Community",  href: `/${slug}/community` },
    { icon: <CircleHelp    className="h-4 w-4" />, title: "Question",   href: `/${slug}/questions` },
  ];

  // 3. Menu Project (Chỉ hiện khi bấm vào 1 dự án cụ thể)
  const projectMenus: NavItem[] = [
    { icon: <CircleDot  className="h-4 w-4" />, title: "Work Items", href: `/${slug}/projects/${projectId}/issues`   },
    { icon: <RefreshCw  className="h-4 w-4" />, title: "Cycles",     href: `/${slug}/projects/${projectId}/cycles`   },
    { icon: <Boxes      className="h-4 w-4" />, title: "Modules",    href: `/${slug}/projects/${projectId}/modules`  },
    { icon: <Layers     className="h-4 w-4" />, title: "Views",      href: `/${slug}/projects/${projectId}/views`    },
    { icon: <FileText   className="h-4 w-4" />, title: "Pages",      href: `/${slug}/projects/${projectId}/pages`    },
    { icon: <Settings   className="h-4 w-4" />, title: "Settings",   href: `/${slug}/projects/${projectId}/settings` },
  ];

  // ── Active check ─────────────────────────────────────────────────────────
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

      {projectId ? (
        // PROJECT CONTEXT SIDEBAR
        <>
          <div className="px-2 mb-4">
            <Link 
              href={`/${slug}/projects`}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Projects
            </Link>
          </div>
          <div className="px-2 mb-2">
            <button className="w-full rounded-md border border-gray-200 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              + New work item
            </button>
          </div>
          <nav className="flex flex-col gap-0.5">
            {projectMenus.map((item) => (
              <Link key={item.title} href={item.href} className={linkClass(item.href)}>
                <span className={isActive(item.href) ? "text-[#3f76ff]" : "text-gray-400"}>
                  {item.icon}
                </span>
                {item.title}
              </Link>
            ))}
          </nav>
        </>
      ) : (
        // WORKSPACE CONTEXT SIDEBAR
        <>
          {/* Workspace Switcher */}
          <WorkspaceSwitcher />

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
          <hr className="border-gray-100 my-2" />

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
        </>
      )}

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
