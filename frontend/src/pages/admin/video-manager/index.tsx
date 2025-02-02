// frontend/src/pages/admin/video-manager/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { VideoUploader } from '@/components/admin/video/VideoUploader';
import { VideoList } from '@/components/admin/video/VideoList';
import { VideoPlayer } from '@/components/admin/video/VideoPlayer';
import { videoService } from '@/services/video.service';

export default function AdminVideoManager() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    videos: [],
    categories: [],
    analytics: {}
  });
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    quality: 'all',
    search: ''
  });

  const tabs = [
    { id: 'all', label: 'همه ویدیوها' },
    { id: 'processing', label: 'در حال پردازش' },
    { id: 'live', label: 'پخش زنده' },
    { id: 'playlists', label: 'پلی‌لیست‌ها' }
  ];

  useEffect(() => {
    fetchVideoData();
  }, [activeTab, filters]);

  const fetchVideoData = async () => {
    try {
      setLoading(true);
      const response = await videoService.getVideos({
        tab: activeTab,
        filters
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching video data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">مدیریت محتوای ویدیویی</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedVideo({})}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                آپلود ویدیو جدید
              </button>
            </div>
          </div>
        </div>

        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* فیلترها */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="جستجو..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="border rounded-lg p-2"
              />
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="all">همه دسته‌ها</option>
                {data.categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <select
                value={filters.quality}
                onChange={(e) => setFilters({ ...filters, quality: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="all">همه کیفیت‌ها</option>
                <option value="4K">4K</option>
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="published">منتشر شده</option>
                <option value="private">خصوصی</option>
                <option value="processing">در حال پردازش</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* لیست ویدیوها */}
            <div className="lg:col-span-2">
              <VideoList
                videos={data.videos}
                loading={loading}
                onSelect={setSelectedVideo}
                onDelete={async (id) => {
                  if (window.confirm('آیا از حذف این ویدیو اطمینان دارید؟')) {
                    await videoService.deleteVideo(id);
                    await fetchVideoData();
                  }
                }}
                onStatusChange={async (id, status) => {
                  await videoService.updateVideoStatus(id, status);
                  await fetchVideoData();
                }}
              />
            </div>

            {/* جزئیات و ویرایش ویدیو */}
            <div className="lg:col-span-1">
              {selectedVideo?.id ? (
                <VideoEditor
                  video={selectedVideo}
                  onSave={async (data) => {
                    await videoService.updateVideo(selectedVideo.id, data);
                    await fetchVideoData();
                    setSelectedVideo(null);
                  }}
                  onCancel={() => setSelectedVideo(null)}
                />
              ) : selectedVideo ? (
                <VideoUploader
                  onUpload={async (data) => {
                    await videoService.uploadVideo(data);
                    await fetchVideoData();
                    setSelectedVideo(null);
                  }}
                  onCancel={() => setSelectedVideo(null)}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

