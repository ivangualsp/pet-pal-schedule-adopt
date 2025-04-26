
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, User, Dog } from "lucide-react";
import { AdminServices } from "@/components/admin/AdminServices";
import { AdminAppointments } from "@/components/admin/AdminAppointments";
import { AdminPets } from "@/components/admin/AdminPets";
import { AdminCustomers } from "@/components/admin/AdminCustomers";
import { AdminClientPets } from "@/components/admin/AdminClientPets";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'services' | 'appointments' | 'adoption-pets' | 'customers' | 'client-pets'>('services');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Área Administrativa</h1>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={activeTab === 'services' ? 'default' : 'outline'}
            onClick={() => setActiveTab('services')}
          >
            Serviços
          </Button>
          <Button 
            variant={activeTab === 'appointments' ? 'default' : 'outline'}
            onClick={() => setActiveTab('appointments')}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Agendamentos
          </Button>
          <Button 
            variant={activeTab === 'adoption-pets' ? 'default' : 'outline'}
            onClick={() => setActiveTab('adoption-pets')}
            className="flex items-center gap-2"
          >
            <Dog className="h-4 w-4" />
            Pets para Adoção
          </Button>
          <Button 
            variant={activeTab === 'client-pets' ? 'default' : 'outline'}
            onClick={() => setActiveTab('client-pets')}
            className="flex items-center gap-2"
          >
            <Dog className="h-4 w-4" />
            Pets dos Clientes
          </Button>
          <Button 
            variant={activeTab === 'customers' ? 'default' : 'outline'}
            onClick={() => setActiveTab('customers')}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Clientes
          </Button>
        </div>

        {activeTab === 'services' && <AdminServices />}
        {activeTab === 'appointments' && <AdminAppointments />}
        {activeTab === 'adoption-pets' && <AdminPets />}
        {activeTab === 'customers' && <AdminCustomers />}
        {activeTab === 'client-pets' && <AdminClientPets />}
      </div>
    </div>
  );
};

export default Admin;
