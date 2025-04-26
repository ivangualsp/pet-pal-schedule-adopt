
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Calendar, Clock, Syringe } from "lucide-react";
import { toast } from "sonner";

interface CustomerDashboardProps {
  customerWhatsapp: string;
}

const CustomerDashboard = ({ customerWhatsapp }: CustomerDashboardProps) => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [vaccines, setVaccines] = useState<any[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>("all"); // Changed from empty string to "all"

  useEffect(() => {
    const loadCustomerData = () => {
      const savedAppointments = localStorage.getItem('appointments');
      const savedCustomerPets = localStorage.getItem('customerPets');
      const savedClientPets = localStorage.getItem('clientPets');
      const savedVaccines = localStorage.getItem('petVaccines') || '[]';

      if (savedAppointments) {
        const allAppointments = JSON.parse(savedAppointments);
        const customerAppointments = allAppointments.filter(
          (apt: any) => apt.ownerWhatsapp === customerWhatsapp
        );
        setAppointments(customerAppointments);
      }

      // Combine pets from both storage locations
      let allPets: any[] = [];
      
      if (savedCustomerPets) {
        const customerPets = JSON.parse(savedCustomerPets);
        const filteredCustomerPets = customerPets.filter(
          (pet: any) => pet.ownerWhatsapp === customerWhatsapp
        );
        allPets = [...allPets, ...filteredCustomerPets];
      }
      
      if (savedClientPets) {
        const clientPets = JSON.parse(savedClientPets);
        const filteredClientPets = clientPets.filter(
          (pet: any) => pet.ownerWhatsapp === customerWhatsapp
        );
        allPets = [...allPets, ...filteredClientPets];
      }
      
      setPets(allPets);
      setVaccines(JSON.parse(savedVaccines));
    };

    loadCustomerData();
  }, [customerWhatsapp]);

  const handleCancelAppointment = (appointmentId: string) => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      const allAppointments = JSON.parse(savedAppointments);
      const updatedAppointments = allAppointments.map((apt: any) =>
        apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
      );
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      setAppointments(updatedAppointments.filter(
        (apt: any) => apt.ownerWhatsapp === customerWhatsapp
      ));
      toast.success("Agendamento cancelado com sucesso");
    }
  };

  const addVaccine = (petName: string, vaccine: string) => {
    const newVaccine = {
      id: Date.now().toString(),
      petName,
      name: vaccine,
      date: new Date().toISOString(),
      ownerWhatsapp: customerWhatsapp
    };

    const updatedVaccines = [...vaccines, newVaccine];
    setVaccines(updatedVaccines);
    localStorage.setItem('petVaccines', JSON.stringify(updatedVaccines));
    toast.success("Vacina registrada com sucesso");
  };

  const filteredAppointments = appointments.filter(
    apt => selectedPetId === "all" ? true : apt.petId === selectedPetId
  );

  const filteredVaccines = vaccines.filter(
    vaccine => selectedPetId === "all" ? true : (vaccine.petId === selectedPetId || vaccine.petName === pets.find(p => p.id === selectedPetId)?.name)
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-card p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Minha Área
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie seus agendamentos e pets
            </p>
          </div>
          <Button 
            variant="outline"
            className="hover:bg-destructive hover:text-destructive-foreground" 
            onClick={() => {
              localStorage.removeItem('currentCustomer');
              navigate('/login');
            }}
          >
            Sair
          </Button>
        </div>

        {pets.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Selecione um pet:</span>
              <Select
                value={selectedPetId}
                onValueChange={(value) => setSelectedPetId(value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Todos os pets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os pets</SelectItem> {/* Changed from empty string to "all" */}
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id || `pet-${pet.name}`}>
                      {pet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        )}

        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Agendamentos
            </TabsTrigger>
            <TabsTrigger value="vaccines" className="flex items-center gap-2">
              <Syringe className="h-4 w-4" />
              Vacinas
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Meus Agendamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAppointments.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhum agendamento encontrado
                    </p>
                  ) : (
                    filteredAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`flex justify-between items-center p-4 rounded-lg border ${
                          appointment.status === 'confirmed'
                            ? 'bg-green-50 border-green-200'
                            : appointment.status === 'cancelled'
                            ? 'bg-red-50 border-red-200'
                            : 'bg-card border-border'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="font-medium">
                              {format(new Date(appointment.date), 'dd/MM/yyyy')} às {appointment.time}
                            </span>
                            {appointment.status === 'confirmed' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Confirmado
                              </span>
                            )}
                            {appointment.status === 'cancelled' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Cancelado
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Pet: {appointment.petName}
                          </p>
                        </div>
                        {appointment.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="hover:bg-destructive hover:text-destructive-foreground"
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vaccines">
            <Card>
              <CardHeader>
                <CardTitle>Vacinas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredVaccines.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhuma vacina registrada
                    </p>
                  ) : (
                    filteredVaccines.map((vaccine) => (
                      <div
                        key={vaccine.id}
                        className="p-4 rounded-lg border bg-card"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-medium">{vaccine.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Pet: {vaccine.petName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Data: {format(new Date(vaccine.date), 'dd/MM/yyyy')}
                            </p>
                            {vaccine.nextDate && (
                              <p className="text-sm text-muted-foreground">
                                Próxima dose: {format(new Date(vaccine.nextDate), 'dd/MM/yyyy')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Histórico</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPetId !== "all" ? (
                  <div className="space-y-6">
                    {pets
                      .filter((pet) => pet.id === selectedPetId)
                      .map((pet) => (
                        <div key={pet.id} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border">
                            <div>
                              <p className="font-medium">Nome:</p>
                              <p className="text-muted-foreground">{pet.name}</p>
                            </div>
                            <div>
                              <p className="font-medium">Tipo:</p>
                              <p className="text-muted-foreground">{pet.type}</p>
                            </div>
                            {pet.breed && (
                              <div>
                                <p className="font-medium">Raça:</p>
                                <p className="text-muted-foreground">{pet.breed}</p>
                              </div>
                            )}
                            <div>
                              <p className="font-medium">Idade:</p>
                              <p className="text-muted-foreground">{pet.age}</p>
                            </div>
                            {pet.weight && (
                              <div>
                                <p className="font-medium">Peso:</p>
                                <p className="text-muted-foreground">{pet.weight}kg</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Selecione um pet para ver seu histórico completo
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerDashboard;
