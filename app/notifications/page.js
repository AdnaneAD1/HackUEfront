'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"

const mockNotifications = [
  {
    id: 1,
    type: 'urgent',
    title: 'Résultats Critiques',
    message: 'Résultats d\'analyse critiques pour le patient Dubois Marie',
    date: '15/01/2024 14:30',
    read: false
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Rappel de Rendez-vous',
    message: 'Rendez-vous de suivi avec M. Martin Jean demain à 10h00',
    date: '15/01/2024 09:15',
    read: true
  },
  {
    id: 3,
    type: 'info',
    title: 'Mise à Jour Dossier',
    message: 'Nouveaux documents ajoutés au dossier de Mme Bernard Sophie',
    date: '14/01/2024 16:45',
    read: false
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const { toast } = useToast();

  const getIcon = (type) => {
    switch (type) {
      case 'urgent':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'info':
        return <Bell className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
    toast({
      title: "Notification marquée comme lue",
      description: "La notification a été mise à jour",
    });
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    toast({
      title: "Toutes les notifications ont été marquées comme lues",
      description: "Votre liste de notifications a été mise à jour",
    });
  };

  const handleNotificationClick = (notification) => {
    switch (notification.type) {
      case 'urgent':
        window.location.href = '/dossiers';
        break;
      case 'reminder':
        alert('Ouverture du calendrier de rendez-vous');
        break;
      case 'info':
        window.location.href = '/dossiers';
        break;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button variant="outline" onClick={markAllAsRead}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Tout marquer comme lu
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`${notification.read ? 'opacity-75' : ''} hover:shadow-md transition-shadow cursor-pointer`}
            onClick={() => handleNotificationClick(notification)}
          >
            <CardContent className="flex items-start p-6">
              <div className="mr-4 mt-1">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{notification.title}</h3>
                  <span className="text-sm text-gray-500">{notification.date}</span>
                </div>
                <p className="mt-1 text-gray-600">{notification.message}</p>
              </div>
              {!notification.read && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(notification.id);
                  }}
                >
                  Marquer comme lu
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}