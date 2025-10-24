/**
 * Notification Center Component
 * Displays staff notifications and task queue
 */

import { useState } from 'react';
import { Bell, CheckCircle2, Clock, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export interface Notification {
  id: string;
  recipientRole: 'doctor' | 'front_desk' | 'clinic_owner' | 'branch_owner' | 'walking_doctor';
  type: 'exam-complete' | 'high-value-plan' | 'urgent-scheduling' | 'payment-due' | 'appointment-reminder';
  priority: 'urgent' | 'high' | 'normal' | 'low';
  title: string;
  message: string;
  actionRequired: string;
  actionUrl: string;
  relatedEntity: {
    type: 'exam' | 'treatment-plan' | 'appointment' | 'patient';
    id: string;
    name?: string;
  };
  createdAt: Date;
  readAt?: Date;
  completedAt?: Date;
}

interface NotificationCenterProps {
  role: 'doctor' | 'front_desk' | 'clinic_owner' | 'branch_owner' | 'walking_doctor';
}

// Mock notifications - in real app, fetch from backend
const mockNotifications: Notification[] = [
  {
    id: '1',
    recipientRole: 'front_desk',
    type: 'exam-complete',
    priority: 'urgent',
    title: 'Urgent Checkout Required',
    message: 'Patient Ahmad Rizki requires immediate scheduling for root canal',
    actionRequired: 'Schedule within 24 hours',
    actionUrl: '/checkout/patient-123',
    relatedEntity: {
      type: 'patient',
      id: 'patient-123',
      name: 'Ahmad Rizki'
    },
    createdAt: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
  },
  {
    id: '2',
    recipientRole: 'front_desk',
    type: 'high-value-plan',
    priority: 'high',
    title: 'High-Value Treatment Plan',
    message: 'Treatment plan for Siti Nurhaliza (Rp 15,000,000) ready for consultation',
    actionRequired: 'Detailed consultation required',
    actionUrl: '/checkout/patient-456',
    relatedEntity: {
      type: 'treatment-plan',
      id: 'plan-789',
      name: 'Siti Nurhaliza'
    },
    createdAt: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
  },
  {
    id: '3',
    recipientRole: 'front_desk',
    type: 'exam-complete',
    priority: 'normal',
    title: 'Standard Checkout',
    message: 'Patient Budi Santoso ready for checkout',
    actionRequired: 'Process payment and schedule follow-up',
    actionUrl: '/checkout/patient-789',
    relatedEntity: {
      type: 'patient',
      id: 'patient-789',
      name: 'Budi Santoso'
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    readAt: new Date(Date.now() - 25 * 60 * 1000)
  }
];

export function NotificationCenter({ role }: NotificationCenterProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(
    mockNotifications.filter(n => n.recipientRole === role)
  );
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.readAt).length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.completedAt).length;

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, readAt: new Date() } : n
      )
    );

    // Navigate to action URL
    navigate(notification.actionUrl);
    setIsOpen(false);
  };

  const handleMarkComplete = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, completedAt: new Date() } : n
      )
    );
  };

  const handleDismiss = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="size-4 text-red-600" />;
      case 'high':
        return <AlertTriangle className="size-4 text-yellow-600" />;
      default:
        return <Clock className="size-4 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-50 border-red-200';
      case 'high':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <Badge
            variant={urgentCount > 0 ? 'destructive' : 'default'}
            className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <Card className="absolute right-0 top-12 z-50 w-96 max-h-[600px] overflow-hidden shadow-lg">
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                <Badge variant="outline">{unreadCount} unread</Badge>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[500px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="size-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications
                    .filter(n => !n.completedAt)
                    .sort((a, b) => {
                      // Sort by priority first, then by time
                      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
                      const priorityDiff =
                        priorityOrder[a.priority] - priorityOrder[b.priority];
                      if (priorityDiff !== 0) return priorityDiff;
                      return b.createdAt.getTime() - a.createdAt.getTime();
                    })
                    .map(notification => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`
                          p-4 cursor-pointer transition-colors hover:bg-gray-50
                          ${getPriorityColor(notification.priority)}
                          ${!notification.readAt ? 'font-medium' : ''}
                        `}
                      >
                        <div className="flex items-start gap-3">
                          {getPriorityIcon(notification.priority)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-semibold truncate">
                                {notification.title}
                              </h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleDismiss(notification.id, e)}
                                className="h-6 w-6 p-0 hover:bg-gray-200"
                              >
                                <X className="size-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) =>
                                  handleMarkComplete(notification.id, e)
                                }
                                className="h-6 text-xs"
                              >
                                <CheckCircle2 className="size-3 mr-1" />
                                Complete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* Completed notifications */}
                  {notifications.filter(n => n.completedAt).length > 0 && (
                    <>
                      <div className="p-3 bg-gray-50 text-xs font-semibold text-gray-600">
                        Completed
                      </div>
                      {notifications
                        .filter(n => n.completedAt)
                        .map(notification => (
                          <div
                            key={notification.id}
                            className="p-4 bg-gray-50 opacity-60"
                          >
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="size-4 text-green-600" />
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold line-through">
                                  {notification.title}
                                </h4>
                                <p className="text-xs text-gray-600">
                                  Completed{' '}
                                  {formatTimeAgo(notification.completedAt!)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t bg-gray-50 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setNotifications([]);
                    setIsOpen(false);
                  }}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
