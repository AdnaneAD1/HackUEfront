'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, FileText, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const mockDossiers = [
  { id: 1, patient: "Dubois Marie", dateCreation: "15/03/2023", derniereMaj: "12/01/2024", status: "En cours" },
  { id: 2, patient: "Martin Jean", dateCreation: "22/07/2023", derniereMaj: "05/01/2024", status: "Urgent" },
  { id: 3, patient: "Bernard Sophie", dateCreation: "30/11/2023", derniereMaj: "15/01/2024", status: "Stable" },
];

export default function DossiersPage() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patient');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dossiers, setDossiers] = useState(mockDossiers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDossier, setNewDossier] = useState({
    patient: '',
    notes: '',
    status: 'En cours'
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = mockDossiers.filter(dossier => 
      dossier.patient.toLowerCase().includes(value.toLowerCase())
    );
    setDossiers(filtered);
  };

  const handleNewDossier = () => {
    const newId = dossiers.length + 1;
    const dossier = {
      id: newId,
      ...newDossier,
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      derniereMaj: new Date().toLocaleDateString('fr-FR')
    };
    setDossiers([...dossiers, dossier]);
    setNewDossier({ patient: '', notes: '', status: 'En cours' });
    setDialogOpen(false);
  };

  const handleConsult = (dossierId) => {
    // This would open a detailed view of the medical record
    alert(`Consultation du dossier ${dossierId}`);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dossiers Médicaux</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Dossier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau dossier</DialogTitle>
              <DialogDescription>
                Remplissez les informations du dossier médical
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient</Label>
                <Input
                  id="patient"
                  value={newDossier.patient}
                  onChange={(e) => setNewDossier({...newDossier, patient: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newDossier.notes}
                  onChange={(e) => setNewDossier({...newDossier, notes: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <select
                  id="status"
                  className="w-full p-2 border rounded"
                  value={newDossier.status}
                  onChange={(e) => setNewDossier({...newDossier, status: e.target.value})}
                >
                  <option value="En cours">En cours</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Stable">Stable</option>
                </select>
              </div>
              <Button className="w-full" onClick={handleNewDossier}>
                Créer le dossier
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un dossier..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Dossiers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date de Création</TableHead>
                <TableHead>Dernière Mise à Jour</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dossiers.map((dossier) => (
                <TableRow key={dossier.id}>
                  <TableCell>{dossier.patient}</TableCell>
                  <TableCell>{dossier.dateCreation}</TableCell>
                  <TableCell>{dossier.derniereMaj}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      dossier.status === 'Urgent' ? 'bg-red-100 text-red-800' :
                      dossier.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {dossier.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConsult(dossier.id)}
                    >
                      Consulter
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}