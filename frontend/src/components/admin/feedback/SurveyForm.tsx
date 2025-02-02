
// frontend/src/components/admin/feedback/SurveyForm.tsx
import { useForm } from 'react-hook-form';

interface SurveyFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      type: 'general',
      questions: [],
      active: true,
      startDate: '',
      endDate: '',
      targetAudience: 'all'
    }
  });

  const questions = watch('questions');

  const addQuestion = () => {
    setValue('questions', [
      ...questions,
      {
        text: '',
        type: 'rating',
        required: true,
        options: []
      }
    ]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setValue('questions', newQuestions);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          عنوان نظرسنجی
        </label>
        <input
          type="text"
          {...register('title', { required: 'عنوان الزامی است' })}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          توضیحات
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          نوع نظرسنجی
        </label>
        <select
          {...register('type')}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        >
          <option value="general">عمومی</option>
          <option value="product">محصول</option>
          <option value="service">خدمات</option>
          <option value="website">وب‌سایت</option>
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            سوالات
          </label>
          <button
            type="button"
            onClick={addQuestion}
            className="text-blue-600 hover:text-blue-700"
          >
            + افزودن سوال
          </button>
        </div>

        {questions.map((question: any, index: number) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-sm font-medium">سوال {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="text-red-600 hover:text-red-700"
              >
                حذف
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                {...register(`questions.${index}.text`, { required: true })}
                placeholder="متن سوال"
                className="block w-full border rounded-md shadow-sm p-2"
              />

              <select
                {...register(`questions.${index}.type`)}
                className="block w-full border rounded-md shadow-sm p-2"
              >
                <option value="rating">امتیازدهی</option>
                <option value="text">متنی</option>
                <option value="choice">چند گزینه‌ای</option>
                <option value="boolean">بله/خیر</option>
              </select>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register(`questions.${index}.required`)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label className="mr-2 text-sm text-gray-700">
                  پاسخ اجباری
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            تاریخ شروع
          </label>
          <input
            type="datetime-local"
            {...register('startDate')}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            تاریخ پایان
          </label>
          <input
            type="datetime-local"
            {...register('endDate')}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
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
          {initialData ? 'ویرایش' : 'ایجاد'} نظرسنجی
        </button>
      </div>
    </form>
  );
};