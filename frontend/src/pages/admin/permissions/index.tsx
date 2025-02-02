// frontend/src/pages/admin/permissions/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { RoleManager } from '@/components/admin/permissions/RoleManager';
import { UserPermissions } from '@/components/admin/permissions/UserPermissions';
import { AccessLog } from '@/components/admin/permissions/AccessLog';
import { permissionService } from '@/services/permission.service';

export default function AdminPermissions() {
  const [activeTab, setActiveTab] = useState('roles');
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    roles: [],
    users: [],
    permissions: [],
    logs: []
  });
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    search: ''
  });

  const tabs = [
    { id: 'roles', label: 'نقش‌ها' },
    { id: 'users', label: 'کاربران' },
    { id: 'logs', label: 'گزارش دسترسی‌ها' },
    { id: 'settings', label: 'تنظیمات' }
  ];

  useEffect(() => {
    fetchPermissionData();
  }, [activeTab, filters]);

  const fetchPermissionData = async () => {
    try {
      setLoading(true);
      const response = await permissionService.getData({
        tab: activeTab,
        filters
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching permission data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">مدیریت دسترسی‌ها و مجوزها</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                <span className="text-sm text-blue-800">
                  {data.stats?.totalUsers || 0} کاربر در {data.stats?.totalRoles || 0} نقش
                </span>
              </div>
              <button
                onClick={() => setSelectedRole({})}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                ایجاد نقش جدید
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
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* فیلترها */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="جستجو..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="border rounded-lg p-2"
              />
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="all">همه نقش‌ها</option>
                <option value="admin">مدیر</option>
                <option value="manager">مدیر بخش</option>
                <option value="user">کاربر عادی</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="active">فعال</option>
                <option value="inactive">غیرفعال</option>
                <option value="blocked">مسدود</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {activeTab === 'roles' && (
              <>
                {/* لیست نقش‌ها */}
                <div className="lg:col-span-2">
                  <RoleManager
                    roles={data.roles}
                    permissions={data.permissions}
                    loading={loading}
                    onSelect={setSelectedRole}
                    onUpdateRole={async (roleId, roleData) => {
                      await permissionService.updateRole(roleId, roleData);
                      await fetchPermissionData();
                    }}
                    onDeleteRole={async (roleId) => {
                      if (window.confirm('آیا از حذف این نقش اطمینان دارید؟')) {
                        await permissionService.deleteRole(roleId);
                        await fetchPermissionData();
                      }
                    }}
                  />
                </div>

                {/* ویرایشگر نقش */}
                <div className="lg:col-span-1">
                  {selectedRole && (
                    <RoleEditor
                      role={selectedRole}
                      permissions={data.permissions}
                      onSave={async (data) => {
                        if (data.id) {
                          await permissionService.updateRole(data.id, data);
                        } else {
                          await permissionService.createRole(data);
                        }
                        setSelectedRole(null);
                        await fetchPermissionData();
                      }}
                      onCancel={() => setSelectedRole(null)}
                    />
                  )}
                </div>
              </>
            )}

            {activeTab === 'users' && (
              <UserPermissions
                users={data.users}
                roles={data.roles}
                permissions={data.permissions}
                onUpdateUser={async (userId, userData) => {
                  await permissionService.updateUserPermissions(userId, userData);
                  await fetchPermissionData();
                }}
              />
            )}

            {activeTab === 'logs' && (
              <AccessLog
                logs={data.logs}
                onDateRangeChange={async (range) => {
                  const response = await permissionService.getLogs(range);
                  setData(prev => ({ ...prev, logs: response.data }));
                }}
              />
            )}

            {activeTab === 'settings' && (
              <PermissionSettings
                settings={data.settings}
                onUpdate={async (settings) => {
                  await permissionService.updateSettings(settings);
                  await fetchPermissionData();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}