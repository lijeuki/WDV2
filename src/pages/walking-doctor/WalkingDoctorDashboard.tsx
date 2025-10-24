import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Crown,
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Database,
  Shield,
  Settings,
  FileText,
  Download,
} from 'lucide-react';

// Mock system-wide data
const systemStats = {
  totalBranches: 3,
  totalClinics: 8,
  totalUsers: 127,
  totalPatients: 15432,
  totalRevenue: 1850000000,
  revenueChange: 12.3,
  activeUsers: 118,
  systemUptime: 99.8,
};

const branchesData = [
  {
    id: '1',
    name: 'Jakarta Branch',
    clinics: 3,
    staff: 37,
    patients: 3726,
    revenue: 235000000,
    revenueChange: 4.7,
    status: 'active',
    performance: 'excellent',
  },
  {
    id: '2',
    name: 'Surabaya Branch',
    clinics: 3,
    staff: 42,
    patients: 5234,
    revenue: 298000000,
    revenueChange: 8.1,
    status: 'active',
    performance: 'excellent',
  },
  {
    id: '3',
    name: 'Bandung Branch',
    clinics: 2,
    staff: 28,
    patients: 2845,
    revenue: 178000000,
    revenueChange: 3.2,
    status: 'active',
    performance: 'good',
  },
];

const recentActivity = [
  {
    id: '1',
    type: 'user_created',
    description: 'New doctor added: Dr. Sarah Johnson (Jakarta Central)',
    timestamp: '2025-10-24 14:30',
    user: 'admin@walkingdoctors.co.id',
  },
  {
    id: '2',
    type: 'clinic_created',
    description: 'New clinic opened: Bandung West Clinic',
    timestamp: '2025-10-24 10:15',
    user: 'admin@walkingdoctors.co.id',
  },
  {
    id: '3',
    type: 'system_update',
    description: 'System updated to version 2.1.0',
    timestamp: '2025-10-23 22:00',
    user: 'System',
  },
  {
    id: '4',
    type: 'user_suspended',
    description: 'User suspended: desk@clinic3.com (policy violation)',
    timestamp: '2025-10-23 16:45',
    user: 'admin@walkingdoctors.co.id',
  },
  {
    id: '5',
    type: 'backup_completed',
    description: 'Daily database backup completed successfully',
    timestamp: '2025-10-24 02:00',
    user: 'System',
  },
];

const userStats = {
  byRole: [
    { role: 'Doctor', count: 32, percentage: 25.2 },
    { role: 'Front Desk', count: 28, percentage: 22.0 },
    { role: 'Hygienist', count: 24, percentage: 18.9 },
    { role: 'Assistant', count: 20, percentage: 15.7 },
    { role: 'Clinic Owner', count: 8, percentage: 6.3 },
    { role: 'Branch Owner', count: 3, percentage: 2.4 },
    { role: 'Walking Doctor', count: 1, percentage: 0.8 },
  ],
  byStatus: [
    { status: 'Active', count: 118, color: 'bg-green-500' },
    { status: 'On Leave', count: 6, color: 'bg-yellow-500' },
    { status: 'Suspended', count: 3, color: 'bg-red-500' },
  ],
};

export default function WalkingDoctorDashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short',
    }).format(amount);
  };

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
      case 'fair':
        return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_created':
        return <Users className="size-4 text-blue-600" />;
      case 'clinic_created':
        return <Building2 className="size-4 text-green-600" />;
      case 'system_update':
        return <Settings className="size-4 text-purple-600" />;
      case 'user_suspended':
        return <Shield className="size-4 text-red-600" />;
      case 'backup_completed':
        return <Database className="size-4 text-teal-600" />;
      default:
        return <Activity className="size-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Crown className="size-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Walking Doctor Dashboard</h1>
              <p className="text-gray-600">System-Wide Administration & Analytics</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="size-4 mr-2" />
              System Report
            </Button>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Total Branches</p>
                <p className="text-3xl font-bold">{systemStats.totalBranches}</p>
              </div>
              <Building2 className="size-8 text-purple-200" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Clinics</p>
                <p className="text-3xl font-bold">{systemStats.totalClinics}</p>
              </div>
              <Building2 className="size-8 text-blue-200" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">System Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(systemStats.totalRevenue)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="size-4" />
                  <span className="text-sm">+{systemStats.revenueChange}%</span>
                </div>
              </div>
              <DollarSign className="size-8 text-green-200" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold">{systemStats.totalUsers}</p>
                <p className="text-sm text-orange-100 mt-1">{systemStats.activeUsers} active</p>
              </div>
              <Users className="size-8 text-orange-200" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Branch Performance */}
          <div className="col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Branch Performance</h2>
            {branchesData.map((branch) => (
              <Card key={branch.id} className="p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold">{branch.name}</h3>
                      {getPerformanceBadge(branch.performance)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {branch.clinics} clinics • {branch.staff} staff • {branch.patients} patients
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Revenue</p>
                    <p className="text-lg font-bold">{formatCurrency(branch.revenue)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="size-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">
                        +{branch.revenueChange}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 mb-1">Clinics</p>
                    <p className="text-lg font-bold">{branch.clinics}</p>
                    <p className="text-xs text-gray-500 mt-1">All active</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 mb-1">Staff</p>
                    <p className="text-lg font-bold">{branch.staff}</p>
                    <p className="text-xs text-gray-500 mt-1">Active employees</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* User Distribution */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">User Distribution</h2>
            
            <Card className="p-5">
              <h3 className="font-semibold mb-4">By Role</h3>
              <div className="space-y-3">
                {userStats.byRole.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{item.role}</span>
                      <span className="text-sm font-semibold">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold mb-4">By Status</h3>
              <div className="space-y-3">
                {userStats.byStatus.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm">{item.status}</span>
                    </div>
                    <span className="text-sm font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent System Activity</h2>
            <Button variant="outline" size="sm">
              <FileText className="size-4 mr-2" />
              View All Logs
            </Button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                    <span>{activity.timestamp}</span>
                    <span>•</span>
                    <span>{activity.user}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <Users className="size-8 text-blue-600 mb-3" />
            <h3 className="font-semibold mb-1">User Management</h3>
            <p className="text-sm text-gray-600">Add, edit, or remove users</p>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <Building2 className="size-8 text-green-600 mb-3" />
            <h3 className="font-semibold mb-1">Manage Branches</h3>
            <p className="text-sm text-gray-600">View and configure branches</p>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <Settings className="size-8 text-purple-600 mb-3" />
            <h3 className="font-semibold mb-1">System Settings</h3>
            <p className="text-sm text-gray-600">Configure system parameters</p>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <Database className="size-8 text-orange-600 mb-3" />
            <h3 className="font-semibold mb-1">Data Export</h3>
            <p className="text-sm text-gray-600">Export reports and backups</p>
          </Card>
        </div>

        {/* System Health */}
        <Card className="p-6 bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">System Health</h3>
              <div className="space-y-2 text-sm text-green-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>System Uptime: {systemStats.systemUptime}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>All services operational</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Database: Optimal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Last backup: 2 hours ago</span>
                </div>
              </div>
            </div>
            <Activity className="size-12 text-green-600" />
          </div>
        </Card>
      </div>
    </div>
  );
}
