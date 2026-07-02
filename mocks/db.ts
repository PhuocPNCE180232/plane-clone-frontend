import { User, Workspace, Project, Issue } from '../types';

class MockDatabase {
  public users: User[] = [];
  public workspaces: Workspace[] = [];
  public projects: Project[] = [];
  public issues: Issue[] = [];

  constructor() {
    this.seedDatabase();
  }

  // Hàm bơm dữ liệu mồi mặc định khi app vừa chạy
  private seedDatabase() {
    // 1. Tạo User mặc định
    const adminUser: User = {
      id: 'usr_123',
      email: 'phuoc.lead@team.com',
      name: 'Phước (Team Lead)',
      avatarUrl: 'https://github.com/shadcn.png',
    };
    this.users.push(adminUser);

    // 2. Tạo Workspace
    const defaultWorkspace: Workspace = {
      id: 'ws_001',
      name: 'Frontend OJT Team',
      slug: 'fe-ojt-team',
      ownerId: adminUser.id,
      createdAt: new Date().toISOString(),
    };
    this.workspaces.push(defaultWorkspace);

    // 3. Tạo Project
    const cloneProject: Project = {
      id: 'prj_101',
      workspaceId: defaultWorkspace.id,
      name: 'Plane.so Clone',
      identifier: 'FE',
      description: 'Dự án clone Plane.so 4 tuần',
    };
    this.projects.push(cloneProject);

    // 4. Tạo Issues mồi
    this.issues.push({
      id: 'iss_001',
      projectId: cloneProject.id,
      title: 'Thiết lập Base code và MSW',
      description: 'Khởi tạo Next.js, cài Tailwind, setup Mock DB',
      state: 'completed',
      priority: 'urgent',
      assigneeId: adminUser.id,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 ngày trước
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

  // --- Các hàm tiện ích để MSW Handler gọi (Đóng vai trò như các câu query SQL) ---

  public getIssuesByProject(projectId: string): Issue[] {
    return this.issues.filter(issue => issue.projectId === projectId);
  }

  public addIssue(issue: Issue): void {
    // Ví dụ về logic kiểm tra ràng buộc: Phải có projectId thì mới cho tạo Issue
    if (!issue.projectId) throw new Error("Issue phải thuộc về một Project");
    this.issues.push(issue);
  }
}

// Xuất ra 1 instance duy nhất (Singleton) để toàn bộ app dùng chung
export const db = new MockDatabase();