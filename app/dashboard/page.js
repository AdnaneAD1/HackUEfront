'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, AlertTriangle, Calendar } from 'lucide-react'

const mockData = {
  patients: 156,
  alerts: 12,
  appointments: 8,
  evolution: [
    { month: 'Jan', stade3: 45, stade4: 30, stade5: 15 },
    { month: 'Fév', stade3: 48, stade4: 28, stade5: 16 },
    { month: 'Mar', stade3: 43, stade4: 32, stade5: 14 },
    { month: 'Avr', stade3: 50, stade4: 25, stade5: 18 },
    { month: 'Mai', stade3: 47, stade4: 29, stade5: 15 },
    { month: 'Juin', stade3: 52, stade4: 27, stade5: 13 }
  ]
}

export default function DashboardPage() {
  const [data, setData] = useState(mockData)

  const handleAlertClick = () => {
    window.location.href = '/notifications'
  }

  const handlePatientsClick = () => {
    window.location.href = '/patients'
  }

  const handleAppointmentsClick = () => {
    // This would open a modal or navigate to appointments page
    alert('Fonctionnalité de gestion des rendez-vous à venir')
  }

  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        <Card onClick={handlePatientsClick} className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Patients Suivis</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.patients}</div>
          </CardContent>
        </Card>
        <Card onClick={handleAlertClick} className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alertes Urgentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{data.alerts}</div>
          </CardContent>
        </Card>
        <Card onClick={handleAppointmentsClick} className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">RDV du Jour</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.appointments}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Évolution des Patients par Stade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.evolution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="stade3" stroke="#8884d8" name="Stade 3" />
                <Line type="monotone" dataKey="stade4" stroke="#82ca9d" name="Stade 4" />
                <Line type="monotone" dataKey="stade5" stroke="#ffc658" name="Stade 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}