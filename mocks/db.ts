import { User, Workspace, Project, Issue } from '../types';

class MockDatabase {
  public users: User[] = [];
  public workspaces: Workspace[] = [];
  public projects: Project[] = [];
  public issues: Issue[] = [];

  constructor() {
    this.seedDatabase();
  }

  private seedDatabase() {
    const adminUser: User = {
      id: 'usr_123',
      email: 'phuoc.lead@team.com',
      name: 'Phước (Team Lead)',
      avatarUrl: 'https://github.com/shadcn.png',
    };
    this.users.push(adminUser);

    const defaultWorkspace: Workspace = {
      id: 'ws_001',
      name: 'Frontend OJT Team',
      slug: 'fe-ojt-team',
      ownerId: adminUser.id,
      createdAt: new Date().toISOString(),
    };
    this.workspaces.push(defaultWorkspace);

    const cloneProject: Project = {
      id: 'prj_101',
      workspaceId: defaultWorkspace.id,
      name: 'Plane.so Clone',
      identifier: 'FE',
      description: 'Dự án clone Plane.so 4 tuần',
    };
    this.projects.push(cloneProject);

    this.issues.push({
      id: 'iss_001',
      projectId: cloneProject.id,
      title: 'Thiết lập Base code và MSW',
      description: 'Khởi tạo Next.js, cài Tailwind, setup Mock DB',
      state: 'completed',
      priority: 'urgent',
      assigneeId: adminUser.id,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    });

    this.issues.push({
      id: 'iss_002',
      projectId: cloneProject.id,
      title: 'Dựng Base Layout (Header, Sidebar)',
      state: 'started',
      priority: 'high',
      createdAt: new Date().toISOString(),
    });
  }

  public getIssuesByProject(projectId: string): Issue[] {
    return this.issues.filter(issue => issue.projectId === projectId);
  }

  public addIssue(issue: Issue): void {
    if (!issue.projectId) throw new Error("Issue phải thuộc về một Project");
    this.issues.push(issue);
  }
}

export const db = new MockDatabase();