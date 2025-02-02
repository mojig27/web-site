
// frontend/src/components/content/RevisionCompare.tsx
import { useState, useEffect } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { contentService } from '@/services/content.service';

interface RevisionCompareProps {
  contentId: string;
  revisions: any[];
}

export const RevisionCompare = ({
  contentId,
  revisions
}: RevisionCompareProps) => {
  const [selectedRevisions, setSelectedRevisions] = useState<string[]>([]);
  const [diffContent, setDiffContent] = useState<{
    original: string;
    modified: string;
  }>({ original: '', modified: '' });

  useEffect(() => {
    if (selectedRevisions.length === 2) {
      fetchDiff();
    }
  }, [selectedRevisions]);

  const fetchDiff = async () => {
    try {
      const [rev1, rev2] = selectedRevisions;
      const response = await contentService.compareRevisions(
        contentId,
        rev1,
        rev2
      );
      setDiffContent(response.data);
    } catch (error) {
      console.error('Error fetching diff:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        {/* Revision Selectors */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <div>
            <label className="block text-sm font-medium mb-1">
              نسخه اول
            </label>
            <Select
              value={selectedRevisions[0]}
              onChange={(value) => setSelectedRevisions([value, selectedRevisions[1]])}
              options={revisions.map((rev) => ({
                value: rev._id,
                label: `${new Date(rev.created_at).toLocaleString('fa-IR')} - ${rev.author.name}`
              }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              نسخه دوم
            </label>
            <Select
              value={selectedRevisions[1]}
              onChange={(value) => setSelectedRevisions([selectedRevisions[0], value])}
              options={revisions.map((rev) => ({
                value: rev._id,
                label: `${new Date(rev.created_at).toLocaleString('fa-IR')} - ${rev.author.name}`
              }))}
            />
          </div>
        </div>
      </div>

      {/* Diff Editor */}
      {selectedRevisions.length === 2 && (
        <div className="h-[600px] border rounded-lg overflow-hidden">
          <DiffEditor
            original={diffContent.original}
            modified={diffContent.modified}
            language="markdown"
            theme="light"
            options={{
              readOnly: true,
              renderSideBySide: true,
              minimap: { enabled: false }
            }}
          />
        </div>
      )}

      {/* Actions */}
      {selectedRevisions.length === 2 && (
        <div className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            onClick={() => setSelectedRevisions([])}
          >
            پاک کردن
          </Button>
          <Button
            onClick={() => {
              // Handle restore revision
              if (window.confirm('آیا از بازگردانی به این نسخه اطمینان دارید؟')) {
                contentService.restoreRevision(contentId, selectedRevisions[1]);
              }
            }}
          >
            بازگردانی به این نسخه
          </Button>
        </div>
      )}
    </div>
  );
};