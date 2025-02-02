// frontend/src/pages/admin/sliders/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { SliderForm } from '@/components/admin/sliders/SliderForm';
import { BannerForm } from '@/components/admin/sliders/BannerForm';
import { ImagePreview } from '@/components/admin/sliders/ImagePreview';
import { sliderService } from '@/services/slider.service';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function AdminSliders() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('sliders');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [slidersRes, bannersRes] = await Promise.all([
        sliderService.getSliders(),
        sliderService.getBanners()
      ]);
      setSliders(slidersRes.data);
      setBanners(bannersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(activeTab === 'sliders' ? sliders : banners);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    if (activeTab === 'sliders') {
      setSliders(items);
      await sliderService.reorderSliders(items.map(item => item._id));
    } else {
      setBanners(items);
      await sliderService.reorderBanners(items.map(item => item._id));
    }
  };

  const handleSave = async (data: any, type: 'slider' | 'banner') => {
    try {
      if (editing) {
        if (type === 'slider') {
          await sliderService.updateSlider(editing._id, data);
        } else {
          await sliderService.updateBanner(editing._id, data);
        }
      } else {
        if (type === 'slider') {
          await sliderService.createSlider(data);
        } else {
          await sliderService.createBanner(data);
        }
      }
      await fetchData();
      setEditing(null);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleDelete = async (id: string, type: 'slider' | 'banner') => {
    if (window.confirm('آیا از حذف این آیتم اطمینان دارید؟')) {
      try {
        if (type === 'slider') {
          await sliderService.deleteSlider(id);
        } else {
          await sliderService.deleteBanner(id);
        }
        await fetchData();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        {/* هدر و تب‌ها */}
        <div className="border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold">مدیریت اسلایدر و بنرها</h1>
          </div>
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('sliders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sliders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              اسلایدرها
            </button>
            <button
              onClick={() => setActiveTab('banners')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'banners'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              بنرها
            </button>
          </nav>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* فرم */}
            <div className="lg:col-span-1">
              {activeTab === 'sliders' ? (
                <SliderForm
                  initialData={editing}
                  onSubmit={(data) => handleSave(data, 'slider')}
                  onCancel={() => setEditing(null)}
                />
              ) : (
                <BannerForm
                  initialData={editing}
                  onSubmit={(data) => handleSave(data, 'banner')}
                  onCancel={() => setEditing(null)}
                />
              )}
            </div>

            {/* لیست آیتم‌ها */}
            <div className="lg:col-span-2">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="items">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {(activeTab === 'sliders' ? sliders : banners).map(
                        (item, index) => (
                          <Draggable
                            key={item._id}
                            draggableId={item._id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="border rounded-lg p-4"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <ImagePreview
                                      src={item.image}
                                      alt={item.title}
                                    />
                                    <h3 className="font-medium mt-2">
                                      {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                      {item.description}
                                    </p>
                                    {item.link && (
                                      <div className="text-sm text-blue-600 mt-1">
                                        لینک: {item.link}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => setEditing(item)}
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      ویرایش
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDelete(
                                          item._id,
                                          activeTab === 'sliders'
                                            ? 'slider'
                                            : 'banner'
                                        )
                                      }
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      حذف
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        )
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}