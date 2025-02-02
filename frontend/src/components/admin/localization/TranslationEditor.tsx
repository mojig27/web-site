
// frontend/src/components/admin/localization/TranslationEditor.tsx
import { useState } from 'react';
import { Editor } from '@/components/common/Editor';

interface TranslationEditorProps {
  translations: any;
  languages: any[];
  selectedLang: string;
  onSave: (key: string, translations: any) => void;
}

export const TranslationEditor: React.FC<TranslationEditorProps> = ({
  translations,
  languages,
  selectedLang,
  onSave
}) => {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editedTranslations, setEditedTranslations] = useState<any>({});

  const handleEdit = (key: string) => {
    setEditingKey(key);
    setEditedTranslations({
      ...translations[key]
    });
  };

  const handleSave = async () => {
    if (editingKey) {
      await onSave(editingKey, editedTranslations);
      setEditingKey(null);
    }
  };

  const filteredTranslations = Object.entries(translations).filter(([key]) =>
    key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="جستجو در ترجمه‌ها..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border rounded-lg p-2"
      />

      <div className="border rounded-lg divide-y">
        {filteredTranslations.map(([key, values]) => (
          <div key={key} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium">{key}</div>
              <button
                onClick={() => handleEdit(key)}
                className="text-blue-600 hover:text-blue-700"
              >
                ویرایش
              </button>
            </div>

            {editingKey === key ? (
              <div className="space-y-4">
                {languages.map((lang) => (
                  <div key={lang.code}>
                    <label className="block text-sm text-gray-700 mb-1">
                      {lang.name}:
                    </label>
                    <input
                      type="text"
                      value={editedTranslations[lang.code] || ''}
                      onChange={(e) => setEditedTranslations({
                        ...editedTranslations,
                        [lang.code]: e.target.value
                      })}
                      className="w-full border rounded-md p-2"
                    />
                  </div>
                ))}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingKey(null)}
                    className="px-3 py-1 border rounded-md"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md"
                  >
                    ذخیره
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {languages.map((lang) => (
                  <div key={lang.code}>
                    <span className="text-sm text-gray-500">{lang.name}:</span>
                    <span className="mr-2">{values[lang.code]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};