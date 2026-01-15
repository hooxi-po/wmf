import React, { useState } from 'react';
import { FileText, Upload, CheckCircle, AlertCircle, FileDigit, Plus, X, ArrowRight, Wallet, Building } from 'lucide-react';
import { MOCK_PROJECTS } from '../constants';
import { Project, AssetStatus, UserRole } from '../types';

interface AssetTransferProps {
  userRole: UserRole;
}

const AssetTransfer: React.FC<AssetTransferProps> = ({ userRole }) => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    contractor: '',
    amount: ''
  });

  const getStatusLabel = (status: AssetStatus) => {
      switch(status) {
          case AssetStatus.Construction: return '在建中 (工程移交)';
          case AssetStatus.PreAcceptance: return '预验收 (临时卡片)';
          case AssetStatus.FinancialReview: return '财务核算 (价值确认)';
          case AssetStatus.Active: return '已转固 (正式入账)';
          case AssetStatus.Disposal: return '处置中';
          default: return status;
      }
  };

  // Workflow Action Logic
  const handleProcess = (id: string, currentStatus: AssetStatus) => {
    if (userRole !== UserRole.AssetAdmin) {
      alert("无权限操作");
      return;
    }

    setProjects(prev => prev.map(p => {
      if (p.id !== id) return p;
      
      let nextStatus = p.status;
      if (currentStatus === AssetStatus.Construction) {
          nextStatus = AssetStatus.PreAcceptance;
      } else if (currentStatus === AssetStatus.PreAcceptance) {
          nextStatus = AssetStatus.FinancialReview;
      } else if (currentStatus === AssetStatus.FinancialReview) {
          nextStatus = AssetStatus.Active;
      }

      return { ...p, status: nextStatus };
    }));
  };

  const handleAddProject = () => {
    if (!newProject.name || !newProject.amount) return;
    const project: Project = {
      id: `PRJ-2024-00${projects.length + 1}`,
      name: newProject.name,
      contractor: newProject.contractor || '未指定',
      contractAmount: Number(newProject.amount),
      status: AssetStatus.Construction,
      completionDate: '2024-12-31',
      hasCadData: false
    };
    setProjects([project, ...projects]);
    setIsModalOpen(false);
    setNewProject({ name: '', contractor: '', amount: '' });
  };

  const getActionButtonText = (status: AssetStatus) => {
      switch(status) {
          case AssetStatus.Construction: return '发起移交';
          case AssetStatus.PreAcceptance: return '建立临时卡片';
          case AssetStatus.FinancialReview: return '财务核算入账';
          default: return '';
      }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1f2329]">3.1 资产建设与转固管理</h2>
          <p className="text-[#646a73]">实现从基建工程到固定资产的无缝衔接 (高基表数据源头)。</p>
        </div>
        {userRole === UserRole.AssetAdmin && (
          <div className="flex gap-3">
             <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white border border-[#3370ff] text-[#3370ff] px-4 py-2 rounded-md flex items-center gap-2 shadow-sm transition-all text-sm font-medium hover:bg-[#e1eaff]"
             >
                <Plus size={18} />
                <span>新建工程项目</span>
             </button>
             <button className="bg-[#3370ff] hover:bg-[#285cc9] text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-sm transition-all text-sm font-medium">
              <Upload size={18} />
              <span>上传竣工验收报告</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#dee0e3] flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-md">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-[#1f2329]">待转固项目</h3>
            <p className="text-3xl font-bold text-[#1f2329] mt-1">
              {projects.filter(p => p.status === AssetStatus.PreAcceptance || p.status === AssetStatus.FinancialReview).length}
            </p>
            <p className="text-sm text-[#8f959e] mt-1">等待财务核算/临时卡片</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#dee0e3] flex items-start gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-md">
            <Wallet size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-[#1f2329]">在建工程总额</h3>
            <p className="text-3xl font-bold text-[#1f2329] mt-1">
              ¥{(projects.filter(p => p.status === AssetStatus.Construction).reduce((acc, curr) => acc + curr.contractAmount, 0) / 10000).toFixed(0)}万
            </p>
            <p className="text-sm text-[#8f959e] mt-1">已交付未决算项目</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#dee0e3] flex items-start gap-4">
          <div className="p-3 bg-[#e1eaff] text-[#3370ff] rounded-md">
            <Building size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-[#1f2329]">已入账资产</h3>
             <p className="text-3xl font-bold text-[#1f2329] mt-1">
              {projects.filter(p => p.status === AssetStatus.Active).length}
            </p>
            <p className="text-sm text-[#8f959e] mt-1">正式转固完成</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#dee0e3] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#dee0e3] flex justify-between items-center bg-[#fcfcfd]">
          <h3 className="font-semibold text-[#1f2329]">基建工程项目列表</h3>
          <span className="text-xs font-medium px-2 py-1 bg-[#f2f3f5] text-[#646a73] rounded">同步至教育部系统</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f5f6f7] text-[#646a73] font-medium border-b border-[#dee0e3]">
              <tr>
                <th className="px-6 py-3 font-medium">项目编号</th>
                <th className="px-6 py-3 font-medium">项目名称</th>
                <th className="px-6 py-3 font-medium">承建单位</th>
                <th className="px-6 py-3 font-medium">合同金额 (暂估)</th>
                <th className="px-6 py-3 font-medium">图纸解析</th>
                <th className="px-6 py-3 font-medium">状态</th>
                <th className="px-6 py-3 font-medium">流程操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dee0e3]">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-[#f9f9f9] transition-colors">
                  <td className="px-6 py-4 font-medium text-[#1f2329]">{project.id}</td>
                  <td className="px-6 py-4">{project.name}</td>
                  <td className="px-6 py-4 text-[#646a73]">{project.contractor}</td>
                  <td className="px-6 py-4">¥{project.contractAmount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {project.hasCadData ? (
                      <span className="flex items-center text-[#059669] text-xs font-medium">
                        <CheckCircle size={14} className="mr-1" /> 已完成
                      </span>
                    ) : (
                      <span className="flex items-center text-[#8f959e] text-xs">
                        等待上传
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                      project.status === AssetStatus.Active ? 'bg-[#ecfdf5] text-[#059669]' :
                      project.status === AssetStatus.FinancialReview ? 'bg-purple-50 text-purple-600' :
                      project.status === AssetStatus.PreAcceptance ? 'bg-[#fff7ed] text-[#d97706]' :
                      'bg-[#eff6ff] text-[#1d4ed8]'
                    }`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {userRole === UserRole.AssetAdmin && project.status !== AssetStatus.Active ? (
                      <button 
                        onClick={() => handleProcess(project.id, project.status)}
                        className="text-[#3370ff] hover:text-[#285cc9] font-medium text-xs border border-[#3370ff] px-2 py-1 rounded hover:bg-[#e1eaff] flex items-center gap-1"
                      >
                         {getActionButtonText(project.status)} <ArrowRight size={12} />
                      </button>
                    ) : (
                        project.status === AssetStatus.Active ? 
                            <span className="text-[#059669] text-xs font-medium flex items-center gap-1"><CheckCircle size={12}/> 已归档</span> :
                            <span className="text-[#8f959e] text-xs">无权限</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#1f2329]">录入新基建工程</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-[#646a73] hover:text-[#1f2329]">
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#646a73] mb-1">工程名称</label>
                        <input 
                            value={newProject.name}
                            onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                            className="w-full border border-[#dee0e3] rounded px-3 py-2 text-sm focus:border-[#3370ff] outline-none"
                            placeholder="例如：综合体育馆建设工程"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#646a73] mb-1">承建单位</label>
                        <input 
                            value={newProject.contractor}
                            onChange={(e) => setNewProject({...newProject, contractor: e.target.value})}
                            className="w-full border border-[#dee0e3] rounded px-3 py-2 text-sm focus:border-[#3370ff] outline-none"
                            placeholder="例如：福建建工集团"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#646a73] mb-1">合同金额 (元)</label>
                        <input 
                            type="number"
                            value={newProject.amount}
                            onChange={(e) => setNewProject({...newProject, amount: e.target.value})}
                            className="w-full border border-[#dee0e3] rounded px-3 py-2 text-sm focus:border-[#3370ff] outline-none"
                            placeholder="1000000"
                        />
                    </div>
                    <button 
                        onClick={handleAddProject}
                        className="w-full bg-[#3370ff] text-white py-2 rounded-md font-medium hover:bg-[#285cc9] transition-colors mt-4"
                    >
                        确认录入
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AssetTransfer;