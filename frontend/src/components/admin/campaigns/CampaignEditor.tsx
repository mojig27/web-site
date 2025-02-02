
// frontend/src/components/admin/campaigns/CampaignEditor.tsx
import { useForm } from 'react-hook-form';
import { MediaUploader } from '@/components/common/MediaUploader';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import { BudgetPlanner } from '@/components/admin/campaigns/BudgetPlanner';

interface CampaignEditorProps {
  campaign: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const CampaignEditor: React.FC<CampaignEditorProps> = ({
  campaign,
  onSave,
  onCancel
}) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: campaign || {
      name: '',
      type: '',
      platform: '',
      status: 'draft',
      budget: {
        daily: 0,
        total: 0,
        currency: 'IRR'
      },
      targeting: {
        locations: [],
        interests: [],
        demographics: {
          ageRange: [18, 65],
          gender: 'all'
        }
      },
      schedule: {
        startDate: '',
        endDate: '',
        dayParting: []
      },
      content: {
        title: '',
        description: '',
        media: []
      }
    }
  });

  const campaignType = watch('type');

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          نام کمپین
        </label>
        <input
          type="text"
          {...register('name', { required: 'نام کمپین الزامی است' })}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            نوع کمپین
          </label>
          <select
            {...register('type', { required: 'نوع کمپین الزامی است' })}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          >
            <option value="">انتخاب کنید</option>
            <option value="display">تبلیغات نمایشی</option>
            <option value="email">ایمیل مارکتینگ</option>
            <option value="social">شبکه‌های اجتماعی</option>
            <option value="search">تبلیغات جستجو</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            پلتفرم
          </label>
          <select
            {...register('platform')}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          >
            <option value="">انتخاب کنید</option>
            <option value="google">Google Ads</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="telegram">Telegram</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          زمان‌بندی
        </label>
        <DateRangePicker
          value={watch('schedule')}
          onChange={(dates) => {
            setValue('schedule.startDate', dates.from);
            setValue('schedule.endDate', dates.to);
          }}
        />
      </div>

      <BudgetPlanner
        value={watch('budget')}
        onChange={(budget) => setValue('budget', budget)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          هدف‌گذاری
        </label>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">موقعیت‌های جغرافیایی</label>
            <input
              type="text"
              placeholder="شهر یا استان را وارد کنید"
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600">علایق</label>
            <input
              type="text"
              placeholder="علایق کاربران را وارد کنید"
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600">بازه سنی</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  {...register('targeting.demographics.ageRange.0')}
                  className="w-20 border rounded-md shadow-sm p-2"
                />
                <span>تا</span>
                <input
                  type="number"
                  {...register('targeting.demographics.ageRange.1')}
                  className="w-20 border rounded-md shadow-sm p-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600">جنسیت</label>
              <select
                {...register('targeting.demographics.gender')}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              >
                <option value="all">همه</option>
                <option value="male">مرد</option>
                <option value="female">زن</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          محتوای تبلیغ
        </label>
        <div className="space-y-4">
          <input
            type="text"
            {...register('content.title')}
            placeholder="عنوان تبلیغ"
            className="block w-full border rounded-md shadow-sm p-2"
          />
          
          <textarea
            {...register('content.description')}
            placeholder="توضیحات تبلیغ"
            rows={4}
            className="block w-full border rounded-md shadow-sm p-2"
          />

          <MediaUploader
            files={watch('content.media')}
            onChange={(files) => setValue('content.media', files)}
            accept={campaignType === 'display' ? 'image/*' : '*/*'}
            multiple
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
        >
          انصراف
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {campaign.id ? 'به‌روزرسانی' : 'ایجاد'} کمپین
        </button>
      </div>
    </form>
  );
};