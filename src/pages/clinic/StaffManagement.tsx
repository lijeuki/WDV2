import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Award,
  Clock,
  TrendingUp,
} from 'lucide-react';

interface StaffMember {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'doctor' | 'hygienist' | 'assistant' | 'front_desk';
  specialization?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  employmentStatus: 'active' | 'on_leave' | 'suspended';
  hireDate: string;
  stats: {
    patientsServed: number;
    avgRating: number;
    completedProcedures: number;
  };
}

// Mock staff data
const mockStaff: StaffMember[] = [
  {
    id: '1',
    fullName: 'Dr. John Smith',
    email: 'doctor@clinic.com',
    phone: '+62-811-4444-4444',
    role: 'doctor',
    specialization: 'General Dentistry',
    licenseNumber: 'DDS-12345',
    licenseExpiry: '2026-12-31',
    employmentStatus: 'active',
    hireDate: '2020-01-15',
    stats: {
      patientsServed: 1247,
      avgRating: 4.8,
      completedProcedures: 2341,
    },
  },
  {
    id: '2',
    fullName: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@clinic.com',
    phone: '+62-811-4444-5555',
    role: 'doctor',
    specialization: 'Orthodontics',
    licenseNumber: 'DDS-12346',
    licenseExpiry: '2027-06-30',
    employmentStatus: 'active',
    hireDate: '2021-03-20',
    stats: {
      patientsServed: 892,
      avgRating: 4.9,
      completedProcedures: 1823,
    },
  },
  {
    id: '3',
    fullName: 'Ms. Mary Clean',
    email: 'hygienist@clinic.com',
    phone: '+62-811-6666-6666',
    role: 'hygienist',
    specialization: 'Dental Hygiene',
    licenseNumber: 'DH-78901',
    licenseExpiry: '2025-12-31',
    employmentStatus: 'active',
    hireDate: '2019-08-10',
    stats: {
      patientsServed: 2156,
      avgRating: 4.7,
      completedProcedures: 3421,
    },
  },
  {
    id: '4',
    fullName: 'Ms. Sarah Front',
    email: 'desk@clinic.com',
    phone: '+62-811-5555-5555',
    role: 'front_desk',
    employmentStatus: 'active',
    hireDate: '2020-05-01',
    stats: {
      patientsServed: 5432,
      avgRating: 4.6,
      completedProcedures: 0,
    },
  },
  {
    id: '5',
    fullName: 'Mr. Tom Helper',
    email: 'assistant@clinic.com',
    phone: '+62-811-7777-7777',
    role: 'assistant',
    employmentStatus: 'active',
    hireDate: '2021-09-15',
    stats: {
      patientsServed: 0,
      avgRating: 4.5,
      completedProcedures: 0,
    },
  },
];

export default function StaffManagement() {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesStatus = filterStatus === 'all' || member.employmentStatus === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'doctor':
        return 'bg-blue-100 text-blue-800';
      case 'hygienist':
        return 'bg-green-100 text-green-800';
      case 'assistant':
        return 'bg-purple-100 text-purple-800';
      case 'front_desk':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'doctor':
        return 'Doctor';
      case 'hygienist':
        return 'Hygienist';
      case 'assistant':
        return 'Assistant';
      case 'front_desk':
        return 'Front Desk';
      default:
        return role;
    }
  };

  const handleAddStaff = () => {
    alert('Add Staff form would open here');
    // In real app, open modal/form to add new staff
  };

  const handleEditStaff = (member: StaffMember) => {
    alert(`Edit ${member.fullName} - Form would open here`);
    // In real app, open modal/form with staff data
  };

  const handleDeleteStaff = (member: StaffMember) => {
    if (confirm(`Are you sure you want to remove ${member.fullName}?`)) {
      setStaff(staff.filter((s) => s.id !== member.id));
    }
  };

  const handleToggleStatus = (member: StaffMember) => {
    const newStatus = member.employmentStatus === 'active' ? 'suspended' : 'active';
    setStaff(
      staff.map((s) =>
        s.id === member.id ? { ...s, employmentStatus: newStatus } : s
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="size-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold">Staff Management</h1>
              <p className="text-gray-600">Manage clinic staff and view performance</p>
            </div>
          </div>

          <Button onClick={handleAddStaff}>
            <Plus className="size-4 mr-2" />
            Add Staff Member
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">{staff.length}</p>
              </div>
              <Users className="size-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {staff.filter((s) => s.employmentStatus === 'active').length}
                </p>
              </div>
              <UserCheck className="size-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Doctors</p>
                <p className="text-2xl font-bold text-blue-600">
                  {staff.filter((s) => s.role === 'doctor').length}
                </p>
              </div>
              <Award className="size-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {(
                    staff.reduce((sum, s) => sum + s.stats.avgRating, 0) / staff.length
                  ).toFixed(1)}
                  ⭐
                </p>
              </div>
              <TrendingUp className="size-8 text-yellow-600" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 size-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="hygienist">Hygienist</SelectItem>
                <SelectItem value="assistant">Assistant</SelectItem>
                <SelectItem value="front_desk">Front Desk</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Staff List */}
        <div className="space-y-4">
          {filteredStaff.map((member) => (
            <Card key={member.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                {/* Staff Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {member.fullName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{member.fullName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getRoleBadgeColor(member.role)}>
                          {getRoleLabel(member.role)}
                        </Badge>
                        <Badge className={getStatusBadgeColor(member.employmentStatus)}>
                          {member.employmentStatus.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="size-4" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="size-4" />
                      <span>{member.phone}</span>
                    </div>
                    {member.specialization && (
                      <div className="flex items-center gap-2">
                        <Award className="size-4" />
                        <span>{member.specialization}</span>
                      </div>
                    )}
                    {member.licenseNumber && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">License:</span>
                        <span>{member.licenseNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4" />
                      <span>Hired: {new Date(member.hireDate).toLocaleDateString()}</span>
                    </div>
                    {member.licenseExpiry && (
                      <div className="flex items-center gap-2">
                        <Clock className="size-4" />
                        <span>License expires: {new Date(member.licenseExpiry).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Performance Stats */}
                  {member.role === 'doctor' || member.role === 'hygienist' ? (
                    <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Patients Served</p>
                        <p className="text-lg font-semibold">{member.stats.patientsServed}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Procedures</p>
                        <p className="text-lg font-semibold">{member.stats.completedProcedures}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Rating</p>
                        <p className="text-lg font-semibold">{member.stats.avgRating} ⭐</p>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditStaff(member)}
                  >
                    <Edit className="size-4 mr-2" />
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(member)}
                    className={
                      member.employmentStatus === 'active'
                        ? 'text-yellow-600 hover:text-yellow-700'
                        : 'text-green-600 hover:text-green-700'
                    }
                  >
                    {member.employmentStatus === 'active' ? (
                      <>
                        <UserX className="size-4 mr-2" />
                        Suspend
                      </>
                    ) : (
                      <>
                        <UserCheck className="size-4 mr-2" />
                        Activate
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteStaff(member)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="size-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <Card className="p-12 text-center">
            <Users className="size-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No staff members found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </Card>
        )}
      </div>
    </div>
  );
}
