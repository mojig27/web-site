// frontend/src/components/admin/products/SpecificationsList.tsx
import { useState } from 'react';

interface Specification {
  key: string;
  value: string;
}

interface SpecificationsListProps {
  specifications: Specification[];
  onChange: (specs: Specification[]) => void;
}

export const SpecificationsList: React.FC<SpecificationsListProps> = ({
  specifications,
  onChange
}) => {
  const addSpecification = () => {
    onChange([...specifications, { key: '', value: '' }]);
  };

  const removeSpecification = (index: number) => {
    onChange(specifications.filter((_, i) => i !== index));
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    onChange(newSpecs);
  };

  return (
    <div className="space-y-2">
      {specifications.map((spec, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={spec.key}
            onChange={(e) => updateSpecification(index, 'key', e.target.value)}
            placeholder="عنوان ویژگی"
            className="w-1/3 border rounded-lg p-2"
          />
          <input
            type="text"
            value={spec.value}
            onChange={(e) => updateSpecification(index, 'value', e.target.value)}
            placeholder="مقدار ویژگی"
            className="flex-1 border rounded-lg p-2"
          />
          <button
            type="button"
            onClick={() => removeSpecification(index)}
            className="text-red-500 hover:text-red-600"
          >
            حذف
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addSpecification}
        className="text-blue-600 hover:text-blue-700"
      >
        + افزودن ویژگی جدید
      </button>
    </div>
  );
};