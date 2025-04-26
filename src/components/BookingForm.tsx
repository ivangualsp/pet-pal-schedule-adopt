import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Service } from "./admin/AdminServices";
import { TimeSlot } from "./admin/AdminAppointments";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Pet {
  name: string;
  type: string;
  breed: string;
  age: string;
  weight: string;
}

interface Owner {
  name: string;
  whatsapp: string;
  address: string;
}

interface Appointment {
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

export const BookingForm = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [bookedTimeSlots, setBookedTimeSlots] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [pet, setPet] = useState<Pet>({
    name: "",
    type: "",
    breed: "",
    age: "",
    weight: "",
  });
  const [owner, setOwner] = useState<Owner>({
    name: "",
    whatsapp: "",
    address: "",
  });

  // Load initial data
  useEffect(() => {
    // Load services
    const savedServices = localStorage.getItem('services');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }

    // Load time slots
    const savedTimeSlots = localStorage.getItem('timeSlots');
    if (savedTimeSlots) {
      setAvailableTimes(JSON.parse(savedTimeSlots));
    }

    // Load saved customer data if available
    const savedCustomers = localStorage.getItem('customers');
    if (savedCustomers) {
      const customers = JSON.parse(savedCustomers);
      if (customers.length > 0) {
        setOwner({
          name: customers[0].name || "",
          whatsapp: customers[0].whatsapp || "",
          address: customers[0].address || "",
        });
      }
    }

    // Load saved pet data if available
    const savedPets = localStorage.getItem('customerPets');
    if (savedPets) {
      const pets = JSON.parse(savedPets);
      if (pets.length > 0) {
        setPet({
          name: pets[0].name || "",
          type: pets[0].type || "",
          breed: pets[0].breed || "",
          age: pets[0].age || "",
          weight: pets[0].weight || "",
        });
      }
    }
  }, []);

  // Update available time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      updateBookedTimeSlots(selectedDate);
    }
  }, [selectedDate]);

  // Function to update booked time slots for a specific date
  const updateBookedTimeSlots = (date: Date) => {
    const savedAppointments = localStorage.getItem('appointments');
    if (!savedAppointments) {
      setBookedTimeSlots([]);
      return;
    }
    
    const appointments = JSON.parse(savedAppointments);
    const bookedSlots = appointments
      .filter((apt: Appointment) => 
        apt.status !== 'cancelled' && 
        format(new Date(apt.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )
      .map((apt: Appointment) => apt.time);
    
    setBookedTimeSlots(bookedSlots);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedService || !selectedTime || !pet.name || !owner.name || !owner.whatsapp) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (bookedTimeSlots.includes(selectedTime)) {
      toast.error("Este horário já está reservado. Por favor, escolha outro horário.");
      return;
    }

    const appointment: Appointment = {
      id: Date.now().toString(),
      date: selectedDate.toISOString(),
      time: selectedTime,
      serviceId: selectedService,
      petName: pet.name,
      petType: pet.type,
      petBreed: pet.breed,
      petAge: pet.age,
      petWeight: pet.weight,
      ownerName: owner.name,
      ownerWhatsapp: owner.whatsapp,
      ownerAddress: owner.address,
      status: 'pending'
    };

    // Save appointment
    const savedAppointments = localStorage.getItem('appointments');
    const appointments = savedAppointments ? JSON.parse(savedAppointments) : [];
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    // Save pet data separately
    const savedPets = localStorage.getItem('customerPets') || '[]';
    const pets = JSON.parse(savedPets);
    
    // Add owner's whatsapp to pet data to associate with the customer
    const petWithOwner = {
      ...pet,
      ownerWhatsapp: owner.whatsapp
    };
    
    if (!pets.find((p: Pet & {ownerWhatsapp?: string}) => 
      p.name === pet.name && p.ownerWhatsapp === owner.whatsapp)) {
      pets.push(petWithOwner);
      localStorage.setItem('customerPets', JSON.stringify(pets));
    }

    // Save owner data separately
    const savedOwners = localStorage.getItem('customers') || '[]';
    const owners = JSON.parse(savedOwners);
    if (!owners.find((o: Owner) => o.whatsapp === owner.whatsapp)) {
      owners.push(owner);
      localStorage.setItem('customers', JSON.stringify(owners));
    }

    toast.success("Agendamento realizado com sucesso!");
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Agendar Serviço</h2>
        
        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Serviço</label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - R$ {service.price.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Data</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedTime(""); // Reset time selection when date changes
                  }}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Horário</label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um horário" />
              </SelectTrigger>
              <SelectContent>
                {availableTimes
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((slot) => {
                    const isBooked = bookedTimeSlots.includes(slot.time);
                    return (
                      <SelectItem 
                        key={slot.id} 
                        value={slot.time} 
                        disabled={isBooked}
                        className={isBooked ? "text-gray-400" : ""}
                      >
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {slot.time} {isBooked && " (Indisponível)"}
                        </div>
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Dados do Pet</h3>
          <div className="grid gap-4">
            <Input
              placeholder="Nome do pet"
              value={pet.name}
              onChange={(e) => setPet({ ...pet, name: e.target.value })}
            />
            <Input
              placeholder="Tipo (ex: Cachorro, Gato)"
              value={pet.type}
              onChange={(e) => setPet({ ...pet, type: e.target.value })}
            />
            <Input
              placeholder="Raça"
              value={pet.breed}
              onChange={(e) => setPet({ ...pet, breed: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Idade"
                value={pet.age}
                onChange={(e) => setPet({ ...pet, age: e.target.value })}
              />
              <Input
                placeholder="Peso (kg)"
                value={pet.weight}
                onChange={(e) => setPet({ ...pet, weight: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Dados do Tutor</h3>
          <div className="grid gap-4">
            <Input
              placeholder="Nome completo"
              value={owner.name}
              onChange={(e) => setOwner({ ...owner, name: e.target.value })}
            />
            <Input
              placeholder="WhatsApp"
              value={owner.whatsapp}
              onChange={(e) => setOwner({ ...owner, whatsapp: e.target.value })}
            />
            <Input
              placeholder="Endereço"
              value={owner.address}
              onChange={(e) => setOwner({ ...owner, address: e.target.value })}
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Confirmar Agendamento
      </Button>
    </form>
  );
};
