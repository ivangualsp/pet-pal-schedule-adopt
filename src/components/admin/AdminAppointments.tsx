
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";

export interface Appointment {
  id: string;
  date: string;
  time: string;
  service: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  petName: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  const filteredAppointments = appointments.filter(
    (apt) => apt.date === format(selectedDate, 'yyyy-MM-dd')
  );

  return (
    <div className="grid md:grid-cols-[300px,1fr] gap-6">
      <Card className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="rounded-md pointer-events-auto"
          locale={ptBR}
        />
      </Card>

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
                  <p className="font-semibold">{appointment.time} - {appointment.service}</p>
                  <p className="text-sm text-gray-600">Cliente: {appointment.customerName}</p>
                  <p className="text-sm text-gray-600">Pet: {appointment.petName}</p>
                  <p className="text-sm text-gray-600">
                    Contato: {appointment.customerEmail} • {appointment.customerPhone}
                  </p>
                </div>
                <div className="text-sm">
                  <span className={`px-2 py-1 rounded-full ${
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status === 'confirmed' ? 'Confirmado' :
                     appointment.status === 'cancelled' ? 'Cancelado' :
                     'Pendente'}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
