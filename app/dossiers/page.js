'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, FileText } from 'lucide-react';

const mockDossiers = [
  { id: 1, patient: "Dubois Marie", dateCreation: "15/03/2023", derniereMaj: "12/01/2024", status: "En cours" },
  { id: 2, patient: "Martin Jean", dateCreation: "22/07/2023", derniereMaj: "05/01/2024", status: "Urgent" },
  { id: 3, patient: "Bernard Sophie", dateCreation: "30/11/2023", derniereMaj: "15/01/2024", status: "Stable" },
];

export default function DossiersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patient');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dossiers, setDossiers] = useState(mockDossiers);

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = mockDossiers.filter(dossier => 
      dossier.patient.toLowerCase().includes(value.toLowerCase())
    );
    setDossiers(filtered);
  };

  const handleConsult = (dossierId) => {
    router.push(`/dossiers/${dossierId}`);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dossiers Médicaux</h1>
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
                      <FileText className="h-4 w-4 mr-2" />
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