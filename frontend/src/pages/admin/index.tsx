// frontend/src/pages/admin/support/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { TicketList } from '@/components/admin/support/TicketList';
import { TicketChat } from '@/components/admin/support/TicketChat';
import { DepartmentManager } from '@/components/admin/support/DepartmentManager';
import { supportService } from '@/services/support.service';
import { useSocket } from '@/hooks/useSocket';

export default function AdminSupport() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    department: 'all',
    assignee: 'all',
    search: ''
  });

  const socket = useSocket('support');

  useEffect(() => {
    socket.on('ticket:new', handleNewTicket);
    socket.on('ticket:update', handleTicketUpdate);
    return () => {
      socket.off('ticket:new');
      socket.off('ticket:update');
    };
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await supportService.getTickets(filters);
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewTicket = (ticket: any) => {
    setTickets(prev => [ticket, ...prev]);
  };

  const handleTicketUpdate = (updatedTicket: any) => {
    setTickets(prev => prev.map(ticket => 
      ticket._id === updatedTicket._id ? updatedTicket : ticket
    ));
    if (selectedTicket?._id === updatedTicket._id) {
      setSelectedTicket(updatedTicket);
    }
  };

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-4rem)] bg-white">
        <div className="grid grid-cols-12 h-full">
          {/* لیست تیکت‌ها */}
          <div className="col-span-4 border-l h-full flex flex-col">
            <div className="p-4 border-b">
              <h1 className="text-xl font-bold mb-4">تیکت‌های پشتیبانی</h1>
              
              {/* فیلترها */}
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="جستجو..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full border rounded-lg p-2"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="border rounded-lg p-2"
                  >
                    <option value="all">همه وضعیت‌ها</option>
                    <option value="open">باز</option>
                    <option value="in_progress">در حال بررسی</option>
                    <option value="waiting">در انتظار پاسخ</option>
                    <option value="closed">بسته شده</option>
                  </select>

                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                    className="border rounded-lg p-2"
                  >
                    <option value="all">همه اولویت‌ها</option>
                    <option value="low">کم</option>
                    <option value="medium">متوسط</option>
                    <option value="high">زیاد</option>
                    <option value="urgent">فوری</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                    className="border rounded-lg p-2"
                  >
                    <option value="all">همه دپارتمان‌ها</option>
                    <option value="technical">فنی</option>
                    <option value="sales">فروش</option>
                    <option value="financial">مالی</option>
                  </select>

                  <select
                    value={filters.assignee}
                    onChange={(e) => setFilters(prev => ({ ...prev, assignee: e.target.value }))}
                    className="border rounded-lg p-2"
                  >
                    <option value="all">همه کارشناسان</option>
                    <option value="unassigned">تخصیص نیافته</option>
                    <option value="me">تیکت‌های من</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <TicketList
                tickets={tickets}
                loading={loading}
                selectedId={selectedTicket?._id}
                onSelect={setSelectedTicket}
              />
            </div>
          </div>

          {/* چت تیکت */}
          <div className="col-span-8 flex flex-col h-full">
            {selectedTicket ? (
              <TicketChat
                ticket={selectedTicket}
                onClose={() => setSelectedTicket(null)}
                onUpdate={(updatedTicket) => {
                  handleTicketUpdate(updatedTicket);
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                یک تیکت را برای نمایش انتخاب کنید
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
