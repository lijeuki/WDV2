import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Odontogram from '@/components/organisms/Odontogram';
import { CheckCircle2, Printer, ArrowRight, CreditCard } from 'lucide-react';

type CheckoutStep = 'review' | 'payment' | 'schedule' | 'complete';

export default function PostExamCheckout() {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const location = useLocation();
  const treatmentPlan = location.state?.treatmentPlan;
  const examData = location.state?.examData;

  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('review');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'insurance' | 'split'>('cash');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [appointmentDate, setAppointmentDate] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const todayCharge = 500000; // Exam fee
  const totalBalance = treatmentPlan?.patientPortion || 0;

  const handlePayment = () => {
    console.log('Processing payment:', { paymentMethod, paymentAmount });
    setCheckoutStep('schedule');
  };

  const handleSchedule = () => {
    console.log('Scheduling appointment:', appointmentDate);
    setCheckoutStep('complete');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Post-Exam Checkout</h1>
          <p className="text-gray-600">Patient ID: {patientId}</p>
        </div>

        {/* Progress */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            {(['review', 'payment', 'schedule', 'complete'] as CheckoutStep[]).map((step, index) => (
              <React.Fragment key={step}>
                <div className={`flex items-center gap-2 ${
                  checkoutStep === step ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-bold
                    ${checkoutStep === step ? 'bg-blue-500 text-white' : 'bg-gray-200'}
                  `}>
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium hidden md:block capitalize">{step}</span>
                </div>
                {index < 3 && <div className="flex-1 h-1 mx-2 bg-gray-200" />}
              </React.Fragment>
            ))}
          </div>
        </Card>

        {/* Step 1: Review Treatment Plan */}
        {checkoutStep === 'review' && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Treatment Plan Review</h2>
            
            {/* Odontogram */}
            {examData?.odontogramData && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Examination Findings</h3>
                <Odontogram data={examData.odontogramData} readOnly />
              </div>
            )}

            {/* Procedures */}
            {treatmentPlan?.procedures && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Recommended Procedures</h3>
                <div className="space-y-3">
                  {treatmentPlan.procedures.map((proc: any, index: number) => (
                    <div key={proc.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge>#{index + 1}</Badge>
                            {proc.toothNumber && <Badge variant="outline">Tooth {proc.toothNumber}</Badge>}
                            <Badge variant={proc.priority === 'urgent' ? 'destructive' : 'secondary'}>
                              {proc.priority}
                            </Badge>
                          </div>
                          <h4 className="font-semibold">{proc.procedureName}</h4>
                          <p className="text-sm text-gray-600">{proc.procedureCode}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(proc.estimatedCost)}</div>
                          <div className="text-sm text-gray-600">{proc.estimatedDuration} min</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cost Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Cost Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Today's Exam:</span>
                  <span className="font-medium">{formatCurrency(todayCharge)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Treatment Plan Total:</span>
                  <span className="font-medium">{formatCurrency(treatmentPlan?.totalCost || 0)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Est. Insurance Coverage:</span>
                  <span>-{formatCurrency(treatmentPlan?.estimatedInsurance || 0)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Patient Portion:</span>
                  <span>{formatCurrency(treatmentPlan?.patientPortion || 0)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="size-4 mr-2" />
                Print Plan
              </Button>
              <Button onClick={() => setCheckoutStep('payment')}>
                Continue to Payment
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Payment */}
        {checkoutStep === 'payment' && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Payment for Today's Visit</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-blue-800">Today's Charge</div>
                  <div className="text-2xl font-bold text-blue-900">{formatCurrency(todayCharge)}</div>
                </div>
                <CreditCard className="size-12 text-blue-600" />
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Payment Method</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['cash', 'card', 'insurance', 'split'] as const).map(method => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`
                      p-4 border-2 rounded-lg transition-all capitalize
                      ${paymentMethod === method 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'}
                    `}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Payment Amount</label>
              <Input
                type="number"
                value={paymentAmount || todayCharge}
                onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
                placeholder="Enter amount"
              />
            </div>

            {/* Optional: Deposit for Treatment Plan */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">Optional: Treatment Plan Deposit</h3>
              <p className="text-sm text-gray-700 mb-3">
                Secure your appointment slots and lock in current pricing
              </p>
              <Button variant="outline" size="sm">
                Pay Deposit ({formatCurrency(totalBalance * 0.2)})
              </Button>
            </div>

            <div className="flex gap-3 justify-between">
              <Button variant="outline" onClick={() => setCheckoutStep('review')}>
                Back
              </Button>
              <Button onClick={handlePayment}>
                Process Payment
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Schedule */}
        {checkoutStep === 'schedule' && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Schedule Next Appointment</h2>
            
            {treatmentPlan?.procedures && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Next Procedure</h3>
                <div className="border rounded-lg p-4 bg-blue-50">
                  <div className="font-semibold">{treatmentPlan.procedures[0].procedureName}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Duration: {treatmentPlan.procedures[0].estimatedDuration} minutes
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select Date & Time</label>
              <Input
                type="datetime-local"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>

            <div className="flex gap-3 justify-between">
              <Button variant="outline" onClick={() => setCheckoutStep('payment')}>
                Back
              </Button>
              <Button 
                onClick={handleSchedule}
                disabled={!appointmentDate}
              >
                Confirm Appointment
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 4: Complete */}
        {checkoutStep === 'complete' && (
          <Card className="p-6 bg-emerald-50">
            <div className="text-center">
              <CheckCircle2 className="size-16 mx-auto text-emerald-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Checkout Complete!</h2>
              <p className="text-gray-600 mb-6">All tasks completed successfully</p>
              
              <div className="bg-white rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
                <h3 className="font-semibold mb-3">Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span>Payment received: {formatCurrency(todayCharge)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span>Next appointment scheduled: {appointmentDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span>Treatment plan documented</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer className="size-4 mr-2" />
                  Print Receipt
                </Button>
                <Button onClick={() => navigate('/front-desk')}>
                  Return to Dashboard
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
