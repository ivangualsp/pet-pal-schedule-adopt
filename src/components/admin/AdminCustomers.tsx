import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Search, X, Plus } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CustomerDetailsDialog } from "./CustomerDetailsDialog";
import { EditCustomerDialog } from "./EditCustomerDialog";

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

const customerFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  whatsapp: z.string().min(10, "WhatsApp deve ter pelo menos 10 dígitos"),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
});

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof customerFormSchema>>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "",
      whatsapp: "",
      address: "",
    },
  });

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

  const handleEditCustomer = (whatsapp: string, updatedData: any) => {
    const updatedCustomers = customers.map(customer => {
      if (customer.whatsapp === whatsapp) {
        return {
          ...customer,
          ...updatedData
        };
      }
      return customer;
    });
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
  };

  const onSubmit = (data: z.infer<typeof customerFormSchema>) => {
    const newCustomer = {
      name: data.name,
      whatsapp: data.whatsapp,
      address: data.address,
      pets: [],
    };

    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    
    form.reset();
    setShowForm(false);
    
    toast({
      title: "Cliente cadastrado com sucesso!",
      description: `${data.name} foi adicionado à lista de clientes.`
    });
  };

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
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 mr-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar cliente por nome ou telefone"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancelar" : "Novo Cliente"}
          </Button>
        </div>

        {showForm && (
          <Card className="p-4 mb-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do cliente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="Número do WhatsApp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Endereço do cliente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit">Cadastrar Cliente</Button>
                </div>
              </form>
            </Form>
          </Card>
        )}

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
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <EditCustomerDialog
                      customer={customer}
                      onSave={(data) => handleEditCustomer(customer.whatsapp, data)}
                    />
                    <CustomerDetailsDialog customer={customer} />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteCustomer(customer.whatsapp)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
