import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Service } from "./admin/AdminServices";
import { TimeSlot } from "./admin/AdminAppointments";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ServiceSelection } from "./booking/ServiceSelection";
import { DateTimeSelection } from "./booking/DateTimeSelection";
import { PetInformation } from "./booking/PetInformation";
import { OwnerInformation } from "./booking/OwnerInformation";
import { format } from "date-fns";

interface Pet {
  name: string;
  type: string;
  breed: string;
  age: string;
  weight: string;
  ownerWhatsapp?: string;
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

  const [customerPets, setCustomerPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<any>(null);

  useEffect(() => {
    // Check if there's pre-filled pet data
    const appointmentPetData = localStorage.getItem('appointmentPetData');
    if (appointmentPetData) {
      const petData = JSON.parse(appointmentPetData);
      setPet(petData);
      setSelectedPetId(petData.name);
      localStorage.removeItem('appointmentPetData'); // Clear the data after using it
    }

    // Check if user is logged in
    const savedCustomer = localStorage.getItem('currentCustomer');
    if (savedCustomer) {
      const customer = JSON.parse(savedCustomer);
      setIsLoggedIn(true);
      setCurrentCustomer(customer);
      setOwner({
        name: customer.name || "",
        whatsapp: customer.whatsapp || "",
        address: customer.address || "",
      });

      // Load customer's pets - FIX: Properly load all pets for the current customer
      loadCustomerPets(customer.whatsapp);
    }

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
  }, []);

  // Function to load all pets for a specific customer
  const loadCustomerPets = (customerWhatsapp: string) => {
    const savedPets = localStorage.getItem('customerPets');
    if (savedPets) {
      const allPets = JSON.parse(savedPets);
      // Filter pets that belong to this customer by matching the ownerWhatsapp
      const filteredPets = allPets.filter((pet: Pet & {ownerWhatsapp?: string}) => 
        pet.ownerWhatsapp === customerWhatsapp
      );
      
      console.log(`Found ${filteredPets.length} pets for customer ${customerWhatsapp}`);
      setCustomerPets(filteredPets);
      
      // If pets are found, select the first one by default
      if (filteredPets.length > 0) {
        setPet(filteredPets[0]);
        setSelectedPetId(filteredPets[0].name);
      }
    }
  };

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
          <ServiceSelection 
            services={services}
            selectedService={selectedService}
            onServiceChange={setSelectedService}
          />

          <DateTimeSelection 
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            availableTimes={availableTimes}
            bookedTimeSlots={bookedTimeSlots}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
          />
        </div>

        <PetInformation 
          pet={pet}
          onPetChange={setPet}
          customerPets={customerPets}
          selectedPetId={selectedPetId}
          onPetSelection={handlePetSelection}
          isLoggedIn={isLoggedIn}
        />

        {!isLoggedIn && (
          <OwnerInformation 
            owner={owner}
            onOwnerChange={setOwner}
          />
        )}
      </div>

      <Button type="submit" className="w-full">
        Confirmar Agendamento
      </Button>
    </form>
  );
};
