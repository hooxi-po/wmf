import React, { useState } from 'react';
import { DollarSign, Lock, AlertTriangle, FileText, Bot, CreditCard, Check, Bell, Calendar, Upload, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { MOCK_FEES } from '../constants';
import { generateFeeAnalysisReport } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { UserRole, FeeStatus } from '../types';

interface FeeManagementProps {
  userRole: UserRole;
}

const FeeManagement: React.FC<FeeManagementProps> = ({ userRole }) => {
  // Enhanced mock data with status
  const [data, setData] = useState(MOCK_FEES.map(f => ({
      ...f, 
      status: f.isPaid ? FeeStatus.Completed : FeeStatus.BillGenerated,
      hasReminder: false 
  })));
  
  // Date Simulation State
  const [simulatedDate, setSimulatedDate] = useState('2023-11-15');
  const [aiReport, setAiReport] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Helper to check if penalty phase is active
  const isPenaltyPhase = new Date(simulatedDate) > new Date('2024-01-15');

  const handleGenerateReport = async () => {
    setLoadingAi(true);
    setAiReport('');
    const report = await generateFeeAnalysisReport(data);
    setAiReport(report);
    setLoadingAi(false);
  };

  // Workflow Actions
  const handleSendReminder = (id: string) => {
      setData(prev => prev.map(item => item.id === id ? { ...item, hasReminder: true } : item));
      alert(`已向 ${data.find(d => d.id === id)?.departmentName} 发送催缴通知`);
  };

  const handleUploadConfirm = (id: string) => {
      // Simulation of College Admin uploading confirmation
      setData(prev => prev.map(item => item.id === id ? { ...item, status: FeeStatus.FinanceProcessing } : item));
  };

  const handleFinanceDeduction = (id: string) => {
      // Simulation of Asset Admin pushing to finance
      setData(prev => prev.map(item => item.id === id ? { ...item, status: FeeStatus.Completed, isPaid: true } : item));
  };

  const getStatusBadge = (status: FeeStatus) => {
      switch(status) {
          case FeeStatus.Verifying: return <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs">数据核对中</span>;
          case FeeStatus.BillGenerated: return <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs">账单已出</span>;
          case FeeStatus.PendingConfirm: return <span className="text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs">待确认</span>;
          case FeeStatus.FinanceProcessing: return <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs">财务处理中</span>;
          case FeeStatus.Completed: return <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">已完结</span>;
      }
  };

  return (
    <div className="space-y-6 animate-fade-in">
       {/* Simulation Controls */}
       <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-4 rounded-lg flex items-center justify-between shadow-md">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-white/10 rounded-lg"><Calendar size={20} /></div>
                <div>
                    <h3 className="font-bold text-sm">系统时间模拟</h3>
                    <p className="text-xs text-slate-300">当前模拟日期: {simulatedDate}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setSimulatedDate('2023-09-30')} className={`px-3 py-1 rounded text-xs ${simulatedDate === '2023-09-30' ? 'bg-[#3370ff] text-white' : 'bg-white/10 hover:bg-white/20'}`}>启动日 (9.30)</button>
                <button onClick={() => setSimulatedDate('2023-11-15')} className={`px-3 py-1 rounded text-xs ${simulatedDate === '2023-11-15' ? 'bg-[#3370ff] text-white' : 'bg-white/10 hover:bg-white/20'}`}>常规运营 (11.15)</button>
                <button onClick={() => setSimulatedDate('2024-01-16')} className={`px-3 py-1 rounded text-xs ${simulatedDate === '2024-01-16' ? 'bg-[#f54a45] text-white' : 'bg-white/10 hover:bg-white/20'}`}>逾期熔断 (1.16)</button>
            </div>
       </div>

       <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1f2329]">3.3 校内公房使用收费管理</h2>
          <p className="text-[#646a73]">完成年度收费闭环，支持“超额阶梯收费”与“多渠道支付”。</p>
        </div>
        <div className="flex gap-3">
             {/* Penalty Status Indicator */}
             {isPenaltyPhase && (
                 <div className="px-4 py-2 bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca] rounded-md flex items-center gap-2 text-sm font-bold animate-pulse">
                     <Lock size={16} />
                     <span>熔断机制生效：欠费单位权限已锁</span>
                 </div>
             )}
            <button 
              onClick={handleGenerateReport}
              disabled={loadingAi}
              className="bg-[#3370ff] hover:bg-[#285cc9] disabled:opacity-50 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-sm text-sm font-medium"
            >
                <Bot size={18} />
                <span>{loadingAi ? '分析中...' : 'AI 模拟决策'}</span>
            </button>
        </div>
      </div>

      {/* AI Analysis Result */}
      {aiReport && (
        <div className="bg-[#eff6ff] border border-[#dbeafe] p-6 rounded-lg animate-fade-in">
            <h3 className="font-semibold text-[#3370ff] flex items-center gap-2 mb-2">
                <Bot size={20} /> Gemini 智能分析报告
            </h3>
            <div className="prose prose-sm text-[#1f2329]">
                <ReactMarkdown>{aiReport}</ReactMarkdown>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-[#dee0e3]">
            <h3 className="font-semibold text-[#1f2329] mb-6">各单位定额与实占对比</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f2f3f5" />
                        <XAxis dataKey="departmentName" stroke="#8f959e" tick={{fontSize: 12}} />
                        <YAxis stroke="#8f959e" tick={{fontSize: 12}} />
                        <Tooltip 
                            contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee0e3', boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}} 
                            formatter={(value: number) => [`${value} m²`]}
                        />
                        <Legend wrapperStyle={{paddingTop: '20px'}} />
                        <Bar dataKey="quotaArea" name="标准定额 (m²)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="actualArea" name="实际占用 (m²)" fill="#3370ff" radius={[4, 4, 0, 0]}>
                             {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.actualArea > entry.quotaArea ? '#f54a45' : '#3370ff'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Billing Summary List */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#dee0e3] flex flex-col">
            <h3 className="font-semibold text-[#1f2329] mb-4 flex justify-between items-center">
                <span>费用缴纳状态</span>
                <span className="text-xs font-normal text-[#8f959e]">当前阶段: 
                    {isPenaltyPhase ? ' 逾期处理' : ' 费用结算'}
                </span>
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {data.filter(d => d.excessCost > 0).map(fee => (
                    <div key={fee.id} className={`p-4 rounded-md border relative transition-all ${fee.status === FeeStatus.Completed ? 'bg-[#ecfdf5] border-[#a7f3d0]' : 'bg-[#fef2f2] border-[#fecaca]'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className={`font-medium ${fee.status === FeeStatus.Completed ? 'text-[#065f46]' : 'text-[#7f1d1d]'}`}>{fee.departmentName}</h4>
                                <p className={`${fee.status === FeeStatus.Completed ? 'text-[#047857]' : 'text-[#991b1b]'} text-sm mt-1`}>超额: {fee.excessArea} m²</p>
                            </div>
                            <div className="text-right">
                                <span className={`block text-xl font-bold ${fee.status === FeeStatus.Completed ? 'text-[#059669]' : 'text-[#b91c1c]'}`}>¥{fee.excessCost.toLocaleString()}</span>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-black/5">
                             {getStatusBadge(fee.status)}

                             {/* Action Buttons Logic */}
                             {fee.status !== FeeStatus.Completed && (
                                 <div className="flex gap-2">
                                     {/* Asset Admin Actions */}
                                     {userRole === UserRole.AssetAdmin && (
                                         <>
                                            {fee.status === FeeStatus.BillGenerated && (
                                                <button 
                                                    onClick={() => handleSendReminder(fee.id)}
                                                    className={`text-xs px-2 py-1 rounded border flex items-center gap-1 transition-colors ${fee.hasReminder ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-white text-[#b91c1c] border-[#fca5a5] hover:bg-[#fee2e2]'}`}
                                                    disabled={fee.hasReminder}
                                                >
                                                    <Bell size={12} /> {fee.hasReminder ? '已催缴' : '催缴通知'}
                                                </button>
                                            )}
                                            {fee.status === FeeStatus.FinanceProcessing && (
                                                <button 
                                                    onClick={() => handleFinanceDeduction(fee.id)}
                                                    className="bg-[#3370ff] text-white text-xs px-3 py-1 rounded hover:bg-[#285cc9]"
                                                >
                                                    财务扣款
                                                </button>
                                            )}
                                         </>
                                     )}

                                     {/* College Admin Actions */}
                                     {userRole === UserRole.CollegeAdmin && fee.departmentName === '机械学院' && (
                                         <>
                                            {fee.status === FeeStatus.BillGenerated && (
                                                <button 
                                                    onClick={() => handleUploadConfirm(fee.id)}
                                                    className="bg-[#3370ff] text-white text-xs px-3 py-1 rounded hover:bg-[#285cc9] flex items-center gap-1"
                                                >
                                                    <Upload size={12} /> 上传确认函
                                                </button>
                                            )}
                                         </>
                                     )}
                                 </div>
                             )}
                        </div>
                    </div>
                ))}
            </div>
             <div className="mt-4 pt-4 border-t border-[#f2f3f5]">
                <div className="flex items-center gap-3 text-sm text-[#8f959e]">
                    <AlertTriangle size={16} className="text-[#f59e0b]" />
                    <p>熔断机制：截止日期(1月15日)未缴清将自动冻结新增用房申请。</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FeeManagement;