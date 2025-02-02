// frontend/src/pages/admin/calendar/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { Calendar } from '@/components/admin/calendar/Calendar';
import { EventEditor } from '@/components/admin/calendar/EventEditor';
import { calendarService } from '@/services/calendar.service';

export default function AdminCalendar() {
  const [selectedView, setSelectedView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    events: [],
    reminders: [],
    stats: {}
  });
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    priority: 'all'
  });

  const views = [
    { id: 'month', label: 'ماه' },
    { id: 'week', label: 'هفته' },
    { id: 'day', label: 'روز' },
    { id: 'agenda', label: 'لیست' }
  ];

  useEffect(() => {
    fetchCalendarData();
  }, [selectedView, selectedDate, filters]);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const response = await calendarService.getData({
        view: selectedView,
        date: selectedDate,
        filters
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventCreate = async (eventData: any) => {
    try {
      await calendarService.createEvent(eventData);
      await fetchCalendarData();
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleEventUpdate = async (eventId: string, eventData: any) => {
    try {
      await calendarService.updateEvent(eventId, eventData);
      await fetchCalendarData();
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">مدیریت تقویم و رویدادها</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                <span className="text-sm text-blue-800">
                  {data.stats?.upcomingEvents || 0} رویداد پیش رو
                </span>
              </div>
              <button
                onClick={() => setSelectedEvent({})}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                رویداد جدید
              </button>
            </div>
          </div>
        </div>

        <div className="border-b">
          <div className="flex justify-between items-center px-6 py-3">
            <div className="flex items-center gap-4">
              {views.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setSelectedView(view.id)}
                  className={`
                    px-3 py-1 rounded-md text-sm
                    ${selectedView === view.id
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:bg-gray-100'}
                  `}
                >
                  {view.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
              >
                امروز
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    if (selectedView === 'month') {
                      newDate.setMonth(newDate.getMonth() - 1);
                    } else if (selectedView === 'week') {
                      newDate.setDate(newDate.getDate() - 7);
                    } else {
                      newDate.setDate(newDate.getDate() - 1);
                    }
                    setSelectedDate(newDate);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm font-medium">
                  {selectedDate.toLocaleDateString('fa-IR', {
                    year: 'numeric',
                    month: 'long',
                    day: selectedView === 'day' ? 'numeric' : undefined
                  })}
                </span>
                <button
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    if (selectedView === 'month') {
                      newDate.setMonth(newDate.getMonth() + 1);
                    } else if (selectedView === 'week') {
                      newDate.setDate(newDate.getDate() + 7);
                    } else {
                      newDate.setDate(newDate.getDate() + 1);
                    }
                    setSelectedDate(newDate);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* فیلترها و منوی کناری */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* فیلترها */}
                <div className="bg-white rounded-lg border p-4">
                  <h3 className="font-medium mb-4">فیلترها</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">دسته‌بندی</label>
                      <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        className="w-full border rounded-lg p-2"
                      >
                        <option value="all">همه</option>
                        <option value="meeting">جلسات</option>
                        <option value="task">وظایف</option>
                        <option value="reminder">یادآوری‌ها</option>
                        <option value="deadline">مهلت‌ها</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">وضعیت</label>
                      <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="w-full border rounded-lg p-2"
                      >
                        <option value="all">همه</option>
                        <option value="upcoming">پیش رو</option>
                        <option value="ongoing">در جریان</option>
                        <option value="completed">تکمیل شده</option>
                        <option value="cancelled">لغو شده</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">اولویت</label>
                      <select
                        value={filters.priority}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                        className="w-full border rounded-lg p-2"
                      >
                        <option value="all">همه</option>
                        <option value="high">بالا</option>
                        <option value="medium">متوسط</option>
                        <option value="low">پایین</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* آمار سریع */}
                <div className="bg-white rounded-lg border p-4">
                  <h3 className="font-medium mb-4">آمار سریع</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">رویدادهای امروز</span>
                      <span className="font-medium">{data.stats?.todayEvents || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">جلسات هفته</span>
                      <span className="font-medium">{data.stats?.weeklyMeetings || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">مهلت‌های نزدیک</span>
                      <span className="font-medium">{data.stats?.upcomingDeadlines || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* تقویم */}
            <div className="lg:col-span-3">
              <Calendar
                view={selectedView}
                date={selectedDate}
                events={data.events}
                loading={loading}
                onEventClick={setSelectedEvent}
                onDateClick={(date) => {
                  setSelectedDate(date);
                  setSelectedView('day');
                }}
              />
            </div>
          </div>
        </div>

        {/* مودال ویرایش رویداد */}
        {selectedEvent && (
          <EventEditor
            event={selectedEvent}
            onSave={(data) => {
              if (data.id) {
                handleEventUpdate(data.id, data);
              } else {
                handleEventCreate(data);
              }
            }}
            onCancel={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
}