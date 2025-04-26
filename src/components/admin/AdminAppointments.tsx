
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Clock } from "lucide-react";
import { toast } from "sonner";

export interface Appointment {
  id: string;
  date: string;
  time: string;
  serviceId: string;
  petName: string;
  petType: string;
  petBreed: string;
  petAge: string;
  petWeight: string;
  ownerName: string;
  ownerWhatsapp: string;
  ownerAddress: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [newTimeSlot, setNewTimeSlot] = useState<string>("");
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }

    const savedTimeSlots = localStorage.getItem('timeSlots');
    if (savedTimeSlots) {
      setTimeSlots(JSON.parse(savedTimeSlots));
    } else {
      const defaultSlots = [
        { id: "1", time: "09:00", available: true },
        { id: "2", time: "10:00", available: true },
        { id: "3", time: "11:00", available: true },
        { id: "4", time: "14:00", available: true },
        { id: "5", time: "15:00", available: true },
        { id: "6", time: "16:00", available: true },
      ];
      setTimeSlots(defaultSlots);
      localStorage.setItem('timeSlots', JSON.stringify(defaultSlots));
    }

    const savedServices = localStorage.getItem('services');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd");
  };

  const filteredAppointments = appointments.filter(
    (apt) => formatDate(apt.date) === format(selectedDate, 'yyyy-MM-dd')
  );

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Serviço não encontrado';
  };

  const handleAddTimeSlot = () => {
    if (!newTimeSlot.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      toast.error("Formato de horário inválido. Use o formato HH:MM");
      return;
    }

    if (timeSlots.some(slot => slot.time === newTimeSlot)) {
      toast.error("Este horário já existe");
      return;
    }

    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      time: newTimeSlot,
      available: true
    };

    const updatedSlots = [...timeSlots, newSlot].sort((a, b) => 
      a.time.localeCompare(b.time)
    );
    
    setTimeSlots(updatedSlots);
    localStorage.setItem('timeSlots', JSON.stringify(updatedSlots));
    setNewTimeSlot("");
    toast.success("Horário adicionado com sucesso");
  };

  const handleRemoveTimeSlot = (id: string) => {
    const updatedSlots = timeSlots.filter(slot => slot.id !== id);
    setTimeSlots(updatedSlots);
    localStorage.setItem('timeSlots', JSON.stringify(updatedSlots));
    toast.success("Horário removido com sucesso");
  };

  const handleStatusChange = (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    const updatedAppointments = appointments.map(apt =>
      apt.id === id ? { ...apt, status } : apt
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    toast.success("Status atualizado com sucesso");
  };

  return (
    <div className="grid md:grid-cols-[300px,1fr] gap-6">
      <div className="space-y-4">
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md pointer-events-auto"
            locale={ptBR}
          />
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Horários Disponíveis</h3>
          <div className="mb-4 flex space-x-2">
            <Input
              placeholder="HH:MM"
              value={newTimeSlot}
              onChange={(e) => setNewTimeSlot(e.target.value)}
            />
            <Button onClick={handleAddTimeSlot}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {timeSlots.sort((a, b) => a.time.localeCompare(b.time)).map((slot) => (
              <div key={slot.id} className="flex justify-between items-center p-2 bg-background rounded-md">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{slot.time}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveTimeSlot(slot.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Agendamentos para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
        </h3>
        
        {filteredAppointments.length === 0 ? (
          <p className="text-muted-foreground">Nenhum agendamento para esta data.</p>
        ) : (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{appointment.time} - {getServiceName(appointment.serviceId)}</p>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium">Dados do Pet</h4>
                    <p className="text-sm text-gray-600">Nome: {appointment.petName}</p>
                    <p className="text-sm text-gray-600">Tipo: {appointment.petType}</p>
                    <p className="text-sm text-gray-600">Raça: {appointment.petBreed}</p>
                    <p className="text-sm text-gray-600">Idade: {appointment.petAge} • Peso: {appointment.petWeight}kg</p>
                  </div>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium">Dados do Tutor</h4>
                    <p className="text-sm text-gray-600">Nome: {appointment.ownerName}</p>
                    <p className="text-sm text-gray-600">WhatsApp: {appointment.ownerWhatsapp}</p>
                    <p className="text-sm text-gray-600">Endereço: {appointment.ownerAddress}</p>
                  </div>
                </div>
                <div className="text-sm space-y-2">
                  <Button 
                    size="sm"
                    variant={appointment.status === 'confirmed' ? 'default' : 'outline'} 
                    className={appointment.status === 'confirmed' ? 'bg-green-500 hover:bg-green-600 w-full' : 'w-full'}
                    onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                  >
                    Confirmar
                  </Button>
                  <Button 
                    size="sm"
                    variant={appointment.status === 'pending' ? 'default' : 'outline'}
                    className={appointment.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600 w-full' : 'w-full'}
                    onClick={() => handleStatusChange(appointment.id, 'pending')}
                  >
                    Pendente
                  </Button>
                  <Button 
                    size="sm"
                    variant={appointment.status === 'cancelled' ? 'default' : 'outline'}
                    className={appointment.status === 'cancelled' ? 'bg-red-500 hover:bg-red-600 w-full' : 'w-full'}
                    onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
