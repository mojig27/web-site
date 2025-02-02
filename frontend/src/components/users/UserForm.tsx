
// frontend/src/components/users/UserForm.tsx
import { useState } from 'react';
import { InputField } from '@/components/forms/InputField';
import { Button } from '@/components/ui/Button';

interface UserFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const UserForm = ({
  initialData,
  onSubmit,
  onCancel
}: UserFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    role: initialData?.role || 'user',
    status: initialData?.status || 'active'
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is changed
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: any = {};

    if (!formData.name) {
      newErrors.name = 'نام الزامی است';
    }

    if (!formData.email) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'فرمت ایمیل صحیح نیست';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="نام"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <InputField
        label="ایمیل"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          نقش
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="user">کاربر عادی</option>
          <option value="admin">مدیر</option>
          <option value="editor">ویرایشگر</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          وضعیت
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="active">فعال</option>
          <option value="inactive">غیرفعال</option>
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="secondary" onClick={onCancel}>
          انصراف
        </Button>
        <Button type="submit">
          {initialData ? 'ویرایش' : 'افزودن'}
        </Button>
      </div>
    </form>
  );
};