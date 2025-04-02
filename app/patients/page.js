'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, UserPlus, Plus, X } from 'lucide-react';
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

const ANTECEDENT_CATEGORIES = {
  maladies_chroniques: "Maladies chroniques",
  allergies: "Allergies",
  chirurgies: "Chirurgies",
  hospitalisations: "Hospitalisations",
  traitements_passes: "Traitements passés",
  antecedents_familiaux: "Antécédents familiaux",
  vaccinations: "Vaccinations"
};

const TREATMENT_CATEGORIES = {
  medicaments: "Médicaments",
  therapies: "Thérapies",
  dispositifs_medicaux: "Dispositifs médicaux",
  reeducation: "Rééducation",
  dialyse: "Dialyse",
  nutrition: "Nutrition",
  autres: "Autres traitements"
};

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
    antecedents: [
      { categorie: "maladies_chroniques", details: "Hypertension" },
      { categorie: "maladies_chroniques", details: "Diabète type 2" }
    ],
    traitements: [
      { categorie: "medicaments", details: "Insuline", posologie: "2x/jour" },
      { categorie: "medicaments", details: "Antihypertenseurs", posologie: "1x/jour" }
    ]
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
    antecedents: [
      { categorie: "maladies_chroniques", details: "Insuffisance cardiaque" }
    ],
    traitements: [
      { categorie: "medicaments", details: "Diurétiques", posologie: "1x/jour" },
      { categorie: "medicaments", details: "Bêtabloquants", posologie: "2x/jour" }
    ]
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
    antecedents: [
      { categorie: "maladies_chroniques", details: "Anémie chronique" }
    ],
    traitements: [
      { categorie: "medicaments", details: "Fer injectable", posologie: "1x/semaine" },
      { categorie: "medicaments", details: "EPO", posologie: "3x/semaine" }
    ]
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
    antecedents: [],
    traitements: []
  });
  const [nouvelAntecedent, setNouvelAntecedent] = useState({
    categorie: '',
    details: ''
  });
  const [nouveauTraitement, setNouveauTraitement] = useState({
    categorie: '',
    details: '',
    posologie: ''
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
      antecedents: [],
      traitements: []
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

  const ajouterAntecedent = () => {
    if (!nouvelAntecedent.categorie || !nouvelAntecedent.details) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une catégorie et saisir les détails",
        variant: "destructive"
      });
      return;
    }

    setNewPatient({
      ...newPatient,
      antecedents: [...newPatient.antecedents, { ...nouvelAntecedent }]
    });
    setNouvelAntecedent({ categorie: '', details: '' });
  };

  const supprimerAntecedent = (index) => {
    const nouveauxAntecedents = newPatient.antecedents.filter((_, i) => i !== index);
    setNewPatient({
      ...newPatient,
      antecedents: nouveauxAntecedents
    });
  };

  const ajouterTraitement = () => {
    if (!nouveauTraitement.categorie || !nouveauTraitement.details || !nouveauTraitement.posologie) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs du traitement",
        variant: "destructive"
      });
      return;
    }

    setNewPatient({
      ...newPatient,
      traitements: [...newPatient.traitements, { ...nouveauTraitement }]
    });
    setNouveauTraitement({ categorie: '', details: '', posologie: '' });
  };

  const supprimerTraitement = (index) => {
    const nouveauxTraitements = newPatient.traitements.filter((_, i) => i !== index);
    setNewPatient({
      ...newPatient,
      traitements: nouveauxTraitements
    });
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="sticky top-0 bg-background pt-6 pb-4 z-10">
              <DialogTitle>Ajouter un nouveau patient</DialogTitle>
              <DialogDescription>
                Remplissez les informations du patient
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4 px-1">
              <div className="space-y-2">
                <Label htmlFor="nom" className="font-medium">Nom*</Label>
                <Input
                  id="nom"
                  value={newPatient.nom}
                  onChange={(e) => setNewPatient({...newPatient, nom: e.target.value})}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom" className="font-medium">Prénom*</Label>
                <Input
                  id="prenom"
                  value={newPatient.prenom}
                  onChange={(e) => setNewPatient({...newPatient, prenom: e.target.value})}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateNaissance" className="font-medium">Date de naissance*</Label>
                <Input
                  id="dateNaissance"
                  type="date"
                  value={newPatient.dateNaissance}
                  onChange={(e) => setNewPatient({...newPatient, dateNaissance: e.target.value})}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sexe" className="font-medium">Sexe*</Label>
                <select
                  id="sexe"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  value={newPatient.sexe}
                  onChange={(e) => setNewPatient({...newPatient, sexe: e.target.value})}
                >
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="adresse" className="font-medium">Adresse</Label>
                <Input
                  id="adresse"
                  value={newPatient.adresse}
                  onChange={(e) => setNewPatient({...newPatient, adresse: e.target.value})}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone" className="font-medium">Téléphone</Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={newPatient.telephone}
                  onChange={(e) => setNewPatient({...newPatient, telephone: e.target.value})}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numeroSecu" className="font-medium">Numéro de Sécurité Sociale*</Label>
                <Input
                  id="numeroSecu"
                  value={newPatient.numeroSecu}
                  onChange={(e) => setNewPatient({...newPatient, numeroSecu: e.target.value})}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medecinReferent" className="font-medium">Médecin Référent</Label>
                <Input
                  id="medecinReferent"
                  value={newPatient.medecinReferent}
                  onChange={(e) => setNewPatient({...newPatient, medecinReferent: e.target.value})}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stade" className="font-medium">Stade MRC*</Label>
                <Input
                  id="stade"
                  type="number"
                  min="1"
                  max="5"
                  value={newPatient.stade}
                  onChange={(e) => setNewPatient({...newPatient, stade: e.target.value})}
                  className="w-full"
                />
              </div>
              <div className="space-y-4 col-span-2">
                <Label className="font-medium">Antécédents Médicaux</Label>
                <div className="space-y-4">
                  {newPatient.antecedents.map((antecedent, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                      <div className="flex-1">
                        <p className="font-medium">{ANTECEDENT_CATEGORIES[antecedent.categorie]}</p>
                        <p className="text-sm text-gray-600">{antecedent.details}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => supprimerAntecedent(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <select
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        value={nouvelAntecedent.categorie}
                        onChange={(e) => setNouvelAntecedent({...nouvelAntecedent, categorie: e.target.value})}
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {Object.entries(ANTECEDENT_CATEGORIES).map(([key, value]) => (
                          <option key={key} value={key}>{value}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Détails"
                        value={nouvelAntecedent.details}
                        onChange={(e) => setNouvelAntecedent({...nouvelAntecedent, details: e.target.value})}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={ajouterAntecedent}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 col-span-2">
                <Label className="font-medium">Traitements en cours</Label>
                <div className="space-y-4">
                  {newPatient.traitements.map((traitement, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                      <div className="flex-1">
                        <p className="font-medium">{TREATMENT_CATEGORIES[traitement.categorie]}</p>
                        <p className="text-sm text-gray-600">
                          {traitement.details}
                          <span className="ml-2 text-blue-600">({traitement.posologie})</span>
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => supprimerTraitement(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <select
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        value={nouveauTraitement.categorie}
                        onChange={(e) => setNouveauTraitement({...nouveauTraitement, categorie: e.target.value})}
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {Object.entries(TREATMENT_CATEGORIES).map(([key, value]) => (
                          <option key={key} value={key}>{value}</option>
                        ))}
                      </select>
                    </div>
                    <Input
                      placeholder="Nom du traitement"
                      value={nouveauTraitement.details}
                      onChange={(e) => setNouveauTraitement({...nouveauTraitement, details: e.target.value})}
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Posologie"
                        value={nouveauTraitement.posologie}
                        onChange={(e) => setNouveauTraitement({...nouveauTraitement, posologie: e.target.value})}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={ajouterTraitement}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-2 sticky bottom-0 bg-background pt-4 pb-6">
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