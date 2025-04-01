'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Bell, Shield, Palette } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"

export default function ParametresPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    desktop: true,
    urgent: true
  });

  const [userInfo, setUserInfo] = useState({
    name: 'Dr. Jean Dupont',
    email: 'jean.dupont@hopital.fr',
    specialite: 'Néphrologie'
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [theme, setTheme] = useState('light');

  const handleSaveProfile = () => {
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été sauvegardées avec succès",
    });
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }
    if (passwords.new.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Mot de passe modifié",
      description: "Votre mot de passe a été mis à jour avec succès",
    });
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    toast({
      title: "Thème modifié",
      description: `Le thème ${newTheme} a été appliqué`,
    });
  };

  const handleNotificationChange = (type, checked) => {
    setNotifications(prev => ({ ...prev, [type]: checked }));
    toast({
      title: "Préférences de notifications mises à jour",
      description: `Les notifications ${type} ont été ${checked ? 'activées' : 'désactivées'}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">Gérez vos préférences et paramètres de compte</p>
      </div>

      <Tabs defaultValue="compte" className="space-y-4">
        <TabsList>
          <TabsTrigger value="compte" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Compte
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="securite">
            <Shield className="mr-2 h-4 w-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="apparence">
            <Palette className="mr-2 h-4 w-4" />
            Apparence
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compte">
          <Card>
            <CardHeader>
              <CardTitle>Informations du Compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input 
                  id="name" 
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialite">Spécialité</Label>
                <Input 
                  id="specialite" 
                  value={userInfo.specialite}
                  onChange={(e) => setUserInfo({...userInfo, specialite: e.target.value})}
                />
              </div>
              <Button onClick={handleSaveProfile}>Sauvegarder les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir les notifications par email
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications bureau</Label>
                  <p className="text-sm text-muted-foreground">
                    Afficher les notifications sur le bureau
                  </p>
                </div>
                <Switch
                  checked={notifications.desktop}
                  onCheckedChange={(checked) => handleNotificationChange('desktop', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertes urgentes</Label>
                
                  <p className="text-sm text-muted-foreground">
                    Notifications pour les cas urgents
                  </p>
                </div>
                <Switch
                  checked={notifications.urgent}
                  onCheckedChange={(checked) => handleNotificationChange('urgent', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="securite">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité du Compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input 
                  id="current-password" 
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input 
                  id="new-password" 
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input 
                  id="confirm-password" 
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                />
              </div>
              <Button onClick={handlePasswordChange}>Changer le mot de passe</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apparence">
          <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Thème</Label>
                <div className="flex space-x-2">
                  <Button 
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => handleThemeChange('light')}
                  >
                    Clair
                  </Button>
                  <Button 
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => handleThemeChange('dark')}
                  >
                    Sombre
                  </Button>
                  <Button 
                    variant={theme === 'system' ? 'default' : 'outline'}
                    onClick={() => handleThemeChange('system')}
                  >
                    Système
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}