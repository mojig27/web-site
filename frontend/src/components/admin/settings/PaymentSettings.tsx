// frontend/src/components/admin/settings/PaymentSettings.tsx
import { useForm, useFieldArray } from 'react-hook-form';
import { Switch } from '@/components/common/Switch';

interface PaymentSettingsProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  saving: boolean;
}

export const PaymentSettings: React.FC<PaymentSettingsProps> = ({
  settings,
  onSave,
  saving
}) => {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      payment: {
        gateways: settings.payment?.gateways || [],
        enableWallet: settings.payment?.enableWallet || false,
        walletSettings: settings.payment?.walletSettings || {
          minCharge: 10000,
          maxCharge: 10000000
        },
        installmentPayment: settings.payment?.installmentPayment || {
          enabled: false,
          minAmount: 1000000,
          maxMonths: 12
        }
      }
    }
  });

  const { fields: gatewayFields, append: appendGateway, remove: removeGateway } = 
    useFieldArray({
      control,
      name: "payment.gateways"
    });

  const enableWallet = watch("payment.enableWallet");
  const enableInstallment = watch("payment.installmentPayment.enabled");

  const onSubmit = async (data: any) => {
    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* درگاه‌های پرداخت */}
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          درگاه‌های پرداخت
        </h3>
        <div className="space-y-4">
          {gatewayFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    نام درگاه
                  </label>
                  <select
                    {...register(`payment.gateways.${index}.provider`, {
                      required: 'انتخاب درگاه الزامی است'
                    })}
                    className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  >
                    <option value="">انتخاب درگاه</option>
                    <option value="zarinpal">زرین‌پال</option>
                    <option value="nextpay">نکست‌پی</option>
                    <option value="idpay">آیدی پی</option>
                    <option value="payping">پی‌پینگ</option>
                    <option value="zibal">زیبال</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    عنوان نمایشی
                  </label>
                  <input
                    type="text"
                    {...register(`payment.gateways.${index}.title`, {
                      required: 'عنوان نمایشی الزامی است'
                    })}
                    className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    کلید API (Merchant ID)
                  </label>
                  <input
                    type="text"
                    {...register(`payment.gateways.${index}.apiKey`, {
                      required: 'کلید API الزامی است'
                    })}
                    className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    اولویت نمایش
                  </label>
                  <input
                    type="number"
                    {...register(`payment.gateways.${index}.order`, {
                      min: 0
                    })}
                    className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center space-x-4">
                    <Switch
                      {...register(`payment.gateways.${index}.enabled`)}
                      label="فعال"
                    />
                    <Switch
                      {...register(`payment.gateways.${index}.isDefault`)}
                      label="درگاه پیش‌فرض"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => removeGateway(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  حذف این درگاه
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => appendGateway({
              provider: '',
              title: '',
              apiKey: '',
              enabled: true,
              isDefault: false,
              order: gatewayFields.length
            })}
            className="text-blue-600 hover:text-blue-700"
          >
            + افزودن درگاه جدید
          </button>
        </div>
      </div>

      {/* کیف پول */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            کیف پول
          </h3>
          <Switch
            {...register('payment.enableWallet')}
            label="فعال‌سازی کیف پول"
          />
        </div>

        {enableWallet && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                حداقل مبلغ شارژ (تومان)
              </label>
              <input
                type="number"
                {...register('payment.walletSettings.minCharge', {
                  required: 'این مقدار الزامی است',
                  min: {
                    value: 1000,
                    message: 'حداقل مبلغ شارژ باید بیشتر از 1000 تومان باشد'
                  }
                })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                حداکثر مبلغ شارژ (تومان)
              </label>
              <input
                type="number"
                {...register('payment.walletSettings.maxCharge', {
                  required: 'این مقدار الزامی است',
                  min: {
                    value: 1000,
                    message: 'حداکثر مبلغ شارژ باید بیشتر از 1000 تومان باشد'
                  }
                })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* پرداخت اقساطی */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            پرداخت اقساطی
          </h3>
          <Switch
            {...register('payment.installmentPayment.enabled')}
            label="فعال‌سازی پرداخت اقساطی"
          />
        </div>

        {enableInstallment && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                حداقل مبلغ خرید اقساطی (تومان)
              </label>
              <input
                type="number"
                {...register('payment.installmentPayment.minAmount', {
                  required: 'این مقدار الزامی است',
                  min: {
                    value: 100000,
                    message: 'حداقل مبلغ باید بیشتر از 100,000 تومان باشد'
                  }
                })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                حداکثر تعداد اقساط
              </label>
              <input
                type="number"
                {...register('payment.installmentPayment.maxMonths', {
                  required: 'این مقدار الزامی است',
                  min: {
                    value: 1,
                    message: 'حداقل تعداد اقساط 1 ماه است'
                  },
                  max: {
                    value: 24,
                    message: 'حداکثر تعداد اقساط 24 ماه است'
                  }
                })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
            </div>
          </div>
        )}
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