
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { AdminServices } from "@/components/admin/AdminServices";
import { AdminAppointments } from "@/components/admin/AdminAppointments";
import { AdminPets } from "@/components/admin/AdminPets";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'services' | 'appointments' | 'pets'>('services');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Área Administrativa</h1>
        
        <div className="flex gap-2 mb-6">
          <Button 
            variant={activeTab === 'services' ? 'default' : 'outline'}
            onClick={() => setActiveTab('services')}
          >
            Serviços
          </Button>
          <Button 
            variant={activeTab === 'appointments' ? 'default' : 'outline'}
            onClick={() => setActiveTab('appointments')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Agendamentos
          </Button>
          <Button 
            variant={activeTab === 'pets' ? 'default' : 'outline'}
            onClick={() => setActiveTab('pets')}
          >
            Pets para Adoção
          </Button>
        </div>

        {activeTab === 'services' && <AdminServices />}
        {activeTab === 'appointments' && <AdminAppointments />}
        {activeTab === 'pets' && <AdminPets />}
      </div>
    </div>
  );
};

export default Admin;
