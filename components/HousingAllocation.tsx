import React, { useState } from 'react';
import { MapPin, Users, Building, ArrowRight, CheckCircle2, Plus, X, AlertTriangle, Ban } from 'lucide-react';
import { MOCK_REQUESTS, MOCK_FEES } from '../constants';
import { RoomRequest, AllocationStatus, UserRole } from '../types';

interface HousingAllocationProps {
  userRole: UserRole;
}

const HousingAllocation: React.FC<HousingAllocationProps> = ({ userRole }) => {
  const [requests, setRequests] = useState<RoomRequest[]>(MOCK_REQUESTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReq, setNewReq] = useState({ area: '', reason: '' });

  // Simulate Fee Status Check for "Mechanical College" (Default for CollegeAdmin)
  const myDepartmentName = userRole === UserRole.CollegeAdmin ? '机械学院' : '教务处';
  const myFeeStatus = MOCK_FEES.find(f => f.departmentName === myDepartmentName);
  // In a real app, date comparison would be dynamic. Assuming today is past deadline for demo purposes if unpaid.
  const isBlocked = myFeeStatus && !myFeeStatus.isPaid && myFeeStatus.excessCost > 0;

  const getStatusStep = (area: number) => {
    if (area < 500) return 1;
    if (area < 1000) return 2;
    return 3;
  };

  const getStatusLabel = (status: AllocationStatus) => {
    switch (status) {
      case AllocationStatus.PendingLevel1: return '分管副校长审批';
      case AllocationStatus.PendingLevel2: return '公用房领导小组审阅';
      case AllocationStatus.PendingLevel3: return '校长办公会研究';
      case AllocationStatus.Approved: return '已批准 (待选房)';
      default: return '草稿';
    }
  };

  const handleApply = () => {
    if (!newReq.area || !newReq.reason) return;
    const areaNum = Number(newReq.area);
    
    let initialStatus = AllocationStatus.PendingLevel1;
    
    const request: RoomRequest = {
        id: `REQ-${Math.floor(Math.random() * 1000)}`,
        department: myDepartmentName,
        area: areaNum,
        reason: newReq.reason,
        status: initialStatus,
        requestedDate: new Date().toISOString().split('T')[0]
    };

    setRequests([request, ...requests]);
    setIsModalOpen(false);
    setNewReq({ area: '', reason: '' });
  };

  const handleApprove = (req: RoomRequest) => {
    let nextStatus = req.status;

    if (req.status === AllocationStatus.PendingLevel1) {
        if (req.area >= 500) nextStatus = AllocationStatus.PendingLevel2;
        else nextStatus = AllocationStatus.Approved;
    } else if (req.status === AllocationStatus.PendingLevel2) {
        if (req.area >= 1000) nextStatus = AllocationStatus.PendingLevel3;
        else nextStatus = AllocationStatus.Approved;
    } else if (req.status === AllocationStatus.PendingLevel3) {
        nextStatus = AllocationStatus.Approved;
    }

    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: nextStatus } : r));
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1f2329]">3.2 公用房归口调配管理</h2>
          <p className="text-[#646a73]">实现公用房的分类分级调配，支持“所见即所得”的可视化选房。</p>
        </div>
        {(userRole === UserRole.CollegeAdmin || userRole === UserRole.Teacher) && (
            <button 
                onClick={() => setIsModalOpen(true)}
                disabled={isBlocked === true}
                className={`px-4 py-2 rounded-md flex items-center gap-2 shadow-sm text-sm font-medium transition-colors ${
                    isBlocked 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                    : 'bg-[#3370ff] hover:bg-[#285cc9] text-white'
                }`}
            >
                {isBlocked ? <Ban size={18} /> : <Plus size={18} />}
                <span>{isBlocked ? '权限已冻结 (存在欠费)' : '新增用房申请'}</span>
            </button>
        )}
      </div>
      
      {/* Alert for Blocked User */}
      {isBlocked && userRole === UserRole.CollegeAdmin && (
          <div className="bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] px-4 py-3 rounded-md flex items-start gap-3">
              <AlertTriangle className="flex-shrink-0 mt-0.5" size={20} />
              <div>
                  <p className="font-bold text-sm">您的申请权限已被冻结</p>
                  <p className="text-xs mt-1">检测到本年度公用房使用费尚未结清，且已超过截止日期。请联系财务处或在“公房收费管理”模块完成缴费。</p>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request List */}
        <div className="bg-white rounded-lg shadow-sm border border-[#dee0e3] p-6">
          <h3 className="font-semibold text-[#1f2329] mb-4">
              {userRole === UserRole.AssetAdmin ? '待审批申请' : '我的申请记录'}
          </h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {requests.length === 0 && <p className="text-[#8f959e] text-sm text-center py-4">暂无申请记录</p>}
            {requests.map((req) => (
              <div key={req.id} className="border border-[#dee0e3] rounded-lg p-4 hover:border-[#3370ff] transition-all bg-[#fcfcfd]">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                        <h4 className="font-medium text-[#1f2329]">{req.department}</h4>
                        <span className="text-xs text-[#8f959e]">ID: {req.id}</span>
                    </div>
                    <p className="text-sm text-[#8f959e] mt-1">{req.reason}</p>
                  </div>
                  <span className="text-xs font-bold text-[#646a73] bg-[#f2f3f5] px-2 py-1 rounded">
                    申请: {req.area} m²
                  </span>
                </div>
                
                {/* Visual Workflow Indicator */}
                <div className="relative pt-4">
                    <div className="flex justify-between items-center text-xs text-[#8f959e] mb-2">
                        <span>提交申请</span>
                        <span>分级审批</span>
                        <span>可视化分配</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#f2f3f5] rounded-full overflow-hidden flex">
                        <div className="h-full bg-[#3370ff] w-1/3"></div>
                        <div className={`h-full w-1/3 border-l border-white ${[AllocationStatus.PendingLevel1, AllocationStatus.PendingLevel2, AllocationStatus.PendingLevel3, AllocationStatus.Approved].includes(req.status) ? 'bg-[#fbbf24]' : 'bg-[#f2f3f5]'}`}></div>
                         <div className={`h-full w-1/3 border-l border-white ${req.status === AllocationStatus.Approved ? 'bg-[#059669]' : 'bg-[#f2f3f5]'}`}></div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-[#d97706] bg-[#fff7ed] px-2 py-1 rounded w-fit border border-[#fed7aa]">
                            <ArrowRight size={12} />
                            当前阶段: {getStatusLabel(req.status)} 
                            {getStatusStep(req.area) > 1 && req.status !== AllocationStatus.Approved && <span className="text-[#8f959e] ml-1">(大面积 > 500m²)</span>}
                        </div>
                        
                        {/* Action Buttons for Admin */}
                        {userRole === UserRole.AssetAdmin && req.status !== AllocationStatus.Approved && (
                            <button 
                                onClick={() => handleApprove(req)}
                                className="text-xs bg-[#3370ff] text-white px-3 py-1 rounded hover:bg-[#285cc9] transition-colors"
                            >
                                {req.area >= 500 && req.status !== AllocationStatus.PendingLevel3 ? '通过并呈报上级' : '批准申请'}
                            </button>
                        )}
                        {req.status === AllocationStatus.Approved && (
                             <span className="text-xs text-[#059669] flex items-center gap-1">
                                <CheckCircle2 size={12} /> 已完成审批
                             </span>
                        )}
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Allocation Placeholder */}
        <div className="bg-[#1f2329] rounded-lg shadow-sm border border-[#1f2329] p-6 text-white flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
            <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/800/600?grayscale')] bg-cover bg-center"></div>
            <div className="relative z-10 text-center">
                <MapPin size={48} className="mx-auto mb-4 text-[#3370ff]" />
                <h3 className="text-xl font-bold">GIS / 平面图可视化选房</h3>
                <p className="text-[#8f959e] mt-2 max-w-xs mx-auto">审批通过后，资产处在GIS地图/平面图上勾选房间，生成电子调配单。</p>
                <div className="mt-6 flex flex-col gap-2">
                    <button className="px-6 py-2 bg-[#3370ff] hover:bg-[#285cc9] rounded-full font-medium transition-colors">
                        打开地图视图
                    </button>
                    {requests.some(r => r.status === AllocationStatus.Approved) && (
                        <span className="text-xs text-[#059669] bg-[#059669]/10 px-2 py-1 rounded">
                            检测到已批准申请，可进行配房
                        </span>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#1f2329]">提交用房申请</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-[#646a73] hover:text-[#1f2329]">
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                         <label className="block text-sm font-medium text-[#646a73] mb-1">申请单位</label>
                         <input disabled value={myDepartmentName} className="w-full bg-[#f5f6f7] border border-[#dee0e3] rounded px-3 py-2 text-sm text-[#8f959e]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#646a73] mb-1">申请面积 (m²)</label>
                        <input 
                            type="number"
                            value={newReq.area}
                            onChange={(e) => setNewReq({...newReq, area: e.target.value})}
                            className="w-full border border-[#dee0e3] rounded px-3 py-2 text-sm focus:border-[#3370ff] outline-none"
                            placeholder="输入整数"
                        />
                        <p className="text-xs text-[#8f959e] mt-1 flex items-center gap-1">
                            <AlertTriangle size={12} />
                            {Number(newReq.area) >= 1000 ? '需校长办公会审批' : Number(newReq.area) >= 500 ? '需公用房领导小组审批' : '需分管副校长审批'}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#646a73] mb-1">申请用途</label>
                        <textarea 
                            value={newReq.reason}
                            onChange={(e) => setNewReq({...newReq, reason: e.target.value})}
                            className="w-full border border-[#dee0e3] rounded px-3 py-2 text-sm focus:border-[#3370ff] outline-none"
                            rows={3}
                            placeholder="请详细说明用房需求..."
                        />
                    </div>
                    <button 
                        onClick={handleApply}
                        className="w-full bg-[#3370ff] text-white py-2 rounded-md font-medium hover:bg-[#285cc9] transition-colors mt-2"
                    >
                        提交申请
                    </button>
                </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default HousingAllocation;