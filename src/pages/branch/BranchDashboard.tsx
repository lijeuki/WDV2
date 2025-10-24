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
  Building2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  BarChart3,
  Award,
  AlertCircle,
  CheckCircle2,
  Download,
} from 'lucide-react';

// Mock data for multi-clinic analytics
const mockClinics = [
  {
    id: '1',
    name: 'Jakarta Central Clinic',
    location: 'Jakarta Pusat',
    revenue: {
      current: 78000000,
      previous: 72000000,
      change: 8.3,
    },
    patients: {
      active: 1247,
      new: 42,
      change: 4.1,
    },
    appointments: {
      total: 342,
      completed: 298,
      noShow: 32,
    },
    staff: {
      total: 12,
      doctors: 3,
      active: 12,
    },
    rating: 4.8,
    status: 'active',
  },
  {
    id: '2',
    name: 'Jakarta North Clinic',
    location: 'Jakarta Utara',
    revenue: {
      current: 65000000,
      previous: 68000000,
      change: -4.4,
    },
    patients: {
      active: 945,
      new: 28,
      change: -2.1,
    },
    appointments: {
      total: 278,
      completed: 245,
      noShow: 23,
    },
    staff: {
      total: 10,
      doctors: 2,
      active: 9,
    },
    rating: 4.6,
    status: 'active',
  },
  {
    id: '3',
    name: 'Jakarta South Clinic',
    location: 'Jakarta Selatan',
    revenue: {
      current: 92000000,
      previous: 85000000,
      change: 8.2,
    },
    patients: {
      active: 1534,
      new: 56,
      change: 7.2,
    },
    appointments: {
      total: 425,
      completed: 389,
      noShow: 28,
    },
    staff: {
      total: 15,
      doctors: 4,
      active: 15,
    },
    rating: 4.9,
    status: 'active',
  },
];

const branchSummary = {
  totalRevenue: 235000000,
  revenueChange: 4.7,
  totalPatients: 3726,
  patientsChange: 3.4,
  totalAppointments: 1045,
  appointmentsChange: 5.1,
  totalStaff: 37,
  avgRating: 4.77,
};

const revenueComparison = mockClinics.map((clinic) => ({
  clinic: clinic.name.split(' ').slice(0, 2).join(' '),
  revenue: clinic.revenue.current,
}));

export default function BranchDashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedClinic, setSelectedClinic] = useState<string>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short',
    }).format(amount);
  };

  const displayedClinics = selectedClinic === 'all' 
    ? mockClinics 
    : mockClinics.filter((c) => c.id === selectedClinic);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="size-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold">Branch Dashboard</h1>
              <p className="text-gray-600">Jakarta Branch - Multi-Clinic Overview</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Select value={selectedClinic} onValueChange={setSelectedClinic}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select clinic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clinics</SelectItem>
                {mockClinics.map((clinic) => (
                  <SelectItem key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
              Export Report
            </Button>
          </div>
        </div>

        {/* Branch Summary (only show when all clinics selected) */}
        {selectedClinic === 'all' && (
          <>
            <div className="grid grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(branchSummary.totalRevenue)}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {branchSummary.revenueChange >= 0 ? (
                        <>
                          <TrendingUp className="size-4 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">
                            +{branchSummary.revenueChange}%
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="size-4 text-red-600" />
                          <span className="text-sm text-red-600 font-medium">
                            {branchSummary.revenueChange}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <DollarSign className="size-8 text-green-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Patients</p>
                    <p className="text-2xl font-bold">{branchSummary.totalPatients}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="size-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        +{branchSummary.patientsChange}%
                      </span>
                    </div>
                  </div>
                  <Users className="size-8 text-blue-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Appointments</p>
                    <p className="text-2xl font-bold">{branchSummary.totalAppointments}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="size-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        +{branchSummary.appointmentsChange}%
                      </span>
                    </div>
                  </div>
                  <Calendar className="size-8 text-purple-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
                    <p className="text-2xl font-bold">{branchSummary.avgRating} ⭐</p>
                    <p className="text-sm text-gray-600 mt-2">{mockClinics.length} clinics</p>
                  </div>
                  <Award className="size-8 text-yellow-600" />
                </div>
              </Card>
            </div>

            {/* Revenue Comparison Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Revenue Comparison</h3>
                <BarChart3 className="size-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {revenueComparison.map((item, index) => {
                  const maxRevenue = Math.max(...revenueComparison.map((i) => i.revenue));
                  const percentage = (item.revenue / maxRevenue) * 100;
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{item.clinic}</span>
                        <span className="text-sm font-semibold">{formatCurrency(item.revenue)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        )}

        {/* Clinic Performance Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Clinic Performance</h2>
          {displayedClinics.map((clinic) => (
            <Card key={clinic.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold">{clinic.name}</h3>
                    <Badge className="bg-green-100 text-green-800">{clinic.status}</Badge>
                    <Badge variant="outline">
                      {clinic.rating} ⭐
                    </Badge>
                  </div>
                  <p className="text-gray-600 mt-1">{clinic.location}</p>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-6 mb-4">
                {/* Revenue */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="size-4 text-gray-400" />
                    <p className="text-sm text-gray-600">Revenue</p>
                  </div>
                  <p className="text-lg font-bold">{formatCurrency(clinic.revenue.current)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {clinic.revenue.change >= 0 ? (
                      <>
                        <TrendingUp className="size-3 text-green-600" />
                        <span className="text-xs text-green-600 font-medium">
                          +{clinic.revenue.change}%
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="size-3 text-red-600" />
                        <span className="text-xs text-red-600 font-medium">
                          {clinic.revenue.change}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Patients */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="size-4 text-gray-400" />
                    <p className="text-sm text-gray-600">Patients</p>
                  </div>
                  <p className="text-lg font-bold">{clinic.patients.active}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {clinic.patients.new} new this month
                  </p>
                </div>

                {/* Appointments */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="size-4 text-gray-400" />
                    <p className="text-sm text-gray-600">Appointments</p>
                  </div>
                  <p className="text-lg font-bold">{clinic.appointments.total}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {clinic.appointments.completed} completed
                  </p>
                </div>

                {/* Staff */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="size-4 text-gray-400" />
                    <p className="text-sm text-gray-600">Staff</p>
                  </div>
                  <p className="text-lg font-bold">{clinic.staff.total}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {clinic.staff.doctors} doctors
                  </p>
                </div>
              </div>

              {/* Performance Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  {clinic.appointments.noShow / clinic.appointments.total < 0.1 ? (
                    <CheckCircle2 className="size-5 text-green-600" />
                  ) : (
                    <AlertCircle className="size-5 text-yellow-600" />
                  )}
                  <div>
                    <p className="text-xs text-gray-600">No-Show Rate</p>
                    <p className="text-sm font-semibold">
                      {((clinic.appointments.noShow / clinic.appointments.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {clinic.revenue.change >= 0 ? (
                    <CheckCircle2 className="size-5 text-green-600" />
                  ) : (
                    <AlertCircle className="size-5 text-red-600" />
                  )}
                  <div>
                    <p className="text-xs text-gray-600">Revenue Trend</p>
                    <p className="text-sm font-semibold">
                      {clinic.revenue.change >= 0 ? 'Growing' : 'Declining'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {clinic.patients.change >= 0 ? (
                    <CheckCircle2 className="size-5 text-green-600" />
                  ) : (
                    <AlertCircle className="size-5 text-red-600" />
                  )}
                  <div>
                    <p className="text-xs text-gray-600">Patient Growth</p>
                    <p className="text-sm font-semibold">
                      {clinic.patients.change >= 0 ? '+' : ''}{clinic.patients.change}%
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Insights and Alerts */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Branch Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Strong Performance</p>
                <p className="text-sm text-green-700">
                  Jakarta South Clinic is the top performer with 8.2% revenue growth
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="size-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">Attention Needed</p>
                <p className="text-sm text-yellow-700">
                  Jakarta North Clinic revenue declined by 4.4% - Consider operational review
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="size-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Opportunity</p>
                <p className="text-sm text-blue-700">
                  Overall branch performance is excellent with 4.7% revenue growth
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
