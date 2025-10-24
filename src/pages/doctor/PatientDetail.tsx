import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, User, Heart, FileText, Shield, Pill } from 'lucide-react';

export function PatientDetail() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');

  // Mock patient data - replace with real data from API
  const patient = {
    id: patientId || 'P001',
    name: 'John Doe',
    dateOfBirth: '1985-06-15',
    age: 38,
    gender: 'Male',
    phone: '(555) 123-4567',
    email: 'john.doe@example.com',
    address: '123 Main St, Anytown, CA 12345',
    preferredDentist: 'Dr. Smith',
    communicationPreference: 'Email',
    lastVisit: '10/05/2023',
    nextAppointment: '10/08/2023',
    insurance: {
      provider: 'DentalCare Plus',
      policyNumber: 'DC-12345678',
      paymentStatus: 'Current'
    },
    medicalAlerts: [
      { type: 'allergy', text: 'Allergies: Penicillin', severity: 'high' },
      { type: 'condition', text: 'Medical History: Hypertension', severity: 'medium' }
    ],
    dentalHistory: [
      {
        date: '10/05/2023',
        procedure: 'Routine Cleaning',
        doctor: 'Dr. Smith',
        notes: 'No issues found. Good oral hygiene.',
        cost: 150
      },
      {
        date: '07/12/2023',
        procedure: 'Filling - Tooth #14',
        doctor: 'Dr. Smith',
        notes: 'Composite filling placed on occlusal surface.',
        cost: 320
      },
      {
        date: '03/22/2023',
        procedure: 'X-Ray',
        doctor: 'Dr. Smith',
        notes: 'Full mouth series completed.',
        cost: 180
      }
    ],
    medicalHistory: {
      conditions: ['Hypertension'],
      medications: ['Lisinopril 10mg daily'],
      allergies: ['Penicillin'],
      surgeries: ['Appendectomy (2005)'],
      familyHistory: ['Father: Heart disease', 'Mother: Diabetes']
    },
    documents: [
      { id: 1, name: 'Consent Form', type: 'PDF', date: '10/05/2023' },
      { id: 2, name: 'X-Ray Results', type: 'Image', date: '03/22/2023' },
      { id: 3, name: 'Treatment Plan', type: 'PDF', date: '07/12/2023' }
    ]
  };

  return (
    <DashboardLayout role="doctor">
      <div className="p-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/doctor/patients')}
          className="mb-4"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Patients
        </Button>

        {/* Patient Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="size-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">{patient.name}</h1>
                <div className="flex items-center gap-4 text-blue-100">
                  <span>ID: {patient.id}</span>
                  <span>•</span>
                  <span>{patient.age} years old</span>
                  <span>•</span>
                  <span>{patient.gender}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="secondary"
                onClick={() => navigate(`/doctor/exam/${patient.id}`)}
              >
                Start Exam
              </Button>
              <Button variant="secondary">
                Schedule Appointment
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v)}>
          <TabsList className="mb-6">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="medical">Medical History</TabsTrigger>
            <TabsTrigger value="dental">Dental History</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="size-5" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Phone:</p>
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="size-4" />
                      {patient.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email:</p>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="size-4" />
                      {patient.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address:</p>
                    <p className="font-medium flex items-center gap-2">
                      <MapPin className="size-4" />
                      {patient.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Preferred Dentist:</p>
                    <p className="font-medium">{patient.preferredDentist}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Communication Preference:</p>
                    <p className="font-medium">{patient.communicationPreference}</p>
                  </div>
                </div>
              </Card>

              {/* Insurance Details */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="size-5" />
                  Insurance Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Provider:</p>
                    <p className="font-medium">{patient.insurance.provider}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Policy Number:</p>
                    <p className="font-medium">{patient.insurance.policyNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status:</p>
                    <Badge className="bg-green-100 text-green-700">
                      {patient.insurance.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Medical Alerts */}
              <Card className="p-6 md:col-span-2">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Heart className="size-5" />
                  Medical Alerts
                </h3>
                <div className="space-y-2">
                  {patient.medicalAlerts.map((alert, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-lg ${
                        alert.severity === 'high' 
                          ? 'bg-red-50 border border-red-200' 
                          : 'bg-amber-50 border border-amber-200'
                      }`}
                    >
                      <Badge className={alert.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}>
                        {alert.type.toUpperCase()}
                      </Badge>
                      <p className={`mt-2 ${alert.severity === 'high' ? 'text-red-800' : 'text-amber-800'}`}>
                        {alert.text}
                      </p>
                    </div>
                  ))}
                  <Button variant="link" className="text-blue-600">
                    Manage
                  </Button>
                </div>
              </Card>

              {/* Appointment Information */}
              <Card className="p-6 md:col-span-2">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="size-5" />
                  Appointment Information
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Last Visit:</p>
                    <p className="text-2xl font-bold text-gray-900">{patient.lastVisit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Next Appointment:</p>
                    <p className="text-2xl font-bold text-blue-600">{patient.nextAppointment}</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Medical History Tab */}
          <TabsContent value="medical">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Heart className="size-5" />
                  Medical Conditions
                </h3>
                <ul className="space-y-2">
                  {patient.medicalHistory.conditions.map((condition, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="size-2 bg-blue-600 rounded-full"></span>
                      {condition}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Pill className="size-5" />
                  Current Medications
                </h3>
                <ul className="space-y-2">
                  {patient.medicalHistory.medications.map((med, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="size-2 bg-purple-600 rounded-full"></span>
                      {med}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Allergies</h3>
                <ul className="space-y-2">
                  {patient.medicalHistory.allergies.map((allergy, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-red-700">
                      <span className="size-2 bg-red-600 rounded-full"></span>
                      {allergy}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Previous Surgeries</h3>
                <ul className="space-y-2">
                  {patient.medicalHistory.surgeries.map((surgery, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="size-2 bg-gray-600 rounded-full"></span>
                      {surgery}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6 md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Family Medical History</h3>
                <ul className="space-y-2">
                  {patient.medicalHistory.familyHistory.map((history, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="size-2 bg-teal-600 rounded-full"></span>
                      {history}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </TabsContent>

          {/* Dental History Tab */}
          <TabsContent value="dental">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Treatment History</h3>
              <div className="space-y-4">
                {patient.dentalHistory.map((treatment, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{treatment.procedure}</h4>
                        <p className="text-sm text-gray-600">Dr. {treatment.doctor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{treatment.date}</p>
                        <p className="font-semibold text-gray-900">
                          ${treatment.cost.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {treatment.notes && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {treatment.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Insurance Tab */}
          <TabsContent value="insurance">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Insurance Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Provider</p>
                    <p className="font-semibold text-lg">{patient.insurance.provider}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Policy Number</p>
                    <p className="font-semibold text-lg">{patient.insurance.policyNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <Badge className="bg-green-100 text-green-700 mt-1">
                      {patient.insurance.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Patient Documents</h3>
              <div className="space-y-3">
                {patient.documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="size-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-600">{doc.type} • {doc.date}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
