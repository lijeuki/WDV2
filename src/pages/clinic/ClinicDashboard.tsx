/**
 * Clinic Owner Dashboard
 * Analytics, KPIs, and management overview for clinic owners
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Activity,
  BarChart3,
  PieChart,
  Download,
  Filter
} from 'lucide-react';

// Mock data - in real app, fetch from Supabase
const mockAnalytics = {
  revenue: {
    current: 78000000,
    previous: 72000000,
    change: 8.3,
    target: 80000000
  },
  patients: {
    active: 1247,
    new: 42,
    change: 4.1,
    retention: 89
  },
  appointments: {
    total: 342,
    completed: 298,
    cancelled: 12,
    noShow: 32
  },
  avgTransaction: {
    current: 2400000,
    previous: 2100000,
    change: 14.3
  },
  metrics: {
    newPatients: { value: 42, change: 12 },
    retention: { value: 89, change: 3 },
    daysInAR: { value: 28, change: -4 },
    noShowRate: { value: 4.2, change: -1.3 },
    chairUtilization: { value: 78, change: 5 },
    collectionRate: { value: 94, change: 2 }
  }
};

const revenueChartData = [
  { month: 'Apr', revenue: 65000000 },
  { month: 'May', revenue: 68000000 },
  { month: 'Jun', revenue: 72000000 },
  { month: 'Jul', revenue: 70000000 },
  { month: 'Aug', revenue: 75000000 },
  { month: 'Sep', revenue: 78000000 }
];

const treatmentAcceptanceData = [
  { name: 'Accepted', value: 68, color: 'bg-green-500' },
  { name: 'Pending', value: 18, color: 'bg-yellow-500' },
  { name: 'Declined', value: 14, color: 'bg-red-500' }
];

const procedureMixData = [
  { name: 'Cleaning', count: 145, revenue: 15000000 },
  { name: 'Filling', count: 98, revenue: 12000000 },
  { name: 'Root Canal', count: 32, revenue: 18000000 },
  { name: 'Crown', count: 24, revenue: 19000000 },
  { name: 'Extraction', count: 43, revenue: 6000000 }
];

const topPerformers = [
  { name: 'Dr. Smith', procedures: 145, revenue: 28000000, satisfaction: 4.8 },
  { name: 'Dr. Johnson', procedures: 132, revenue: 25000000, satisfaction: 4.7 },
  { name: 'Dr. Lee', procedures: 98, revenue: 18000000, satisfaction: 4.6 }
];

export default function ClinicDashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="size-4 text-green-600" />
    ) : (
      <TrendingDown className="size-4 text-red-600" />
    );
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Clinic Analytics</h1>
            <p className="text-gray-600">Performance metrics and insights</p>
          </div>
          <div className="flex gap-3">
            <div className="flex gap-2">
              {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className="capitalize"
                >
                  {range}
                </Button>
              ))}
            </div>
            <Button variant="outline">
              <Filter className="size-4 mr-2" />
              Filters
            </Button>
            <Button>
              <Download className="size-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Revenue */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="size-6 text-blue-600" />
              </div>
              {getChangeIcon(mockAnalytics.revenue.change)}
            </div>
            <h3 className="text-2xl font-bold mb-1">
              {formatCurrency(mockAnalytics.revenue.current)}
            </h3>
            <p className="text-sm text-gray-600 mb-2">Monthly Revenue</p>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${getChangeColor(mockAnalytics.revenue.change)}`}>
                {formatPercent(mockAnalytics.revenue.change)}
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          </Card>

          {/* Active Patients */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="size-6 text-green-600" />
              </div>
              {getChangeIcon(mockAnalytics.patients.change)}
            </div>
            <h3 className="text-2xl font-bold mb-1">
              {mockAnalytics.patients.active.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-600 mb-2">Active Patients</p>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${getChangeColor(mockAnalytics.patients.change)}`}>
                {formatPercent(mockAnalytics.patients.change)}
              </span>
              <span className="text-xs text-gray-500">{mockAnalytics.patients.new} new</span>
            </div>
          </Card>

          {/* Avg Transaction */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="size-6 text-purple-600" />
              </div>
              {getChangeIcon(mockAnalytics.avgTransaction.change)}
            </div>
            <h3 className="text-2xl font-bold mb-1">
              {formatCurrency(mockAnalytics.avgTransaction.current)}
            </h3>
            <p className="text-sm text-gray-600 mb-2">Avg Transaction</p>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${getChangeColor(mockAnalytics.avgTransaction.change)}`}>
                {formatPercent(mockAnalytics.avgTransaction.change)}
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          </Card>

          {/* Appointments */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="size-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">
              {mockAnalytics.appointments.total}
            </h3>
            <p className="text-sm text-gray-600 mb-2">Monthly Appointments</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {mockAnalytics.appointments.completed} completed
              </span>
            </div>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Revenue Trend</h3>
              <BarChart3 className="size-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {revenueChartData.map((data) => {
                const maxRevenue = Math.max(...revenueChartData.map(d => d.revenue));
                const widthPercent = (data.revenue / maxRevenue) * 100;
                
                return (
                  <div key={data.month}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">{data.month}</span>
                      <span className="text-sm font-semibold">{formatCurrency(data.revenue)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Treatment Acceptance */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Treatment Acceptance</h3>
              <PieChart className="size-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {treatmentAcceptanceData.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold">{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">68% Acceptance Rate</p>
                  <p className="text-xs text-blue-700">Above industry average of 60%</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Advanced Metrics */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-6">Practice Performance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Patient Metrics */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-600 uppercase">Patient Metrics</h4>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">New Patients</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{mockAnalytics.metrics.newPatients.value}</span>
                  <Badge variant={mockAnalytics.metrics.newPatients.change >= 0 ? 'default' : 'destructive'} className="text-xs">
                    {formatPercent(mockAnalytics.metrics.newPatients.change)}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Retention Rate</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{mockAnalytics.metrics.retention.value}%</span>
                  <Badge variant="default" className="text-xs">
                    {formatPercent(mockAnalytics.metrics.retention.change)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Financial Metrics */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-600 uppercase">Financial Health</h4>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Days in AR</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{mockAnalytics.metrics.daysInAR.value}d</span>
                  <Badge variant="default" className="text-xs">
                    {mockAnalytics.metrics.daysInAR.change}d
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Collection Rate</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{mockAnalytics.metrics.collectionRate.value}%</span>
                  <Badge variant="default" className="text-xs">
                    {formatPercent(mockAnalytics.metrics.collectionRate.change)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Operational Metrics */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-600 uppercase">Operations</h4>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Chair Utilization</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{mockAnalytics.metrics.chairUtilization.value}%</span>
                  <Badge variant="default" className="text-xs">
                    {formatPercent(mockAnalytics.metrics.chairUtilization.change)}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">No-Show Rate</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{mockAnalytics.metrics.noShowRate.value}%</span>
                  <Badge variant="default" className="text-xs">
                    {formatPercent(mockAnalytics.metrics.noShowRate.change)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Procedure Mix */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Procedure Mix</h3>
            
            <div className="space-y-3">
              {procedureMixData.map((proc) => (
                <div key={proc.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{proc.name}</p>
                    <p className="text-sm text-gray-600">{proc.count} procedures</p>
                  </div>
                  <p className="font-semibold text-blue-600">{formatCurrency(proc.revenue)}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Performers */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Top Performers</h3>
            
            <div className="space-y-3">
              {topPerformers.map((doctor, index) => (
                <div key={doctor.name} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    'bg-orange-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{doctor.name}</p>
                    <p className="text-sm text-gray-600">{doctor.procedures} procedures</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">{formatCurrency(doctor.revenue)}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-600">★ {doctor.satisfaction}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Alerts */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Alerts & Recommendations</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="size-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">High No-Show Rate This Week</p>
                <p className="text-sm text-yellow-800">8 no-shows detected. Consider implementing SMS reminders.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Revenue Target On Track</p>
                <p className="text-sm text-green-800">Currently at 97.5% of monthly target with 5 days remaining.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Clock className="size-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Peak Hours Identified</p>
                <p className="text-sm text-blue-800">9-11 AM and 2-4 PM show highest productivity. Optimize staffing accordingly.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
