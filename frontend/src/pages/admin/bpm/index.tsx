// frontend/src/pages/admin/bpm/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { ProcessDesigner } from '@/components/admin/bpm/ProcessDesigner';
import { WorkflowList } from '@/components/admin/bpm/WorkflowList';
import { TaskManager } from '@/components/admin/bpm/TaskManager';
import { bpmService } from '@/services/bpm.service';

export default function AdminBPM() {
  const [activeTab, setActiveTab] = useState('processes');
  const [selectedProcess, setSelectedProcess] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    processes: [],
    workflows: [],
    tasks: [],
    stats: {}
  });
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all',
    search: ''
  });

  const tabs = [
    { id: 'processes', label: 'فرآیندها' },
    { id: 'workflows', label: 'گردش‌های کاری' },
    { id: 'tasks', label: 'وظایف' },
    { id: 'analytics', label: 'تحلیل‌ها' }
  ];

  useEffect(() => {
    fetchBPMData();
  }, [activeTab, filters]);

  const fetchBPMData = async () => {
    try {
      setLoading(true);
      const response = await bpmService.getData({
        tab: activeTab,
        filters
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching BPM data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">مدیریت فرآیندهای کسب و کار</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                <span className="text-sm text-green-800">
                  {data.stats?.activeProcesses || 0} فرآیند فعال
                </span>
              </div>
              <button
                onClick={() => setSelectedProcess({})}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                ایجاد فرآیند جدید
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
                  {tab.id === 'tasks' && data.stats?.pendingTasks > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                      {data.stats.pendingTasks}
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
                placeholder="جستجو..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="border rounded-lg p-2"
              />
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="all">همه دسته‌ها</option>
                <option value="hr">منابع انسانی</option>
                <option value="finance">مالی</option>
                <option value="sales">فروش</option>
                <option value="support">پشتیبانی</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="active">فعال</option>
                <option value="draft">پیش‌نویس</option>
                <option value="archived">آرشیو شده</option>
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
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {activeTab === 'processes' && (
              <>
                {/* لیست فرآیندها */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg border">
                    {data.processes.map((process: any) => (
                      <div
                        key={process.id}
                        className="p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedProcess(process)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{process.name}</h3>
                            <p className="text-sm text-gray-500">{process.description}</p>
                            <div className="mt-2 flex items-center gap-4">
                              <span className={`
                                px-2 py-1 rounded-full text-xs
                                ${process.status === 'active' ? 'bg-green-100 text-green-800' :
                                  process.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'}
                              `}>
                                {process.status === 'active' ? 'فعال' :
                                 process.status === 'draft' ? 'پیش‌نویس' : 'آرشیو شده'}
                              </span>
                              <span className="text-sm text-gray-500">
                                {process.category === 'hr' ? 'منابع انسانی' :
                                 process.category === 'finance' ? 'مالی' :
                                 process.category === 'sales' ? 'فروش' : 'پشتیبانی'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProcess(process);
                              }}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              ویرایش
                            </button>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (window.confirm('آیا از حذف این فرآیند اطمینان دارید؟')) {
                                  await bpmService.deleteProcess(process.id);
                                  await fetchBPMData();
                                }
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* طراح فرآیند */}
                <div className="lg:col-span-1">
                  {selectedProcess && (
                    <ProcessDesigner
                      process={selectedProcess}
                      onSave={async (data) => {
                        if (data.id) {
                          await bpmService.updateProcess(data.id, data);
                        } else {
                          await bpmService.createProcess(data);
                        }
                        setSelectedProcess(null);
                        await fetchBPMData();
                      }}
                      onCancel={() => setSelectedProcess(null)}
                    />
                  )}
                </div>
              </>
            )}

            {activeTab === 'workflows' && (
              <WorkflowList
                workflows={data.workflows}
                onStart={async (processId) => {
                  await bpmService.startWorkflow(processId);
                  await fetchBPMData();
                }}
                onCancel={async (workflowId) => {
                  if (window.confirm('آیا از لغو این گردش کاری اطمینان دارید؟')) {
                    await bpmService.cancelWorkflow(workflowId);
                    await fetchBPMData();
                  }
                }}
              />
            )}

            {activeTab === 'tasks' && (
              <TaskManager
                tasks={data.tasks}
                onComplete={async (taskId) => {
                  await bpmService.completeTask(taskId);
                  await fetchBPMData();
                }}
                onAssign={async (taskId, userId) => {
                  await bpmService.assignTask(taskId, userId);
                  await fetchBPMData();
                }}
              />
            )}

            {activeTab === 'analytics' && (
              <BPMAnalytics
                stats={data.stats}
                onDateRangeChange={async (range) => {
                  const response = await bpmService.getAnalytics(range);
                  setData(prev => ({ ...prev, stats: response.data }));
                }}
              />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}