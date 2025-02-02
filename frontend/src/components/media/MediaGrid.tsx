
// frontend/src/components/media/MediaGrid.tsx
interface MediaGridProps {
    files: any[];
    loading: boolean;
    view: 'grid' | 'list';
    selectedFiles: string[];
    onFileSelect: (id: string) => void;
    onFolderClick: (id: string) => void;
  }
  
  export const MediaGrid = ({
    files,
    loading,
    view,
    selectedFiles,
    onFileSelect,
    onFolderClick
  }: MediaGridProps) => {
    if (loading) {
      return <div>در حال بارگذاری...</div>;
    }
  
    if (view === 'grid') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {files.map(file => (
            <div
              key={file.id}
              className={`
                relative group rounded-lg overflow-hidden border-2
                ${selectedFiles.includes(file.id) ? 'border-blue-500' : 'border-transparent'}
              `}
              onClick={() => file.type === 'folder' ? onFolderClick(file.id) : onFileSelect(file.id)}
            >
              {file.type === 'folder' ? (
                <div className="p-4 bg-gray-50 hover:bg-gray-100">
                  <FolderIcon className="w-12 h-12 text-gray-400" />
                  <p className="mt-2 text-sm truncate">{file.name}</p>
                </div>
              ) : (
                <>
                  <img
                    src={file.thumbnail || file.url}
                    alt={file.name}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm truncate">{file.name}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      );
    }
  
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8" />
              <th>نام</th>
              <th>نوع</th>
              <th>اندازه</th>
              <th>تاریخ</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map(file => (
              <tr
                key={file.id}
                className={selectedFiles.includes(file.id) ? 'bg-blue-50' : ''}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => onFileSelect(file.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="flex items-center space-x-2">
                  {file.type === 'folder' ? (
                    <FolderIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <img
                      src={file.thumbnail || file.url}
                      alt={file.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                  )}
                  <span>{file.name}</span>
                </td>
                <td>{file.type}</td>
                <td>{file.size ? formatFileSize(file.size) : '-'}</td>
                <td>{new Date(file.created_at).toLocaleDateString('fa-IR')}</td>
                <td>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {/* Handle action */}}
                  >
                    {file.type === 'folder' ? 'باز کردن' : 'دانلود'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };