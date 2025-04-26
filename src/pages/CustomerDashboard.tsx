import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Check } from "lucide-react";
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
      const savedPets = localStorage.getItem('customerPets');
      const savedVaccines = localStorage.getItem('petVaccines') || '[]';

      if (savedAppointments) {
        const allAppointments = JSON.parse(savedAppointments);
        const customerAppointments = allAppointments.filter(
          (apt: any) => apt.ownerWhatsapp === customerWhatsapp
        );
        setAppointments(customerAppointments);
      }

      if (savedPets) {
        const allPets = JSON.parse(savedPets);
         const customerPets = allPets.filter(
          (pet: any) => pet.ownerWhatsapp === customerWhatsapp
        );
        setPets(customerPets);
      }

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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Minha Área</h1>
          <Button variant="outline" onClick={() => {
            localStorage.removeItem('currentCustomer');
            navigate('/login');
          }}>
            Sair
          </Button>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Meus Agendamentos</h2>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">
                          {format(new Date(appointment.date), 'dd/MM/yyyy')} às {appointment.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pet: {appointment.petName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Status: {appointment.status}
                      </p>
                    </div>
                    {appointment.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Meus Pets</h2>
            <div className="space-y-4">
              {pets.map((pet, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">{pet.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {pet.type} • {pet.breed} • {pet.age} • {pet.weight}kg
                    </p>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Vacinas</h4>
                      <div className="space-y-2">
                        {vaccines
                          .filter((v) => v.petName === pet.name)
                          .map((vaccine) => (
                            <div key={vaccine.id} className="flex items-center gap-2 text-sm">
                              <Check className="h-4 w-4" />
                              <span>{vaccine.name}</span>
                              <span className="text-muted-foreground">
                                ({format(new Date(vaccine.date), 'dd/MM/yyyy')})
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
