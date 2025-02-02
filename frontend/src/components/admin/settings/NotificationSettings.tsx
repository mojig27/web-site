// frontend/src/components/admin/settings/NotificationSettings.tsx
import { useForm } from 'react-hook-form';
import { Switch } from '@/components/common/Switch';

interface NotificationSettingsProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  saving: boolean;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  settings,
  onSave,
  saving
}) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      notifications: {
        sms: settings.notifications?.sms || {
          enabled: false,
          provider: '',
          apiKey: '',
          lineNumber: '',
          templates: {
            orderConfirmation: '',
            orderShipped: '',
            orderDelivered: '',
            orderCanceled: '',
            otpCode: ''
          }
        },
        email: settings.notifications?.email || {
          enabled: false,
          host: '',
          port: '',
          username: '',
          password: '',
          fromEmail: '',
          fromName: ''
        },
        pushNotification: settings.notifications?.pushNotification || {
          enabled: false,
          webPush: {
            publicKey: '',
            privateKey: '',
            serviceWorkerPath: ''
          }
        },
        telegram: settings.notifications?.telegram || {
          enabled: false,
          botToken: '',
          channelId: ''
        },
        adminNotifications: settings.notifications?.adminNotifications || {
          newOrder: true,
          lowStock: true,
          userRegistration: true,
          newComment: true
        }
      }
    }
  });

  const smsEnabled = watch('notifications.sms.enabled');
  const emailEnabled = watch('notifications.email.enabled');
  const pushEnabled = watch('notifications.pushNotification.enabled');
  const telegramEnabled = watch('notifications.telegram.enabled');

  const onSubmit = async (data: any) => {
    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* تنظیمات پیامک */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            تنظیمات پیامک
          </h3>
          <Switch
            {...register('notifications.sms.enabled')}
            label="فعال‌سازی سیستم پیامک"
          />
        </div>

        {smsEnabled && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                سرویس دهنده پیامک
              </label>
              <select
                {...register('notifications.sms.provider', {
                  required: 'انتخاب سرویس دهنده الزامی است'
                })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              >
                <option value="">انتخاب سرویس دهنده</option>
                <option value="kavenegar">کاوه‌نگار</option>
                <option value="melipayamak">ملی پیامک</option>
                <option value="ghasedak">قاصدک</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                کلید API
              </label>
              <input
                type="text"
                {...register('notifications.sms.apiKey', {
                  required: 'کلید API الزامی است'
                })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                شماره خط
              </label>
              <input
                type="text"
                {...register('notifications.sms.lineNumber')}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
            </div>

            <div className="md:col-span-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                قالب‌های پیامک
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600">
                    تایید سفارش
                  </label>
                  <textarea
                    {...register('notifications.sms.templates.orderConfirmation')}
                    rows={2}
                    className="mt-1 block w-full border rounded-md shadow-sm p-2"
                    placeholder="متغیرها: {orderNumber}, {totalAmount}, {customerName}"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">
                    ارسال سفارش
                  </label>
                  <textarea
                    {...register('notifications.sms.templates.orderShipped')}
                    rows={2}
                    className="mt-1 block w-full border rounded-md shadow-sm p-2"
                    placeholder="متغیرها: {orderNumber}, {trackingCode}"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">
                    کد تایید
                  </label>
                  <textarea
                    {...register('notifications.sms.templates.otpCode')}
                    rows={2}
                    className="mt-1 block w-full border rounded-md shadow-sm p-2"
                    placeholder="متغیرها: {code}, {expireMinutes}"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* تنظیمات ایمیل */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            تنظیمات ایمیل
          </h3>
          <Switch
            {...register('notifications.email.enabled')}
            label="فعال‌سازی ارسال ایمیل"
          />
        </div>

        {emailEnabled && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                سرور SMTP
              </label>
              <input
                type="text"
                {...register('notifications.email.host')}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                placeholder="mail.example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                پورت SMTP
              </label>
              <input
                type="number"
                {...register('notifications.email.port')}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                placeholder="587"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                نام کاربری
              </label>
              <input
                type="text"
                {...register('notifications.email.username')}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                رمز عبور
              </label>
              <input
                type="password"
                {...register('notifications.email.password')}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                ایمیل فرستنده
              </label>
              <input
                type="email"
                {...register('notifications.email.fromEmail')}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                نام نمایشی فرستنده
              </label>
              <input
                type="text"
                {...register('notifications.email.fromName')}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* تنظیمات نوتیفیکیشن مرورگر */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            نوتیفیکیشن مرورگر
          </h3>
          <Switch
            {...register('notifications.pushNotification.enabled')}
            label="فعال‌سازی نوتیفیکیشن مرورگر"
          />
        </div>

        {pushEnabled && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                کلید عمومی VAPID
              </label>
              <input
                type="text"
                {...register('notifications.pushNotification.webPush.publicKey')}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                کلید خصوصی VAPID
              </label>
              <input
                type="text"
                {...register('notifications.pushNotification.webPush.privateKey')}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* تنظیمات تلگرام */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            تنظیمات تلگرام
          </h3>
          <Switch
            {...register('notifications.telegram.enabled')}
            label="فعال‌سازی اعلان‌های تلگرام"
          />
        </div>

        {telegramEnabled && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                توکن ربات
              </label>
              <input
                type="text"
                {...register('notifications.telegram.botToken')}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                شناسه کانال
              </label>
              <input
                type="text"
                {...register('notifications.telegram.channelId')}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* تنظیمات اعلان‌های مدیر */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          اعلان‌های مدیر
        </h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <Switch
              {...register('notifications.adminNotifications.newOrder')}
              label="اعلان سفارش جدید"
            />
          </div>
          <div className="flex items-center">
            <Switch
              {...register('notifications.adminNotifications.lowStock')}
              label="اعلان موجودی کم محصولات"
            />
          </div>
          <div className="flex items-center">
            <Switch
              {...register('notifications.adminNotifications.userRegistration')}
              label="اعلان ثبت‌نام کاربر جدید"
            />
          </div>
          <div className="flex items-center">
            <Switch
              {...register('notifications.adminNotifications.newComment')}
              label="اعلان دیدگاه جدید"
            />
          </div>
        </div>
      </div>

      {/* دکمه ذخیره */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className={`
            px-4 py-2 bg-blue-600 text-white rounded-md
            ${saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
          `}
        >
          {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
        </button>
      </div>
    </form>
  );
};