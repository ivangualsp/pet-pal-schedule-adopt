
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Search, X } from "lucide-react";

interface Customer {
  name: string;
  whatsapp: string;
  address: string;
  pets: Pet[];
}

interface Pet {
  name: string;
  type: string;
  breed: string;
  age: string;
  weight: string;
}

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    // Get customers from local storage
    const loadCustomers = () => {
      const savedCustomers = localStorage.getItem('customers');
      if (savedCustomers) {
        try {
          return JSON.parse(savedCustomers);
        } catch (error) {
          console.error("Error parsing customers data:", error);
          return [];
        }
      }
      return [];
    };

    // Get customer pets from local storage
    const loadCustomerPets = () => {
      const savedPets = localStorage.getItem('customerPets');
      if (savedPets) {
        try {
          return JSON.parse(savedPets);
        } catch (error) {
          console.error("Error parsing customer pets data:", error);
          return [];
        }
      }
      return [];
    };

    // Get all appointments to associate pets with owners
    const loadAppointments = () => {
      const savedAppointments = localStorage.getItem('appointments');
      if (savedAppointments) {
        try {
          return JSON.parse(savedAppointments);
        } catch (error) {
          console.error("Error parsing appointments data:", error);
          return [];
        }
      }
      return [];
    };

    const rawCustomers = loadCustomers();
    const customerPets = loadCustomerPets();
    const appointments = loadAppointments();

    // Build the full customer data with their pets
    const fullCustomers = rawCustomers.map((customer: any) => {
      // Find all appointments for this customer
      const customerAppointments = appointments.filter((apt: any) => 
        apt.owner?.name === customer.name && apt.owner?.whatsapp === customer.whatsapp
      );
      
      // Get all unique pets for this customer from appointments
      const pets = customerAppointments.reduce((acc: Pet[], apt: any) => {
        if (apt.pet && !acc.some(p => p.name === apt.pet.name)) {
          acc.push({
            name: apt.pet.name,
            type: apt.pet.type || '',
            breed: apt.pet.breed || '',
            age: apt.pet.age || '',
            weight: apt.pet.weight || ''
          });
        }
        return acc;
      }, []);

      return {
        name: customer.name,
        whatsapp: customer.whatsapp,
        address: customer.address || '',
        pets: pets
      };
    });

    setCustomers(fullCustomers);
  }, []);

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.whatsapp.includes(searchTerm)
  );

  const handleDeleteCustomer = (whatsapp: string) => {
    const updatedCustomers = customers.filter(customer => customer.whatsapp !== whatsapp);
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar cliente por nome ou telefone"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum cliente encontrado</p>
        ) : (
          <div className="space-y-4">
            {filteredCustomers.map((customer, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{customer.name}</h3>
                      <p className="text-sm text-gray-600">{customer.whatsapp}</p>
                      {customer.address && <p className="text-sm text-gray-600">{customer.address}</p>}
                      
                      {customer.pets.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium">Pets:</h4>
                          <ul className="mt-1 space-y-1">
                            {customer.pets.map((pet, petIndex) => (
                              <li key={petIndex} className="text-sm">
                                {pet.name} • {pet.type} {pet.breed && `• ${pet.breed}`} 
                                {pet.age && `• ${pet.age}`} {pet.weight && `• ${pet.weight}kg`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteCustomer(customer.whatsapp)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
