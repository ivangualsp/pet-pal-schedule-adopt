
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState<Partial<Service>>({});

  useEffect(() => {
    const savedServices = localStorage.getItem('services');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }
  }, []);

  const handleSave = () => {
    if (!newService.name || !newService.price || !newService.duration) return;
    
    const service: Service = {
      id: Date.now().toString(),
      name: newService.name,
      description: newService.description || '',
      price: Number(newService.price),
      duration: Number(newService.duration),
    };

    const updatedServices = [...services, service];
    setServices(updatedServices);
    localStorage.setItem('services', JSON.stringify(updatedServices));
    setNewService({});
  };

  const handleDelete = (id: string) => {
    const updatedServices = services.filter(service => service.id !== id);
    setServices(updatedServices);
    localStorage.setItem('services', JSON.stringify(updatedServices));
  };

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Adicionar Novo Serviço</h3>
        <div className="grid gap-4">
          <Input
            placeholder="Nome do serviço"
            value={newService.name || ''}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          />
          <Textarea
            placeholder="Descrição"
            value={newService.description || ''}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Preço (R$)"
              value={newService.price || ''}
              onChange={(e) => setNewService({ ...newService, price: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Duração (minutos)"
              value={newService.duration || ''}
              onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
            />
          </div>
          <Button onClick={handleSave}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Serviço
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="bg-card p-4 rounded-lg shadow flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{service.name}</h4>
              <p className="text-sm text-gray-600">{service.description}</p>
              <div className="mt-2 text-sm">
                <span className="text-accent">R$ {service.price.toFixed(2)}</span>
                <span className="mx-2">•</span>
                <span>{service.duration} minutos</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
