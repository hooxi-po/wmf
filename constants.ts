import { Project, AssetStatus, RoomRequest, AllocationStatus, DepartmentFee, RepairTicket, FeeStatus, LandParcel, BuildingAsset, RoomAsset, QuotaConfig, FeeTier, AlertConfig } from './types';

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'PRJ-2023-001',
    name: '理科实验楼 A 座',
    contractAmount: 15000000,
    contractor: '环球建设集团',
    status: AssetStatus.PreAcceptance,
    completionDate: '2023-10-15',
    hasCadData: true
  },
  {
    id: 'PRJ-2023-004',
    name: '学生宿舍三期工程',
    contractAmount: 8500000,
    contractor: '城市建设股份有限公司',
    status: AssetStatus.Construction,
    completionDate: '2024-03-01',
    hasCadData: false
  }
];

export const MOCK_REQUESTS: RoomRequest[] = [
  {
    id: 'REQ-101',
    department: '计算机科学与技术学院',
    area: 300,
    reason: '新建人工智能(AI)科研实验室',
    status: AllocationStatus.PendingLevel1, // < 500m
    requestedDate: '2023-11-01'
  },
  {
    id: 'REQ-102',
    department: '机械工程学院',
    area: 1200,
    reason: '重型机械加工车间扩建',
    status: AllocationStatus.PendingLevel3, // > 1000m
    requestedDate: '2023-11-05'
  }
];

export const MOCK_FEES: DepartmentFee[] = [
  {
    id: 'FEE-001',
    departmentName: '物理学院',
    quotaArea: 1000,
    actualArea: 1200,
    excessArea: 200,
    excessCost: 24000,
    isPaid: false,
    status: FeeStatus.BillGenerated,
    hasReminder: false
  },
  {
    id: 'FEE-002',
    departmentName: '化学化工学院',
    quotaArea: 1500,
    actualArea: 1450,
    excessArea: 0,
    excessCost: 0,
    isPaid: true,
    status: FeeStatus.Completed,
    hasReminder: false
  },
  {
    id: 'FEE-003',
    departmentName: '人文艺术学院',
    quotaArea: 800,
    actualArea: 950,
    excessArea: 150,
    excessCost: 18000,
    isPaid: false,
    status: FeeStatus.BillGenerated,
    hasReminder: false
  }
];

export const MOCK_TICKETS: RepairTicket[] = [
  {
    id: 'TKT-5521',
    location: '图书馆 304 室',
    issue: '中央空调漏水',
    reporter: '张老师',
    status: 'Open',
    imageUrl: 'https://picsum.photos/200/200',
    date: '2023-11-10'
  },
  {
    id: 'TKT-5520',
    location: '行政楼 102 室',
    issue: '门把手损坏',
    reporter: '李主任',
    status: 'Completed',
    imageUrl: 'https://picsum.photos/200/200',
    date: '2023-11-09'
  }
];

// --- Digitalization Mock Data ---

export const MOCK_LANDS: LandParcel[] = [
  {
    id: 'LND-001',
    certNo: '榕国用(2010)第00521号',
    name: '旗山校区主地块',
    area: 850000,
    type: 'Campus',
    status: 'Stored',
    acquisitionMethod: 'Allocation'
  },
  {
    id: 'LND-002',
    certNo: '待办理',
    name: '北区扩建预留地',
    area: 120000,
    type: 'Campus',
    status: 'InProgress',
    acquisitionMethod: 'Transfer'
  }
];

export const MOCK_BUILDINGS: BuildingAsset[] = [
  {
    id: 'BLD-A01',
    name: '行政办公大楼',
    code: '001',
    location: '旗山校区中轴线北侧',
    structure: 'Frame',
    value: 120000000,
    status: 'TitleDeed',
    completionDate: '2015-09-01',
    hasCad: true,
    floorCount: 12
  },
  {
    id: 'BLD-T05',
    name: '机械工程实验楼',
    code: '005',
    location: '旗山校区西侧',
    structure: 'Frame',
    value: 85000000,
    status: 'TitleDeed',
    completionDate: '2018-06-15',
    hasCad: true,
    floorCount: 6
  },
  {
    id: 'BLD-S02',
    name: '学生公寓二期3号楼',
    code: 'S03',
    location: '生活区南苑',
    structure: 'BrickConcrete',
    value: 45000000,
    status: 'Construction',
    completionDate: '2024-05-30',
    hasCad: false,
    floorCount: 6
  }
];

export const MOCK_ROOMS: RoomAsset[] = [
  { id: 'RM-101', roomNo: '101', buildingName: '行政办公大楼', area: 120, type: 'Admin', status: 'SelfUse', department: '党政办公室', floor: 1 },
  { id: 'RM-102', roomNo: '102', buildingName: '行政办公大楼', area: 80, type: 'Admin', status: 'SelfUse', department: '财务处', floor: 1 },
  { id: 'RM-305', roomNo: '305', buildingName: '机械工程实验楼', area: 240, type: 'Teaching', status: 'SelfUse', department: '机械工程学院', floor: 3 },
  { id: 'RM-306', roomNo: '306', buildingName: '机械工程实验楼', area: 150, type: 'Teaching', status: 'Maintenance', department: '机械工程学院', floor: 3 },
  { id: 'RM-101S', roomNo: '101', buildingName: '学生公寓二期3号楼', area: 35, type: 'Student', status: 'Empty', department: '学工处', floor: 1 },
];

// --- Rule Engine Mock Data ---

export const MOCK_QUOTA_CONFIGS: QuotaConfig[] = [
  { id: 'Q-01', category: 'Personnel', name: '正高级职称 (教授)', value: 24, unit: 'm²/人', description: '科研与行政办公合计' },
  { id: 'Q-02', category: 'Personnel', name: '副高级职称 (副教授)', value: 16, unit: 'm²/人', description: '科研与行政办公合计' },
  { id: 'Q-03', category: 'Personnel', name: '中级职称及以下', value: 9, unit: 'm²/人', description: '集中式办公' },
  { id: 'Q-04', category: 'Student', name: '博士研究生', value: 6, unit: 'm²/生', description: '工位及实验辅助' },
  { id: 'Q-05', category: 'Student', name: '硕士研究生', value: 3, unit: 'm²/生', description: '工位及实验辅助' },
  { id: 'Q-06', category: 'Discipline', name: '理工科系数', value: 1.2, unit: 'coefficient', description: '实验设备占地调整' },
  { id: 'Q-07', category: 'Discipline', name: '人文社科系数', value: 1.0, unit: 'coefficient', description: '标准办公' },
  { id: 'Q-08', category: 'Discipline', name: '艺术体育系数', value: 1.5, unit: 'coefficient', description: '排练场馆/器械需求' },
];

export const MOCK_FEE_TIERS: FeeTier[] = [
  { id: 'TIER-1', minExcess: 0, maxExcess: 30, rateName: '费率 A (基础调节)', multiplier: 1.0, color: 'bg-green-100 text-green-800' },
  { id: 'TIER-2', minExcess: 30, maxExcess: 60, rateName: '费率 B (惩罚性)', multiplier: 1.5, color: 'bg-yellow-100 text-yellow-800' },
  { id: 'TIER-3', minExcess: 60, maxExcess: null, rateName: '费率 C (熔断性)', multiplier: 3.0, color: 'bg-red-100 text-red-800' },
];

export const MOCK_ALERT_CONFIGS: AlertConfig[] = [
  { id: 'ALT-01', name: '低利用率预警', type: 'Utilization', thresholdValue: 60, thresholdUnit: '%', isEnabled: true, severity: 'Medium' },
  { id: 'ALT-02', name: '空置时长预警', type: 'Utilization', thresholdValue: 6, thresholdUnit: '个月', isEnabled: true, severity: 'Medium' },
  { id: 'ALT-03', name: '消防整改超期', type: 'Safety', thresholdValue: 15, thresholdUnit: '天', isEnabled: true, severity: 'High' },
  { id: 'ALT-04', name: '结构鉴定超期', type: 'Safety', thresholdValue: 10, thresholdUnit: '年', isEnabled: true, severity: 'High' },
  { id: 'ALT-05', name: '欠费熔断阈值', type: 'Finance', thresholdValue: 45, thresholdUnit: '天', isEnabled: true, severity: 'High' },
];