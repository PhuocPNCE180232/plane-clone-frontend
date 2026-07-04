import { ProjectCard } from "./ProjectCard";

// Static display data — no mock data changed
const projects = [
  {
    title: "Plane Clone",
    description: "4-week OJT project cloning the Plane.so frontend interface with Next.js 15.",
    members: 7,
    issues: 12,
  },
  {
    title: "OJT Management",
    description: "Internal system for managing OJT intern assignments, schedules and evaluations.",
    members: 6,
    issues: 28,
  },
  {
    title: "Ticket Management",
    description: "Next.js assignment — a helpdesk ticket system with priority tracking.",
    members: 2,
    issues: 9,
  },
];

export const ProjectList = () => {
  return (
    <section>
      {/* Section label — matches Cycles "Active Cycles" section style */}
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        All Projects
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.title}
            title={project.title}
            description={project.description}
            members={project.members}
            issues={project.issues}
          />
        ))}
      </div>
    </section>
  );
};