
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Check, X, Bell } from "lucide-react";
import { toast } from "sonner";

interface CustomerDashboardProps {
  customerWhatsapp: string;
}

const CustomerDashboard = ({ customerWhatsapp }: CustomerDashboardProps) => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [vaccines, setVaccines] = useState<any[]>([]);

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

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Bell className="h-5 w-5 text-primary" />
                Meus Agendamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum agendamento encontrado
                  </p>
                ) : (
                  appointments.map((appointment) => (
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
                              <Check className="w-3 h-3 mr-1" />
                              Confirmado
                            </span>
                          )}
                          {appointment.status === 'cancelled' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <X className="w-3 h-3 mr-1" />
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

          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Check className="h-5 w-5 text-primary" />
                Meus Pets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {pets.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 col-span-2">
                    Nenhum pet cadastrado
                  </p>
                ) : (
                  pets.map((pet, index) => (
                    <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                      <div className="space-y-3">
                        <h3 className="font-semibold text-lg">{pet.name}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-muted-foreground">Tipo:</span>
                          <span>{pet.type}</span>
                          <span className="text-muted-foreground">Raça:</span>
                          <span>{pet.breed || 'Não informado'}</span>
                          <span className="text-muted-foreground">Idade:</span>
                          <span>{pet.age}</span>
                          <span className="text-muted-foreground">Peso:</span>
                          <span>{pet.weight ? `${pet.weight}kg` : 'Não informado'}</span>
                        </div>
                        <div className="pt-3 border-t">
                          <h4 className="text-sm font-medium mb-2">Vacinas</h4>
                          <div className="space-y-2">
                            {vaccines
                              .filter((v) => (v.petId === pet.id) || (v.petName === pet.name))
                              .map((vaccine) => (
                                <div
                                  key={vaccine.id}
                                  className="flex items-center gap-2 text-sm bg-accent/10 p-2 rounded-md"
                                >
                                  <Check className="h-4 w-4 text-primary" />
                                  <span>{vaccine.name}</span>
                                  <span className="text-muted-foreground ml-auto">
                                    {format(new Date(vaccine.date), 'dd/MM/yyyy')}
                                  </span>
                                </div>
                              ))}
                            {!vaccines.some((v) => (v.petId === pet.id) || (v.petName === pet.name)) && (
                              <p className="text-sm text-muted-foreground">Nenhuma vacina registrada</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
