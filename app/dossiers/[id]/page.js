'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Activity, Calendar, Pill as Pills, AlertCircle, Stethoscope, FlaskRound, ClipboardList } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";

// Simuler une fonction qui récupère les données du patient
const getPatientData = (id) => {
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
      ],
      visites: [
        {
          date: "12/01/2024",
          medecin: "Dr. Martin",
          motif: "Suivi trimestriel",
          examens: [
            { type: "Tension artérielle", resultat: "140/85 mmHg" },
            { type: "Poids", resultat: "72 kg" },
            { type: "Glycémie à jeun", resultat: "1.26 g/L" }
          ],
          biologie: [
            { type: "Créatinine", resultat: "150 µmol/L" },
            { type: "DFG", resultat: "45 mL/min/1.73m²" },
            { type: "Potassium", resultat: "4.2 mmol/L" }
          ],
          prescriptions: [
            { medicament: "Insuline", posologie: "Maintien 2x/jour" },
            { medicament: "Antihypertenseur", posologie: "Augmentation à 2x/jour" }
          ],
          notes: "Tension artérielle stable. Glycémie à surveiller."
        },
        {
          date: "15/10/2023",
          medecin: "Dr. Bernard",
          motif: "Contrôle routine",
          examens: [
            { type: "Tension artérielle", resultat: "135/82 mmHg" },
            { type: "Poids", resultat: "71.5 kg" }
          ],
          biologie: [
            { type: "Créatinine", resultat: "148 µmol/L" },
            { type: "DFG", resultat: "46 mL/min/1.73m²" }
          ],
          prescriptions: [
            { medicament: "Insuline", posologie: "Maintien 2x/jour" }
          ],
          notes: "Légère amélioration des paramètres rénaux"
        }
      ]
    }
  ];

  return mockPatients.find(p => p.id === parseInt(id));
};

export default function DossierDetails() {
  const params = useParams();
  const [patient, setPatient] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const [nouvelleVisite, setNouvelleVisite] = useState({
    date: new Date().toISOString().split('T')[0],
    medecin: '',
    motif: '',
    examens: [],
    biologie: [],
    prescriptions: [],
    notes: ''
  });
  const [nouvelExamen, setNouvelExamen] = useState({ type: '', resultat: '' });
  const [nouvelleBiologie, setNouvelleBiologie] = useState({ type: '', resultat: '' });
  const [nouvellePrescription, setNouvellePrescription] = useState({ medicament: '', posologie: '' });

  useEffect(() => {
    const patientData = getPatientData(params.id);
    setPatient(patientData);
  }, [params.id]);

  const ajouterExamen = () => {
    if (nouvelExamen.type && nouvelExamen.resultat) {
      setNouvelleVisite({
        ...nouvelleVisite,
        examens: [...nouvelleVisite.examens, { ...nouvelExamen }]
      });
      setNouvelExamen({ type: '', resultat: '' });
    }
  };

  const ajouterBiologie = () => {
    if (nouvelleBiologie.type && nouvelleBiologie.resultat) {
      setNouvelleVisite({
        ...nouvelleVisite,
        biologie: [...nouvelleVisite.biologie, { ...nouvelleBiologie }]
      });
      setNouvelleBiologie({ type: '', resultat: '' });
    }
  };

  const ajouterPrescription = () => {
    if (nouvellePrescription.medicament && nouvellePrescription.posologie) {
      setNouvelleVisite({
        ...nouvelleVisite,
        prescriptions: [...nouvelleVisite.prescriptions, { ...nouvellePrescription }]
      });
      setNouvellePrescription({ medicament: '', posologie: '' });
    }
  };

  const enregistrerVisite = () => {
    if (!nouvelleVisite.medecin || !nouvelleVisite.motif) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir au moins le médecin et le motif de la visite",
        variant: "destructive"
      });
      return;
    }

    const updatedPatient = {
      ...patient,
      visites: [nouvelleVisite, ...patient.visites]
    };
    setPatient(updatedPatient);
    setDialogOpen(false);
    setNouvelleVisite({
      date: new Date().toISOString().split('T')[0],
      medecin: '',
      motif: '',
      examens: [],
      biologie: [],
      prescriptions: [],
      notes: ''
    });
    toast({
      title: "Visite enregistrée",
      description: "La nouvelle visite a été ajoutée au dossier"
    });
  };

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-lg text-gray-500">Chargement du dossier...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            Dossier de {patient.prenom} {patient.nom}
          </h1>
          <p className="text-muted-foreground">
            N° Sécurité Sociale : {patient.numeroSecu}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Stethoscope className="mr-2 h-4 w-4" />
              Nouvelle Visite
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Enregistrer une nouvelle visite</DialogTitle>
              <DialogDescription>
                Renseignez les informations de la visite
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de la visite</Label>
                  <Input
                    type="date"
                    value={nouvelleVisite.date}
                    onChange={(e) => setNouvelleVisite({...nouvelleVisite, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Médecin</Label>
                  <Input
                    value={nouvelleVisite.medecin}
                    onChange={(e) => setNouvelleVisite({...nouvelleVisite, medecin: e.target.value})}
                    placeholder="Nom du médecin"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Motif de la visite</Label>
                <Input
                  value={nouvelleVisite.motif}
                  onChange={(e) => setNouvelleVisite({...nouvelleVisite, motif: e.target.value})}
                  placeholder="Motif de la consultation"
                />
              </div>

              <div className="space-y-2">
                <Label>Examens cliniques</Label>
                <div className="space-y-2">
                  {nouvelleVisite.examens.map((examen, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded flex justify-between items-center">
                      <span>{examen.type}: {examen.resultat}</span>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type d'examen"
                      value={nouvelExamen.type}
                      onChange={(e) => setNouvelExamen({...nouvelExamen, type: e.target.value})}
                    />
                    <Input
                      placeholder="Résultat"
                      value={nouvelExamen.resultat}
                      onChange={(e) => setNouvelExamen({...nouvelExamen, resultat: e.target.value})}
                    />
                    <Button type="button" variant="outline" onClick={ajouterExamen}>
                      Ajouter
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Examens biologiques</Label>
                <div className="space-y-2">
                  {nouvelleVisite.biologie.map((bio, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded flex justify-between items-center">
                      <span>{bio.type}: {bio.resultat}</span>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type d'analyse"
                      value={nouvelleBiologie.type}
                      onChange={(e) => setNouvelleBiologie({...nouvelleBiologie, type: e.target.value})}
                    />
                    <Input
                      placeholder="Résultat"
                      value={nouvelleBiologie.resultat}
                      onChange={(e) => setNouvelleBiologie({...nouvelleBiologie, resultat: e.target.value})}
                    />
                    <Button type="button" variant="outline" onClick={ajouterBiologie}>
                      Ajouter
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Prescriptions</Label>
                <div className="space-y-2">
                  {nouvelleVisite.prescriptions.map((prescription, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded flex justify-between items-center">
                      <span>{prescription.medicament} - {prescription.posologie}</span>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Médicament"
                      value={nouvellePrescription.medicament}
                      onChange={(e) => setNouvellePrescription({...nouvellePrescription, medicament: e.target.value})}
                    />
                    <Input
                      placeholder="Posologie"
                      value={nouvellePrescription.posologie}
                      onChange={(e) => setNouvellePrescription({...nouvellePrescription, posologie: e.target.value})}
                    />
                    <Button type="button" variant="outline" onClick={ajouterPrescription}>
                      Ajouter
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={nouvelleVisite.notes}
                  onChange={(e) => setNouvelleVisite({...nouvelleVisite, notes: e.target.value})}
                  placeholder="Observations et remarques"
                />
              </div>

              <Button onClick={enregistrerVisite}>
                Enregistrer la visite
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stade MRC</p>
                <p className="text-2xl font-bold">{patient.stade}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dernier RDV</p>
                <p className="text-2xl font-bold">{patient.dernierRDV}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Traitements actifs</p>
                <p className="text-2xl font-bold">{patient.traitements.length}</p>
              </div>
              <Pills className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="visites" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visites">
            <Stethoscope className="h-4 w-4 mr-2" />
            Visites
          </TabsTrigger>
          <TabsTrigger value="informations">
            <FileText className="h-4 w-4 mr-2" />
            Informations
          </TabsTrigger>
          <TabsTrigger value="antecedents">
            <AlertCircle className="h-4 w-4 mr-2" />
            Antécédents
          </TabsTrigger>
          <TabsTrigger value="examens">
            <FlaskRound className="h-4 w-4 mr-2" />
            Examens
          </TabsTrigger>
          <TabsTrigger value="prescriptions">
            <ClipboardList className="h-4 w-4 mr-2" />
            Prescriptions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visites">
          <Card>
            <CardHeader>
              <CardTitle>Historique des visites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {patient.visites.map((visite, index) => (
                  <div key={index} className="border-b pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-lg">{visite.date}</h3>
                        <p className="text-sm text-muted-foreground">
                          {visite.medecin} - {visite.motif}
                        </p>
                      </div>
                    </div>

                    {visite.examens.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Examens cliniques</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {visite.examens.map((examen, i) => (
                            <div key={i} className="p-2 bg-gray-50 rounded">
                              <span className="font-medium">{examen.type}:</span> {examen.resultat}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {visite.biologie.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Examens biologiques</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {visite.biologie.map((bio, i) => (
                            <div key={i} className="p-2 bg-gray-50 rounded">
                              <span className="font-medium">{bio.type}:</span> {bio.resultat}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {visite.prescriptions.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Prescriptions</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {visite.prescriptions.map((prescription, i) => (
                            <div key={i} className="p-2 bg-gray-50 rounded">
                              <span className="font-medium">{prescription.medicament}</span>
                              <p className="text-sm text-muted-foreground">{prescription.posologie}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {visite.notes && (
                      <div>
                        <h4 className="font-medium mb-2">Notes</h4>
                        <p className="text-sm text-muted-foreground">{visite.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="informations">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Date de naissance</p>
                <p className="font-medium">{new Date(patient.dateNaissance).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sexe</p>
                <p className="font-medium">{patient.sexe === 'F' ? 'Féminin' : 'Masculin'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Adresse</p>
                <p className="font-medium">{patient.adresse}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Téléphone</p>
                <p className="font-medium">{patient.telephone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Médecin référent</p>
                <p className="font-medium">{patient.medecinReferent}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="antecedents">
          <Card>
            <CardHeader>
              <CardTitle>Antécédents médicaux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patient.antecedents.map((antecedent, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-blue-600">
                      {antecedent.categorie.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </p>
                    <p className="mt-1">{antecedent.details}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examens">
          <Card>
            <CardHeader>
              <CardTitle>Historique des examens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {patient.visites.map((visite, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <h3 className="font-medium mb-3">{visite.date}</h3>
                    
                    {visite.examens.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Examens cliniques</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {visite.examens.map((examen, i) => (
                            <div key={i} className="p-2 bg-gray-50 rounded">
                              <span className="font-medium">{examen.type}:</span> {examen.resultat}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {visite.biologie.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Examens biologiques</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {visite.biologie.map((bio, i) => (
                            <div key={i} className="p-2 bg-gray-50 rounded">
                              <span className="font-medium">{bio.type}:</span> {bio.resultat}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions">
          <Card>
            <CardHeader>
              <CardTitle>Historique des prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {patient.visites.map((visite, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <h3 className="font-medium mb-3">{visite.date}</h3>
                    
                    {visite.prescriptions.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {visite.prescriptions.map((prescription, i) => (
                          <div key={i} className="p-2 bg-gray-50 rounded">
                            <span className="font-medium">{prescription.medicament}</span>
                            <p className="text-sm text-muted-foreground">{prescription.posologie}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Aucune prescription</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}