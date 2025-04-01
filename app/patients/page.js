'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, UserPlus } from 'lucide-react';
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
import { useToast } from "@/hooks/use-toast";

const mockPatients = [
  { 
    id: 1, 
    nom: "Dubois", 
    prenom: "Marie", 
    dateNaissance: "1965-03-15", 
    sexe: "F",
    adresse: "123 Rue de Paris, 75001 Paris",
    telephone: "0123456789",
    numeroSecu: "165037512345678",
    medecinReferent: "Dr. Martin",
    stade: "3", 
    dernierRDV: "12/01/2024",
    antecedents: "Hypertension, Diabète type 2",
    traitements: "Insuline, Antihypertenseurs"
  },
  { 
    id: 2, 
    nom: "Martin", 
    prenom: "Jean", 
    dateNaissance: "1958-07-22", 
    sexe: "M",
    adresse: "45 Avenue Victor Hugo, 69002 Lyon",
    telephone: "0234567890",
    numeroSecu: "158067523456789",
    medecinReferent: "Dr. Bernard",
    stade: "4", 
    dernierRDV: "05/01/2024",
    antecedents: "Insuffisance cardiaque",
    traitements: "Diurétiques, Bêtabloquants"
  },
  { 
    id: 3, 
    nom: "Bernard", 
    prenom: "Sophie", 
    dateNaissance: "1972-11-30", 
    sexe: "F",
    adresse: "8 Rue du Commerce, 44000 Nantes",
    telephone: "0345678901",
    numeroSecu: "272117534567890",
    medecinReferent: "Dr. Dubois",
    stade: "3", 
    dernierRDV: "15/01/2024",
    antecedents: "Anémie chronique",
    traitements: "Fer injectable, EPO"
  }
];

export default function PatientsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState(mockPatients);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: '',
    adresse: '',
    telephone: '',
    numeroSecu: '',
    medecinReferent: '',
    stade: '',
    antecedents: '',
    traitements: ''
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = mockPatients.filter(patient => 
      patient.nom.toLowerCase().includes(value.toLowerCase()) ||
      patient.prenom.toLowerCase().includes(value.toLowerCase()) ||
      patient.numeroSecu.includes(value)
    );
    setPatients(filtered);
  };

  const handleNewPatient = () => {
    // Validation basique
    if (!newPatient.nom || !newPatient.prenom || !newPatient.dateNaissance || !newPatient.numeroSecu) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const newId = patients.length + 1;
    const patient = {
      id: newId,
      ...newPatient,
      dernierRDV: new Date().toLocaleDateString('fr-FR')
    };
    setPatients([...patients, patient]);
    setNewPatient({
      nom: '',
      prenom: '',
      dateNaissance: '',
      sexe: '',
      adresse: '',
      telephone: '',
      numeroSecu: '',
      medecinReferent: '',
      stade: '',
      antecedents: '',
      traitements: ''
    });
    setDialogOpen(false);
    toast({
      title: "Patient ajouté",
      description: "Le nouveau patient a été enregistré avec succès"
    });
  };

  const handleViewDossier = (patientId) => {
    router.push(`/dossiers?patient=${patientId}`);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Patients</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Nouveau Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau patient</DialogTitle>
              <DialogDescription>
                Remplissez les informations du patient
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom*</Label>
                <Input
                  id="nom"
                  value={newPatient.nom}
                  onChange={(e) => setNewPatient({...newPatient, nom: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom*</Label>
                <Input
                  id="prenom"
                  value={newPatient.prenom}
                  onChange={(e) => setNewPatient({...newPatient, prenom: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateNaissance">Date de naissance*</Label>
                <Input
                  id="dateNaissance"
                  type="date"
                  value={newPatient.dateNaissance}
                  onChange={(e) => setNewPatient({...newPatient, dateNaissance: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sexe">Sexe*</Label>
                <select
                  id="sexe"
                  className="w-full p-2 border rounded"
                  value={newPatient.sexe}
                  onChange={(e) => setNewPatient({...newPatient, sexe: e.target.value})}
                >
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  id="adresse"
                  value={newPatient.adresse}
                  onChange={(e) => setNewPatient({...newPatient, adresse: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={newPatient.telephone}
                  onChange={(e) => setNewPatient({...newPatient, telephone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numeroSecu">Numéro de Sécurité Sociale*</Label>
                <Input
                  id="numeroSecu"
                  value={newPatient.numeroSecu}
                  onChange={(e) => setNewPatient({...newPatient, numeroSecu: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medecinReferent">Médecin Référent</Label>
                <Input
                  id="medecinReferent"
                  value={newPatient.medecinReferent}
                  onChange={(e) => setNewPatient({...newPatient, medecinReferent: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stade">Stade MRC*</Label>
                <Input
                  id="stade"
                  type="number"
                  min="1"
                  max="5"
                  value={newPatient.stade}
                  onChange={(e) => setNewPatient({...newPatient, stade: e.target.value})}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="antecedents">Antécédents Médicaux</Label>
                <Textarea
                  id="antecedents"
                  value={newPatient.antecedents}
                  onChange={(e) => setNewPatient({...newPatient, antecedents: e.target.value})}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="traitements">Traitements en cours</Label>
                <Textarea
                  id="traitements"
                  value={newPatient.traitements}
                  onChange={(e) => setNewPatient({...newPatient, traitements: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground mb-4">* Champs obligatoires</p>
                <Button className="w-full" onClick={handleNewPatient}>
                  Ajouter le patient
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un patient (nom, prénom ou n° sécu)..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Date de Naissance</TableHead>
                <TableHead>N° Sécu</TableHead>
                <TableHead>Stade MRC</TableHead>
                <TableHead>Dernier RDV</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.nom}</TableCell>
                  <TableCell>{patient.prenom}</TableCell>
                  <TableCell>{new Date(patient.dateNaissance).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{patient.numeroSecu}</TableCell>
                  <TableCell>{patient.stade}</TableCell>
                  <TableCell>{patient.dernierRDV}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDossier(patient.id)}
                    >
                      Voir Dossier
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