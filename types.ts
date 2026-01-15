// Domain Types

export enum UserRole {
  Teacher = 'Teacher',             // 教师
  CollegeAdmin = 'CollegeAdmin',   // 二级学院管理员
  AssetAdmin = 'AssetAdmin'        // 资产处管理员
}

export enum AssetStatus {
  Construction = 'Construction',   // 在建
  PreAcceptance = 'PreAcceptance', // 预验收 (已移交资产处)
  FinancialReview = 'FinancialReview', // 财务核算中
  Active = 'Active',               // 已转固 (正式入账)
  Disposal = 'Disposal'            // 处置
}

export enum AllocationStatus {
  Draft = 'Draft',
  PendingLevel1 = 'PendingLevel1', // Vice President
  PendingLevel2 = 'PendingLevel2', // Leadership Group
  PendingLevel3 = 'PendingLevel3', // Chancellor Meeting
  Approved = 'Approved',
  Rejected = 'Rejected'
}

export enum FeeStatus {
  Verifying = 'Verifying',       // 数据核对中
  BillGenerated = 'BillGenerated', // 账单已生成
  PendingConfirm = 'PendingConfirm', // 待学院确认
  FinanceProcessing = 'FinanceProcessing', // 财务扣款中
  Completed = 'Completed'        // 已完结
}

export interface Project {
  id: string;
  name: string;
  contractAmount: number;
  finalAmount?: number;
  contractor: string;
  status: AssetStatus;
  completionDate: string;
  hasCadData: boolean;
  isTempCardCreated?: boolean; // 临时资产卡片
}

export interface RoomRequest {
  id: string;
  department: string;
  area: number;
  reason: string;
  status: AllocationStatus;
  requestedDate: string;
}

export interface DepartmentFee {
  id: string;
  departmentName: string;
  quotaArea: number;
  actualArea: number;
  excessArea: number;
  excessCost: number;
  status: FeeStatus;
  isPaid: boolean; // Legacy simplified flag, relying on status mainly
  hasReminder: boolean; // 是否收到催缴通知
}

export interface RepairTicket {
  id: string;
  location: string;
  issue: string;
  reporter: string;
  status: 'Open' | 'Dispatched' | 'Completed';
  imageUrl?: string;
  date: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: any; // Lucide icon component type
}

// 1. Asset Digitalization Types

export interface LandParcel {
  id: string;
  certNo: string; // 土地证号
  name: string;
  area: number;
  type: 'Campus' | 'Living'; // 校区用地 | 生活区用地
  status: 'Unstarted' | 'InProgress' | 'Stored'; // 未征迁 | 征迁中 | 已入库
  acquisitionMethod: 'Allocation' | 'Transfer'; // 划拨 | 出让
  redLineMap?: string; // 红线图 URL
}

export interface BuildingAsset {
  id: string;
  name: string;
  code: string;
  location: string;
  structure: 'Frame' | 'BrickConcrete' | 'Steel'; // 框架 | 砖混 | 钢结构
  value: number; // 原值
  status: 'Construction' | 'TitleDeed' | 'Deregistered'; // 在建 | 办证 | 注销
  completionDate: string;
  hasCad: boolean;
  floorCount: number;
}

export interface RoomAsset {
  id: string;
  roomNo: string;
  buildingName: string;
  area: number;
  type: 'Teaching' | 'Logistics' | 'Admin' | 'Student' | 'Commercial';
  status: 'Empty' | 'SelfUse' | 'Rented' | 'Occupied' | 'Maintenance';
  department: string;
  floor: number;
}

// 2. Rule Engine Types

export interface QuotaConfig {
  id: string;
  category: 'Personnel' | 'Student' | 'Discipline';
  name: string; // e.g., "Professor", "PhD Student"
  value: number; // Area in sqm or Coefficient
  unit: string; // "m²/person" or "coefficient"
  description?: string;
}

export interface FeeTier {
  id: string;
  minExcess: number; // Percentage 0-100
  maxExcess: number | null; // Null for infinity
  rateName: string; // "Rate A", "Rate B"
  multiplier: number; // e.g., 1.5x base price
  color: string;
}

export interface AlertConfig {
  id: string;
  name: string;
  type: 'Utilization' | 'Safety' | 'Finance';
  thresholdValue: number;
  thresholdUnit: string; // "Months", "%", "Days"
  isEnabled: boolean;
  severity: 'High' | 'Medium' | 'Low';
}