// frontend/src/pages/users/index.tsx
import { useState, useEffect } from 'react';
import { Layout } from '@/components/common/Layout';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { userService } from '@/services/api.service';
import { Modal } from '@/components/ui/Modal';
import { UserForm } from '@/components/users/UserForm';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const columns = [
    {
      key: 'name',
      title: 'نام',
      render: (value: string, record: any) => (
        <div className="flex items-center">
          <img
            src={record.avatar || '/images/default-avatar.png'}
            alt={value}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span>{value}</span>
        </div>
      )
    },
    { key: 'email', title: 'ایمیل' },
    { key: 'role', title: 'نقش' },
    {
      key: 'status',
      title: 'وضعیت',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value === 'active' ? 'فعال' : 'غیرفعال'}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'عملیات',
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEdit(record)}
          >
            ویرایش
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(record.id)}
          >
            حذف
          </Button>
        </div>
      )
    }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
      try {
        await userService.delete(id);
        await fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedUser) {
        await userService.update(selectedUser.id, data);
      } else {
        await userService.create(data);
      }
      setModalOpen(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">مدیریت کاربران</h1>
          <Button onClick={() => setModalOpen(true)}>
            افزودن کاربر جدید
          </Button>
        </div>

        <Table
          columns={columns}
          data={users}
          loading={loading}
        />

        <Modal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedUser(null);
          }}
          title={selectedUser ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}
        >
          <UserForm
            initialData={selectedUser}
            onSubmit={handleSubmit}
            onCancel={() => {
              setModalOpen(false);
              setSelectedUser(null);
            }}
          />
        </Modal>
      </div>
    </Layout>
  );
}

