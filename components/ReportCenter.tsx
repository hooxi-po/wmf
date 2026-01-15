import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Download, 
  BarChart, 
  Plus, 
  Settings, 
  CheckCircle2, 
  RefreshCw,
  Table,
  PieChart,
  Filter,
  ArrowDownToLine
} from 'lucide-react';
import { UserRole } from '../types';

interface ReportCenterProps {
  userRole: UserRole;
}

const HIGH_BASE_REPORTS = [
    { id: 'HB-511', name: '高基 511 - 占地面积及校舍建筑面积', status: 'Ready', lastUpdated: '2023-11-15', source: '土地/楼宇台账' },
    { id: 'HB-521', name: '高基 521 - 教学行政用房情况', status: 'Generating', lastUpdated: '---', source: '公用房台账' },
    { id: 'EDU-5374', name: '教基 5374 - 实验室及仪器设备', status: 'Error', lastUpdated: '2023-10-01', source: '设备资产库' },
    { id: 'EDU-5377', name: '教基 5377 - 在建工程情况', status: 'Ready', lastUpdated: '2023-11-15', source: '基建项目库' },
];

const CUSTOM_REPORTS = [
    { id: 'CUST-001', name: '各学院人均办公面积统计表', type: 'Excel', author: '张管理员', date: '2023-11-10' },
    { id: 'CUST-002', name: '全校科研用房利用率分析报告', type: 'PDF', author: '李主任', date: '2023-11-12' },
];

const ReportCenter: React.FC<ReportCenterProps> = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState<'standard' | 'custom'>('standard');

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-[#1f2329]">3.7 统计报表中心</h2>
          <p className="text-[#646a73]">教育部高基表自动生成与自定义数据挖掘分析。</p>
        </div>
        <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 border border-[#dee0e3] rounded text-sm text-[#646a73] hover:bg-[#f2f3f5] transition-colors">
                <RefreshCw size={16} /> 刷新数据源
             </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#dee0e3]">
          <button 
            onClick={() => setActiveTab('standard')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'standard' ? 'border-[#3370ff] text-[#3370ff]' : 'border-transparent text-[#646a73] hover:text-[#1f2329]'}`}
          >
              <FileSpreadsheet size={18} /> 教育部高基表
          </button>
          <button 
            onClick={() => setActiveTab('custom')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'custom' ? 'border-[#3370ff] text-[#3370ff]' : 'border-transparent text-[#646a73] hover:text-[#1f2329]'}`}
          >
              <BarChart size={18} /> 自定义报表
          </button>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-lg border border-[#dee0e3] shadow-sm overflow-hidden flex flex-col min-h-0">
          
          {/* STANDARD REPORTS */}
          {activeTab === 'standard' && (
              <div className="p-6 overflow-y-auto custom-scrollbar">
                  {/* Data Check Status */}
                  <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-lg p-4 mb-6 flex items-start gap-3">
                      <div className="p-1 bg-[#10b981] rounded-full text-white mt-0.5">
                          <CheckCircle2 size={16} />
                      </div>
                      <div>
                          <h4 className="text-[#065f46] font-bold text-sm">数据源自检通过</h4>
                          <p className="text-[#047857] text-xs mt-1">
                              系统已自动校验土地、房屋、设备及人事数据库，数据完整性 99.8%，满足高基表生成要求。
                              内置算法版本: <span className="font-mono">v2023.11</span>
                          </p>
                      </div>
                  </div>

                  <div className="overflow-hidden border border-[#dee0e3] rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#f5f6f7] text-[#646a73] font-medium border-b border-[#dee0e3]">
                            <tr>
                                <th className="px-6 py-3">报表代码</th>
                                <th className="px-6 py-3">报表名称</th>
                                <th className="px-6 py-3">数据来源</th>
                                <th className="px-6 py-3">更新日期</th>
                                <th className="px-6 py-3">生成状态</th>
                                <th className="px-6 py-3">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#dee0e3]">
                            {HIGH_BASE_REPORTS.map(report => (
                                <tr key={report.id} className="hover:bg-[#f9f9f9] transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs font-medium text-[#646a73]">{report.id}</td>
                                    <td className="px-6 py-4 font-medium text-[#1f2329]">{report.name}</td>
                                    <td className="px-6 py-4 text-[#646a73]">{report.source}</td>
                                    <td className="px-6 py-4 text-[#646a73]">{report.lastUpdated}</td>
                                    <td className="px-6 py-4">
                                        {report.status === 'Ready' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#ecfdf5] text-[#059669]">已生成</span>}
                                        {report.status === 'Generating' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#eff6ff] text-[#3370ff] animate-pulse">计算中...</span>}
                                        {report.status === 'Error' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#fef2f2] text-[#f54a45]">数据异常</span>}
                                    </td>
                                    <td className="px-6 py-4 flex gap-3">
                                        <button disabled={report.status !== 'Ready'} className="text-[#3370ff] hover:text-[#285cc9] font-medium text-xs disabled:opacity-30 disabled:cursor-not-allowed">
                                            预览
                                        </button>
                                        <button disabled={report.status !== 'Ready'} className="text-[#3370ff] hover:text-[#285cc9] font-medium text-xs disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1">
                                            <Download size={14} /> 导出Excel
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
              </div>
          )}

          {/* CUSTOM REPORTS */}
          {activeTab === 'custom' && (
              <div className="flex h-full">
                  {/* Sidebar List */}
                  <div className="w-64 border-r border-[#dee0e3] flex flex-col bg-[#fcfcfd]">
                      <div className="p-4 border-b border-[#dee0e3]">
                          <button className="w-full bg-[#3370ff] hover:bg-[#285cc9] text-white py-2 rounded-md font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-colors">
                              <Plus size={16} /> 新建报表
                          </button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-2 space-y-1">
                          <div className="px-3 py-2 text-xs font-bold text-[#8f959e]">我的报表</div>
                          {CUSTOM_REPORTS.map(rep => (
                              <div key={rep.id} className="p-3 rounded-md hover:bg-[#e1eaff] cursor-pointer group transition-colors">
                                  <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center gap-2">
                                          {rep.type === 'Excel' ? <FileSpreadsheet size={16} className="text-[#059669]"/> : <FileText size={16} className="text-[#f54a45]"/>}
                                          <span className="text-sm font-medium text-[#1f2329] truncate w-32">{rep.name}</span>
                                      </div>
                                  </div>
                                  <div className="text-xs text-[#8f959e] pl-6 flex justify-between">
                                      <span>{rep.date}</span>
                                      <ArrowDownToLine size={14} className="opacity-0 group-hover:opacity-100 text-[#3370ff]"/>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Designer Area (Visual Placeholder) */}
                  <div className="flex-1 bg-[#f5f6f7] p-8 flex flex-col items-center justify-center relative">
                      <div className="bg-white rounded-lg shadow-lg border border-[#dee0e3] w-full max-w-2xl p-6 relative">
                          {/* Fake Toolbar */}
                          <div className="flex items-center gap-2 border-b border-[#dee0e3] pb-4 mb-4">
                              <div className="p-1.5 hover:bg-[#f2f3f5] rounded cursor-pointer"><Table size={18} className="text-[#646a73]"/></div>
                              <div className="p-1.5 hover:bg-[#f2f3f5] rounded cursor-pointer"><PieChart size={18} className="text-[#646a73]"/></div>
                              <div className="p-1.5 hover:bg-[#f2f3f5] rounded cursor-pointer"><BarChart size={18} className="text-[#646a73]"/></div>
                              <div className="w-px h-6 bg-[#dee0e3] mx-2"></div>
                              <div className="p-1.5 hover:bg-[#f2f3f5] rounded cursor-pointer"><Filter size={18} className="text-[#646a73]"/></div>
                              <div className="p-1.5 hover:bg-[#f2f3f5] rounded cursor-pointer"><Settings size={18} className="text-[#646a73]"/></div>
                          </div>

                          {/* Fake Canvas */}
                          <div className="border-2 border-dashed border-[#dee0e3] rounded-lg bg-[#fcfcfd] h-64 flex flex-col items-center justify-center text-[#8f959e] gap-3">
                              <div className="p-4 bg-white rounded-full shadow-sm">
                                  <BarChart size={32} className="text-[#3370ff] opacity-50" />
                              </div>
                              <p>拖拽字段到此处生成图表</p>
                              <div className="flex gap-2 mt-2">
                                  <span className="px-2 py-1 bg-[#e1eaff] text-[#3370ff] text-xs rounded border border-[#bfdbfe]">部门名称</span>
                                  <span className="px-2 py-1 bg-[#e1eaff] text-[#3370ff] text-xs rounded border border-[#bfdbfe]">定额面积</span>
                                  <span className="px-2 py-1 bg-[#e1eaff] text-[#3370ff] text-xs rounded border border-[#bfdbfe]">实占面积</span>
                              </div>
                          </div>

                          <div className="mt-6 flex justify-end gap-3">
                               <button className="px-4 py-2 text-sm text-[#646a73] hover:bg-[#f5f6f7] rounded">取消</button>
                               <button className="px-4 py-2 text-sm bg-[#3370ff] text-white hover:bg-[#285cc9] rounded shadow-sm">保存并生成</button>
                          </div>
                      </div>
                      
                      <div className="mt-4 text-[#8f959e] text-sm">
                          自定义报表设计器预览
                      </div>
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};

export default ReportCenter;