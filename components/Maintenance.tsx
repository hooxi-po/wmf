import React, { useState } from 'react';
import { PenTool, Camera, MapPin, CheckCircle, Clock, Send, Wrench, User } from 'lucide-react';
import { MOCK_TICKETS } from '../constants';
import { suggestRepairAction } from '../services/geminiService';
import { RepairTicket, UserRole } from '../types';

interface MaintenanceProps {
  userRole: UserRole;
}

const Maintenance: React.FC<MaintenanceProps> = ({ userRole }) => {
  const [tickets, setTickets] = useState<RepairTicket[]>(MOCK_TICKETS);
  const [newIssue, setNewIssue] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');

  const handleAiAssist = async () => {
    if(!newIssue) return;
    setAiSuggestion('AI 正在分析故障描述并匹配维修组...');
    const result = await suggestRepairAction(newIssue);
    setAiSuggestion(result);
  };

  const handleSubmit = () => {
      if (!newIssue) return;
      const newTicket: RepairTicket = {
          id: `TKT-${Math.floor(Math.random() * 10000)}`,
          location: '理科楼 B座 (LBS定位)',
          issue: newIssue,
          reporter: userRole === UserRole.Teacher ? '张老师' : '管理员',
          status: 'Open',
          imageUrl: 'https://picsum.photos/200/200',
          date: new Date().toISOString().split('T')[0]
      };
      setTickets([newTicket, ...tickets]);
      setNewIssue('');
      setAiSuggestion('');
  };

  const updateStatus = (id: string, newStatus: 'Dispatched' | 'Completed') => {
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1f2329]">3.5 维修与物业服务</h2>
          <p className="text-[#646a73]">师生移动端随手拍报修，LBS定位，智能派单。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Report (Mobile Simulator Style) */}
        <div className="bg-white rounded-lg shadow-lg border border-[#dee0e3] overflow-hidden max-w-sm mx-auto w-full h-fit sticky top-6">
            <div className="bg-[#1f2329] text-white p-4 text-center relative">
                <h3 className="font-semibold">移动报修</h3>
                <div className="absolute top-1/2 -translate-y-1/2 right-4 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[#1f2329] mb-1">故障描述</label>
                    <textarea 
                        className="w-full p-3 border border-[#dee0e3] rounded-md focus:ring-1 focus:ring-[#3370ff] focus:border-[#3370ff] text-sm outline-none resize-none" 
                        rows={3} 
                        placeholder="例如：302教室空调漏水..."
                        value={newIssue}
                        onChange={(e) => setNewIssue(e.target.value)}
                    ></textarea>
                     <button 
                        onClick={handleAiAssist}
                        type="button" 
                        className="text-xs text-[#3370ff] font-medium mt-1 hover:underline flex items-center gap-1"
                    >
                        <BotIcon /> AI 智能分诊建议
                    </button>
                    {aiSuggestion && (
                         <div className="mt-2 p-2 bg-[#eff6ff] text-[#3370ff] text-xs rounded border border-[#dbeafe] animate-fade-in">
                            {aiSuggestion}
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#1f2329] mb-1">位置 (LBS自动定位)</label>
                    <div className="flex items-center gap-2 p-3 bg-[#f5f6f7] rounded-md border border-[#dee0e3] text-[#646a73] text-sm">
                        <MapPin size={16} className="text-[#f54a45]" />
                        <span>检测到: 理科楼 B座, 2层</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <button className="flex flex-col items-center justify-center p-4 border border-dashed border-[#dee0e3] rounded-md hover:bg-[#f5f6f7] text-[#646a73] transition-colors">
                        <Camera size={24} />
                        <span className="text-xs mt-1">拍照取证</span>
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className="bg-[#3370ff] hover:bg-[#285cc9] text-white rounded-md font-medium shadow-sm transition-colors text-sm flex flex-col items-center justify-center"
                    >
                        <Send size={20} className="mb-1" />
                        立即提交
                    </button>
                </div>
            </div>
        </div>

        {/* Ticket List */}
        <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-[#1f2329]">
                    {userRole === UserRole.AssetAdmin ? '全校报修工单池' : '我的报修记录'}
                </h3>
                <span className="bg-[#e1eaff] text-[#3370ff] text-xs px-2 py-0.5 rounded font-medium">实时</span>
            </div>
            
            {tickets.length === 0 && <div className="text-center py-10 text-[#8f959e]">暂无报修记录</div>}

            {tickets.map(ticket => (
                <div key={ticket.id} className="bg-white p-4 rounded-lg shadow-sm border border-[#dee0e3] flex flex-col sm:flex-row gap-4 transition-all hover:shadow-md">
                    <div className="w-full sm:w-24 h-24 bg-[#f2f3f5] rounded-lg overflow-hidden flex-shrink-0 relative group">
                        <img src={ticket.imageUrl} alt="Issue" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs font-mono text-[#8f959e]">{ticket.id}</span>
                                <h4 className="font-semibold text-[#1f2329] text-lg">{ticket.issue}</h4>
                                <p className="text-sm text-[#646a73] flex items-center gap-1 mt-1">
                                    <MapPin size={14} /> {ticket.location}
                                </p>
                            </div>
                            <StatusBadge status={ticket.status} />
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs text-[#8f959e] border-t border-[#f5f6f7] pt-3">
                             <div className="flex gap-4">
                                <div className="flex items-center gap-1">
                                    <Clock size={14} /> {ticket.date}
                                </div>
                                <div className="flex items-center gap-1">
                                    <User size={14} /> {ticket.reporter}
                                </div>
                             </div>
                             
                             {/* Admin Actions */}
                             {userRole === UserRole.AssetAdmin && (
                                <div className="flex gap-2">
                                    {ticket.status === 'Open' && (
                                        <button 
                                            onClick={() => updateStatus(ticket.id, 'Dispatched')}
                                            className="text-[#3370ff] font-medium hover:bg-[#e1eaff] px-2 py-1 rounded transition-colors"
                                        >
                                            智能派单
                                        </button>
                                    )}
                                    {ticket.status === 'Dispatched' && (
                                        <button 
                                            onClick={() => updateStatus(ticket.id, 'Completed')}
                                            className="text-[#059669] font-medium hover:bg-[#ecfdf5] px-2 py-1 rounded transition-colors"
                                        >
                                            确认验收
                                        </button>
                                    )}
                                </div>
                             )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
    let colorClass = "";
    let label = "";

    switch(status) {
        case 'Open': 
            colorClass = "bg-[#eff6ff] text-[#3370ff]";
            label = "待处理";
            break;
        case 'Dispatched':
            colorClass = "bg-[#fff7ed] text-[#d97706]";
            label = "维修中";
            break;
        case 'Completed':
            colorClass = "bg-[#ecfdf5] text-[#059669]";
            label = "已完成";
            break;
    }

    return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${colorClass}`}>
            {label}
        </span>
    );
};

const BotIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a5 5 0 0 0-5-5H5a5 5 0 0 0-5 5v2H1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h1a7 7 0 0 1 7-7V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"></path></svg>
)

export default Maintenance;