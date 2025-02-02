// frontend/src/pages/admin/projects/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { ProjectBoard } from '@/components/admin/projects/ProjectBoard';
import { TaskManager } from '@/components/admin/projects/TaskManager';
import { projectService } from '@/services/project.service';

export default function AdminProjects() {
  const [activeTab, setActiveTab] = useState('board');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    projects: [],
    tasks: [],
    members: [],
    stats: {}
  });
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assignee: 'all',
    search: ''
  });

  const tabs = [
    { id: 'board', label: 'تخته پروژه' },
    { id: 'tasks', label: 'وظایف' },
    { id: 'timeline', label: 'خط زمانی' },
    { id: 'team', label: 'تیم‌ها' }
  ];

  useEffect(() => {
    fetchProjectData();
  }, [activeTab, filters]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const response = await projectService.getData({
        tab: activeTab,
        filters
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">مدیریت پروژه‌ها و وظایف</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                <span className="text-sm text-blue-800">
                  {data.stats?.activeProjects || 0} پروژه فعال
                </span>
              </div>
              <button
                onClick={() => setSelectedProject({})}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                پروژه جدید
              </button>
            </div>
          </div>
        </div>

        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <div className="flex items-center">
                  {tab.label}
                  {tab.id === 'tasks' && data.stats?.overdueTasks > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                      {data.stats.overdueTasks}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* فیلترها */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="جستجو در پروژه‌ها و وظایف..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="border rounded-lg p-2"
              />
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="not_started">شروع نشده</option>
                <option value="in_progress">در حال انجام</option>
                <option value="completed">تکمیل شده</option>
                <option value="on_hold">متوقف شده</option>
              </select>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="all">همه اولویت‌ها</option>
                <option value="high">بالا</option>
                <option value="medium">متوسط</option>
                <option value="low">پایین</option>
              </select>
              <select
                value={filters.assignee}
                onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="all">همه اعضا</option>
                {data.members?.map((member: any) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeTab === 'board' && (
            <ProjectBoard
              projects={data.projects}
              tasks={data.tasks}
              members={data.members}
              onProjectUpdate={async (projectId, updates) => {
                await projectService.updateProject(projectId, updates);
                await fetchProjectData();
              }}
              onTaskMove={async (taskId, status) => {
                await projectService.updateTaskStatus(taskId, status);
                await fetchProjectData();
              }}
            />
          )}

          {activeTab === 'tasks' && (
            <TaskManager
              tasks={data.tasks}
              projects={data.projects}
              members={data.members}
              onTaskCreate={async (taskData) => {
                await projectService.createTask(taskData);
                await fetchProjectData();
              }}
              onTaskUpdate={async (taskId, updates) => {
                await projectService.updateTask(taskId, updates);
                await fetchProjectData();
              }}
              onTaskDelete={async (taskId) => {
                if (window.confirm('آیا از حذف این وظیفه اطمینان دارید؟')) {
                  await projectService.deleteTask(taskId);
                  await fetchProjectData();
                }
              }}
            />
          )}

          {activeTab === 'timeline' && (
            <ProjectTimeline
              projects={data.projects}
              tasks={data.tasks}
              onDateChange={async (projectId, dates) => {
                await projectService.updateProjectDates(projectId, dates);
                await fetchProjectData();
              }}
            />
          )}

          {activeTab === 'team' && (
            <TeamManager
              teams={data.teams}
              members={data.members}
              onMemberAdd={async (teamId, memberId) => {
                await projectService.addTeamMember(teamId, memberId);
                await fetchProjectData();
              }}
              onMemberRemove={async (teamId, memberId) => {
                await projectService.removeTeamMember(teamId, memberId);
                await fetchProjectData();
              }}
              onTeamCreate={async (teamData) => {
                await projectService.createTeam(teamData);
                await fetchProjectData();
              }}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}