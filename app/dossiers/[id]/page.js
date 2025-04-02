'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Activity, Calendar, Pill as Pills, AlertCircle, Stethoscope, FlaskRound, ClipboardList, Edit2, X, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { useDeviceType } from '@/hooks/use-device-type';
import { useSwipeable } from 'react-swipeable';

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
          id: 1,
          date: "12/01/2024",
          medecin: "Dr. Martin",
          motif: "Suivi trimestriel",
          status: "terminé",
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
          id: 2,
          date: "15/10/2023",
          medecin: "Dr. Bernard",
          motif: "Contrôle routine",
          status: "terminé",
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  const [activeTab, setActiveTab] = useState('visites');
  const [selectedVisit, setSelectedVisit] = useState(null);

  const [nouvelleVisite, setNouvelleVisite] = useState({
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    medecin: '',
    motif: '',
    status: 'planifié',
    examens: [],
    biologie: [],
    prescriptions: [],
    notes: ''
  });

  const [nouvelExamen, setNouvelExamen] = useState({ type: '', resultat: '' });
  const [nouvelleBiologie, setNouvelleBiologie] = useState({ type: '', resultat: '' });
  const [nouvellePrescription, setNouvellePrescription] = useState({ medicament: '', posologie: '' });

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      const tabs = ['visites', 'informations', 'antecedents', 'examens', 'prescriptions'];
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
      }
    },
    onSwipedRight: () => {
      const tabs = ['visites', 'informations', 'antecedents', 'examens', 'prescriptions'];
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1]);
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: false
  });

  useEffect(() => {
    const patientData = getPatientData(params.id);
    setPatient(patientData);
  }, [params.id]);

  const ajouterExamen = () => {
    if (nouvelExamen.type) {
      setNouvelleVisite({
        ...nouvelleVisite,
        examens: [...nouvelleVisite.examens, { 
          type: nouvelExamen.type, 
          resultat: nouvelExamen.resultat || "en attente" 
        }]
      });
      setNouvelExamen({ type: '', resultat: '' });
    }
  };

  const ajouterBiologie = () => {
    if (nouvelleBiologie.type) {
      setNouvelleVisite({
        ...nouvelleVisite,
        biologie: [...nouvelleVisite.biologie, { 
          type: nouvelleBiologie.type, 
          resultat: nouvelleBiologie.resultat || "en attente" 
        }]
      });
      setNouvelleBiologie({ type: '', resultat: '' });
    }
  };

  const ajouterPrescription = () => {
    if (!nouvellePrescription.medicament || !nouvellePrescription.posologie) {
      toast({
        title: "Erreur",
        description: "Le médicament et la posologie sont obligatoires pour ajouter une prescription",
        variant: "destructive"
      });
      return;
    }

    setNouvelleVisite({
      ...nouvelleVisite,
      prescriptions: [...nouvelleVisite.prescriptions, { 
        medicament: nouvellePrescription.medicament, 
        posologie: nouvellePrescription.posologie
      }]
    });
    setNouvellePrescription({ medicament: '', posologie: '' });
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
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      medecin: '',
      motif: '',
      status: 'planifié',
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

  const handleEditVisit = (visite) => {
    setSelectedVisit(visite);
    setNouvelleVisite(visite);
    setEditDialogOpen(true);
  };

  const handleUpdateVisit = () => {
    const updatedVisites = patient.visites.map(v => 
      v.id === selectedVisit.id ? nouvelleVisite : v
    );
    
    setPatient({
      ...patient,
      visites: updatedVisites
    });
    
    setEditDialogOpen(false);
    setSelectedVisit(null);
    setNouvelleVisite({
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      medecin: '',
      motif: '',
      status: 'planifié',
      examens: [],
      biologie: [],
      prescriptions: [],
      notes: ''
    });

    toast({
      title: "Visite mise à jour",
      description: "Les modifications ont été enregistrées"
    });
  };

  const handleCancelVisit = (visiteId) => {
    const updatedVisites = patient.visites.map(v => 
      v.id === visiteId ? { ...v, status: 'annulé' } : v
    );
    
    setPatient({
      ...patient,
      visites: updatedVisites
    });

    toast({
      title: "Visite annulée",
      description: "La visite a été marquée comme annulée"
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planifié':
        return 'text-blue-500 bg-blue-50';
      case 'terminé':
        return 'text-green-500 bg-green-50';
      case 'annulé':
        return 'text-red-500 bg-red-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
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
      <div className={cn(
        "mb-6",
        isMobile && "space-y-4"
      )}>
        <div className={cn(
          "flex justify-between items-center",
          isMobile && "flex-col gap-4"
        )}>
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
              <Button className={cn(isMobile && "w-full")}>
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
                <div className={cn(
                  "grid gap-4",
                  isMobile ? "grid-cols-1" : "grid-cols-2"
                )}>
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
                      <div key={index} className="p-2 bg-secondary rounded flex justify-between items-center">
                        <span>
                          {examen.type}: <span className={cn(
                            examen.resultat === "en attente" && "text-muted-foreground italic"
                          )}>{examen.resultat}</span>
                        </span>
                      </div>
                    ))}
                    <div className={cn(
                      "flex gap-2",
                      isMobile && "flex-col"
                    )}>
                      <Input
                        placeholder="Type d'examen"
                        value={nouvelExamen.type}
                        onChange={(e) => setNouvelExamen({...nouvelExamen, type: e.target.value})}
                      />
                      <Input
                        placeholder="Résultat (optionnel)"
                        value={nouvelExamen.resultat}
                        onChange={(e) => setNouvelExamen({...nouvelExamen, resultat: e.target.value})}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={ajouterExamen}
                        className={cn(isMobile && "w-full")}
                      >
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Examens biologiques</Label>
                  <div className="space-y-2">
                    {nouvelleVisite.biologie.map((bio, index) => (
                      <div key={index} className="p-2 bg-secondary rounded flex justify-between items-center">
                        <span>
                          {bio.type}: <span className={cn(
                            bio.resultat === "en attente" && "text-muted-foreground italic"
                          )}>{bio.resultat}</span>
                        </span>
                      </div>
                    ))}
                    <div className={cn(
                      "flex gap-2",
                      isMobile && "flex-col"
                    )}>
                      <Input
                        placeholder="Type d'analyse"
                        value={nouvelleBiologie.type}
                        onChange={(e) => setNouvelleBiologie({...nouvelleBiologie, type: e.target.value})}
                      />
                      <Input
                        placeholder="Résultat (optionnel)"
                        value={nouvelleBiologie.resultat}
                        onChange={(e) => setNouvelleBiologie({...nouvelleBiologie, resultat: e.target.value})}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={ajouterBiologie}
                        className={cn(isMobile && "w-full")}
                      >
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Prescriptions</Label>
                  <div className="space-y-2">
                    {nouvelleVisite.prescriptions.map((prescription, index) => (
                      <div key={index} className="p-2 bg-secondary rounded flex justify-between items-center">
                        <span>
                          {prescription.medicament} - {prescription.posologie}
                        </span>
                      </div>
                    ))}
                    <div className={cn(
                      "flex gap-2",
                      isMobile && "flex-col"
                    )}>
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
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={ajouterPrescription}
                        className={cn(isMobile && "w-full")}
                      >
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

                <Button 
                  onClick={enregistrerVisite}
                  className={cn(isMobile && "w-full")}
                >
                  Enregistrer la visite
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-1" : "md:grid-cols-3"
        )}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Stade MRC</p>
                  <p className="text-2xl font-bold">{patient.stade}</p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
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
                <Calendar className="h-8 w-8 text-success" />
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
                <Pills className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
        {...swipeHandlers}
      >
        <TabsList className={cn(
          "w-full justify-start",
          isMobile && "overflow-x-auto flex-nowrap"
        )}>
          <TabsTrigger value="visites" className="flex items-center">
            <Stethoscope className="h-4 w-4 mr-2" />
            <span className={cn(isMobile && "text-sm")}>Visites</span>
          </TabsTrigger>
          <TabsTrigger value="informations" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            <span className={cn(isMobile && "text-sm")}>Informations</span>
          </TabsTrigger>
          <TabsTrigger value="antecedents" className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className={cn(isMobile && "text-sm")}>Antécédents</span>
          </TabsTrigger>
          <TabsTrigger value="examens" className="flex items-center">
            <FlaskRound className="h-4 w-4 mr-2" />
            <span className={cn(isMobile && "text-sm")}>Examens</span>
          </TabsTrigger>
          <TabsTrigger value="prescriptions" className="flex items-center">
            <ClipboardList className="h-4 w-4 mr-2" />
            <span className={cn(isMobile && "text-sm")}>Prescriptions</span>
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
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-lg">{visite.date}</h3>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-sm",
                            getStatusColor(visite.status)
                          )}>
                            {visite.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {visite.medecin} - {visite.motif}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {visite.status !== 'annulé' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditVisit(visite)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Annuler la visite</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir annuler cette visite ? Cette action ne peut pas être annulée.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleCancelVisit(visite.id)}
                                  >
                                    Confirmer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </div>

                    {visite.examens.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Examens cliniques</h4>
                        <div className={cn(
                          "grid gap-2",
                          isMobile ? "grid-cols-1" : "grid-cols-2"
                        )}>
                          {visite.examens.map((examen, i) => (
                            <div key={i} className="p-2 bg-secondary rounded">
                              <span className="font-medium">{examen.type}:</span>{' '}
                              <span className={cn(
                                examen.resultat === "en attente" && "text-muted-foreground italic"
                              )}>{examen.resultat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {visite.biologie.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Examens biologiques</h4>
                        <div className={cn(
                          "grid gap-2",
                          isMobile ? "grid-cols-1" : "grid-cols-2"
                        )}>
                          {visite.biologie.map((bio, i) => (
                            <div key={i} className="p-2 bg-secondary rounded">
                              <span className="font-medium">{bio.type}:</span>{' '}
                              <span className={cn(
                                bio.resultat === "en attente" && "text-muted-foreground italic"
                              )}>{bio.resultat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {visite.prescriptions.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Prescriptions</h4>
                        <div className={cn(
                          "grid gap-2",
                          isMobile ? "grid-cols-1" : "grid-cols-2"
                        )}>
                          {visite.prescriptions.map((prescription, i) => (
                            <div key={i} className="p-2 bg-secondary rounded">
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

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier la visite</DialogTitle>
              <DialogDescription>
                Mettez à jour les informations de la visite
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className={cn(
                "grid gap-4",
                isMobile ? "grid-cols-1" : "grid-cols-2"
              )}>
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
                  {nouvelleVisite.examens.map((examen,index) => (
                    <div key={index} className="p-2 bg-secondary rounded flex justify-between items-center">
                      <span>{examen.type}</span>
                      <Input
                        value={examen.resultat}
                        onChange={(e) => {
                          const updatedExamens = [...nouvelleVisite.examens];
                          updatedExamens[index].resultat = e.target.value;
                          setNouvelleVisite({...nouvelleVisite, examens: updatedExamens});
                        }}
                        className="w-40 ml-2"
                        placeholder="Résultat"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Examens biologiques</Label>
                <div className="space-y-2">
                  {nouvelleVisite.biologie.map((bio, index) => (
                    <div key={index} className="p-2 bg-secondary rounded flex justify-between items-center">
                      <span>{bio.type}</span>
                      <Input
                        value={bio.resultat}
                        onChange={(e) => {
                          const updatedBiologie = [...nouvelleVisite.biologie];
                          updatedBiologie[index].resultat = e.target.value;
                          setNouvelleVisite({...nouvelleVisite, biologie: updatedBiologie});
                        }}
                        className="w-40 ml-2"
                        placeholder="Résultat"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Prescriptions</Label>
                <div className="space-y-2">
                  {nouvelleVisite.prescriptions.map((prescription, index) => (
                    <div key={index} className="p-2 bg-secondary rounded flex justify-between items-center">
                      <span>{prescription.medicament}</span>
                      <Input
                        value={prescription.posologie}
                        onChange={(e) => {
                          const updatedPrescriptions = [...nouvelleVisite.prescriptions];
                          updatedPrescriptions[index].posologie = e.target.value;
                          setNouvelleVisite({...nouvelleVisite, prescriptions: updatedPrescriptions});
                        }}
                        className="w-40 ml-2"
                        placeholder="Posologie"
                      />
                    </div>
                  ))}
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

              <div className="space-y-2">
                <Label>Statut de la visite</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={nouvelleVisite.status}
                  onChange={(e) => setNouvelleVisite({...nouvelleVisite, status: e.target.value})}
                >
                  <option value="planifié">Planifié</option>
                  <option value="terminé">Terminé</option>
                  <option value="annulé">Annulé</option>
                </select>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleUpdateVisit}>
                  Mettre à jour
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        <TabsContent value="informations">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className={cn(
              "grid gap-4",
              isMobile ? "grid-cols-1" : "grid-cols-2"
            )}>
              <div>
                <p className="text-sm text-muted-foreground">Date de naissance</p>
                <p className="font-medium">{new Date(patient.dateNaissance).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sexe</p>
                <p className="font-medium">{patient.sexe === 'F' ? 'Féminin' : 'Masculin'}</p>
              </div>
              <div className={cn(isMobile && "col-span-full")}>
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
                  <div key={index} className="p-4 bg-secondary rounded-lg">
                    <p className="font-medium text-primary">
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
                        <div className={cn(
                          "grid gap-2",
                          isMobile ? "grid-cols-1" : "grid-cols-2"
                        )}>
                          {visite.examens.map((examen, i) => (
                            <div key={i} className="p-2 bg-secondary rounded">
                              <span className="font-medium">{examen.type}:</span>{' '}
                              <span className={cn(
                                examen.resultat === "en attente" && "text-muted-foreground italic"
                              )}>{examen.resultat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {visite.biologie.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Examens biologiques</h4>
                        <div className={cn(
                          "grid gap-2",
                          isMobile ? "grid-cols-1" : "grid-cols-2"
                        )}>
                          {visite.biologie.map((bio, i) => (
                            <div key={i} className="p-2 bg-secondary rounded">
                              <span className="font-medium">{bio.type}:</span>{' '}
                              <span className={cn(
                                bio.resultat === "en attente" && "text-muted-foreground italic"
                              )}>{bio.resultat}</span>
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
                      <div className={cn(
                        "grid gap-2",
                        isMobile ? "grid-cols-1" : "grid-cols-2"
                      )}>
                        {visite.prescriptions.map((prescription, i) => (
                          <div key={i} className="p-2 bg-secondary rounded">
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