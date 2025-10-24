import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign,
  Activity,
  FileText
} from 'lucide-react';

export default function Reports() {
  const [dateRange, setDateRange] = useState('week');

  const reportTypes = [
    {
      id: 'patient-summary',
      name: 'Patient Summary Report',
      description: 'Overview of all patients and their treatment history',
      icon: <Users className="size-6" />,
      color: 'blue'
    },
    {
      id: 'financial',
      name: 'Financial Report',
      description: 'Revenue, payments, and outstanding balances',
      icon: <DollarSign className="size-6" />,
      color: 'green'
    },
    {
      id: 'procedures',
      name: 'Procedures Report',
      description: 'All procedures performed with success rates',
      icon: <Activity className="size-6" />,
      color: 'purple'
    },
    {
      id: 'appointments',
      name: 'Appointments Report',
      description: 'Appointment statistics and no-show rates',
      icon: <Calendar className="size-6" />,
      color: 'amber'
    },
    {
      id: 'treatment-outcomes',
      name: 'Treatment Outcomes',
      description: 'Analysis of treatment success and complications',
      icon: <TrendingUp className="size-6" />,
      color: 'red'
    },
    {
      id: 'daily-summary',
      name: 'Daily Summary',
      description: 'End-of-day report with all activities',
      icon: <FileText className="size-6" />,
      color: 'indigo'
    }
  ];

  const quickStats = [
    { label: 'Total Patients This Week', value: '47', change: '+12%', trend: 'up' },
    { label: 'Procedures Completed', value: '134', change: '+8%', trend: 'up' },
    { label: 'Revenue Generated', value: '$18,450', change: '+15%', trend: 'up' },
    { label: 'Avg Treatment Time', value: '58 min', change: '-5%', trend: 'down' }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      amber: 'bg-amber-50 text-amber-600',
      red: 'bg-red-50 text-red-600',
      indigo: 'bg-indigo-50 text-indigo-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <DashboardLayout role="doctor">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Generate and view practice reports</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {quickStats.map((stat, idx) => (
            <Card key={idx} className="p-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <Badge variant="outline" className={stat.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
                    {stat.change}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Report Types */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Available Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTypes.map((report) => (
              <Card key={report.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${getColorClasses(report.color)}`}>
                    {report.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{report.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <BarChart3 className="size-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="size-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <Card>
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Recently Generated Reports</h2>
          </div>
          <div className="divide-y">
            {[
              { name: 'Financial Report - October 2025', date: '2025-10-24 14:30', size: '245 KB', type: 'PDF' },
              { name: 'Patient Summary - Weekly', date: '2025-10-21 09:15', size: '180 KB', type: 'PDF' },
              { name: 'Procedures Report - Q4 2025', date: '2025-10-20 16:45', size: '320 KB', type: 'Excel' }
            ].map((report, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 rounded">
                    <FileText className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{report.name}</p>
                    <p className="text-sm text-gray-500">Generated on {report.date} • {report.size} • {report.type}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    View
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Download className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Scheduled Reports */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Scheduled Reports</h2>
            <Button size="sm">
              <Calendar className="size-4 mr-2" />
              Schedule New
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Weekly Patient Summary</p>
                <p className="text-sm text-gray-600">Every Monday at 9:00 AM</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Monthly Financial Report</p>
                <p className="text-sm text-gray-600">Last day of month at 6:00 PM</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
