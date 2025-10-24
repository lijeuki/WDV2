import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, FileText, Clock, DollarSign, TrendingUp } from 'lucide-react';

interface ProcedureRecord {
  id: string;
  date: string;
  patientName: string;
  patientId: string;
  procedureName: string;
  toothNumber?: string;
  duration: string;
  cost: number;
  status: 'completed' | 'in-progress' | 'scheduled';
  doctorName: string;
}

// Mock data
const mockProcedures: ProcedureRecord[] = [
  {
    id: 'PROC-001',
    date: '2025-10-24',
    patientName: 'Ahmad Rizki',
    patientId: 'PAT-001',
    procedureName: 'Composite Restoration',
    toothNumber: '36',
    duration: '45 min',
    cost: 250,
    status: 'completed',
    doctorName: 'Dr. Smith'
  },
  {
    id: 'PROC-002',
    date: '2025-10-24',
    patientName: 'Sarah Johnson',
    patientId: 'PAT-002',
    procedureName: 'Root Canal Therapy',
    toothNumber: '26',
    duration: '90 min',
    cost: 1200,
    status: 'completed',
    doctorName: 'Dr. Smith'
  },
  {
    id: 'PROC-003',
    date: '2025-10-23',
    patientName: 'Michael Chen',
    patientId: 'PAT-003',
    procedureName: 'Tooth Extraction',
    toothNumber: '18',
    duration: '30 min',
    cost: 300,
    status: 'completed',
    doctorName: 'Dr. Smith'
  },
  {
    id: 'PROC-004',
    date: '2025-10-25',
    patientName: 'Emily Davis',
    patientId: 'PAT-004',
    procedureName: 'Crown Placement',
    toothNumber: '14',
    duration: '120 min',
    cost: 1800,
    status: 'scheduled',
    doctorName: 'Dr. Smith'
  }
];

export default function Procedures() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in-progress' | 'scheduled'>('all');

  const filteredProcedures = mockProcedures.filter(proc => {
    const matchesSearch = proc.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proc.procedureName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proc.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || proc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalProcedures = mockProcedures.length;
  const completedToday = mockProcedures.filter(p => p.status === 'completed' && p.date === '2025-10-24').length;
  const totalRevenue = mockProcedures.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.cost, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'scheduled': return 'bg-amber-100 text-amber-700 border-amber-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <DashboardLayout role="doctor">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Procedures</h1>
          <p className="text-gray-600">View and manage all dental procedures</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Procedures</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalProcedures}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="size-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{completedToday}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Clock className="size-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">${totalRevenue}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <DollarSign className="size-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Duration</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">65m</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <TrendingUp className="size-6 text-amber-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search by patient, procedure, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Procedures List */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Procedure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tooth
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProcedures.map((proc) => (
                  <tr key={proc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(proc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{proc.patientName}</div>
                        <div className="text-xs text-gray-500">{proc.patientId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{proc.procedureName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {proc.toothNumber ? `#${proc.toothNumber}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {proc.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${proc.cost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline" className={getStatusColor(proc.status)}>
                        {proc.status.charAt(0).toUpperCase() + proc.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredProcedures.length === 0 && (
          <div className="text-center py-12">
            <FileText className="size-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No procedures found matching your criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
