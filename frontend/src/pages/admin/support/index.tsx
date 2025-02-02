// frontend/src/pages/admin/support/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { TicketList } from '@/components/admin/support/TicketList';
import { ChatInterface } from '@/components/admin/support/ChatInterface';
import { ChannelStats } from '@/components/admin/support/ChannelStats';
import { supportService } from '@/services/support.service';

export default function AdminSupport() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    tickets: [],
    channels: [],
    stats: {}
  });
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    channel: 'all',
    assignee: 'all',
    search: ''
  });

  const tabs = [
    { id: 'tickets', label: 'تیکت‌ها' },
    { id: 'chat', label: 'چت آنلاین' },
    { id: 'channels', label: 'کانال‌های ارتباطی' },
    { id: 'analytics', label: 'تحلیل‌ها' }
  ];

  useEffect(() => {
    fetchSupportData();
  }, [activeTab, filters]);

  const fetchSupportData = async () => {
    try {
      setLoading(true);
      const response = await supportService.getData({
        tab: activeTab,
        filters
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching support data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">مدیریت پشتیبانی چندکاناله</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span className="text-sm text-green-800">
                  {data.stats?.onlineAgents || 0} کارشناس آنلاین
                </span>
              </div>
              <button
                onClick={() => setActiveTab('chat')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                شروع چت جدید
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
                <div className="flex items-center">
                  {tab.label}
                  {tab.id === 'tickets' && data.stats?.pendingTickets > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                      {data.stats.pendingTickets}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* فیلترها */}
          {activeTab === 'tickets' && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input
                  type="text"
                  placeholder="جستجو..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="border rounded-lg p-2"
                />
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="open">باز</option>
                  <option value="in_progress">در حال بررسی</option>
                  <option value="waiting">در انتظار پاسخ</option>
                  <option value="resolved">حل شده</option>
                  <option value="closed">بسته شده</option>
                </select>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="all">همه اولویت‌ها</option>
                  <option value="low">کم</option>
                  <option value="medium">متوسط</option>
                  <option value="high">زیاد</option>
                  <option value="urgent">فوری</option>
                </select>
                <select
                  value={filters.channel}
                  onChange={(e) => setFilters({ ...filters, channel: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="all">همه کانال‌ها</option>
                  <option value="email">ایمیل</option>
                  <option value="chat">چت</option>
                  <option value="phone">تلفن</option>
                  <option value="whatsapp">واتس‌اپ</option>
                  <option value="telegram">تلگرام</option>
                </select>
                <select
                  value={filters.assignee}
                  onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="all">همه کارشناسان</option>
                  {data.agents?.map((agent: any) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {activeTab === 'tickets' && (
              <>
                {/* لیست تیکت‌ها */}
                <div className="lg:col-span-1">
                  <TicketList
                    tickets={data.tickets}
                    loading={loading}
                    selectedId={selectedTicket?.id}
                    onSelect={setSelectedTicket}
                  />
                </div>

                {/* جزئیات تیکت */}
                <div className="lg:col-span-2">
                  {selectedTicket ? (
                    <TicketDetails
                      ticket={selectedTicket}
                      onUpdate={async (id, data) => {
                        await supportService.updateTicket(id, data);
                        await fetchSupportData();
                      }}
                      onReply={async (id, message) => {
                        await supportService.replyToTicket(id, message);
                        await fetchSupportData();
                      }}
                    />
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      یک تیکت را برای مشاهده جزئیات انتخاب کنید
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'chat' && (
              <ChatInterface
                chats={data.chats}
                agents={data.agents}
                onSendMessage={async (chatId, message) => {
                  await supportService.sendChatMessage(chatId, message);
                  await fetchSupportData();
                }}
                onAssignChat={async (chatId, agentId) => {
                  await supportService.assignChat(chatId, agentId);
                  await fetchSupportData();
                }}
              />
            )}

            {activeTab === 'channels' && (
              <ChannelManager
                channels={data.channels}
                onUpdate={async (id, data) => {
                  await supportService.updateChannel(id, data);
                  await fetchSupportData();
                }}
                onIntegrate={async (channelData) => {
                  await supportService.integrateChannel(channelData);
                  await fetchSupportData();
                }}
              />
            )}

            {activeTab === 'analytics' && (
              <SupportAnalytics
                stats={data.stats}
                dateRange={data.dateRange}
                onDateRangeChange={async (range) => {
                  const response = await supportService.getAnalytics(range);
                  setData(prev => ({ ...prev, stats: response.data }));
                }}
              />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}