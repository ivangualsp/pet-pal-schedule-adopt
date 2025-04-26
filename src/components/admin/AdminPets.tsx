
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, X, User, Syringe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export interface Pet {
  id: string;
  name: string;
  description: string;
  image: string;
  age: string;
  type: string;
  ownerWhatsapp?: string;
  ownerName?: string;
}

interface Vaccine {
  id: string;
  petId: string;
  name: string;
  date: string;
  nextDate: string;
  notes?: string;
}

export const AdminPets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [newPet, setNewPet] = useState<Partial<Pet>>({});
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [newVaccine, setNewVaccine] = useState<Partial<Vaccine>>({});
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>("");

  useEffect(() => {
    const savedPets = localStorage.getItem('pets');
    const savedVaccines = localStorage.getItem('petVaccines');
    const savedCustomers = localStorage.getItem('customers');

    if (savedPets) setPets(JSON.parse(savedPets));
    if (savedVaccines) setVaccines(JSON.parse(savedVaccines));
    if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
  }, []);

  const handleSave = () => {
    if (!newPet.name || !newPet.type || !newPet.age || !newPet.ownerWhatsapp) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const owner = customers.find(c => c.whatsapp === newPet.ownerWhatsapp);
    if (!owner) {
      toast.error("Cliente não encontrado");
      return;
    }

    const pet: Pet = {
      id: Date.now().toString(),
      name: newPet.name,
      description: newPet.description || '',
      image: newPet.image || 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=500&auto=format',
      age: newPet.age,
      type: newPet.type,
      ownerWhatsapp: newPet.ownerWhatsapp,
      ownerName: owner.name
    };

    const updatedPets = [...pets, pet];
    setPets(updatedPets);
    localStorage.setItem('pets', JSON.stringify(updatedPets));
    setNewPet({});
    toast.success("Pet cadastrado com sucesso!");
  };

  const handleAddVaccine = () => {
    if (!newVaccine.name || !newVaccine.date || !newVaccine.nextDate || !selectedPetId) {
      toast.error("Por favor, preencha todos os campos da vacina");
      return;
    }

    const vaccine: Vaccine = {
      id: Date.now().toString(),
      petId: selectedPetId,
      name: newVaccine.name,
      date: newVaccine.date,
      nextDate: newVaccine.nextDate,
      notes: newVaccine.notes
    };

    const updatedVaccines = [...vaccines, vaccine];
    setVaccines(updatedVaccines);
    localStorage.setItem('petVaccines', JSON.stringify(updatedVaccines));
    setNewVaccine({});
    toast.success("Vacina registrada com sucesso!");
  };

  const handleDelete = (id: string) => {
    const updatedPets = pets.filter(pet => pet.id !== id);
    setPets(updatedPets);
    localStorage.setItem('pets', JSON.stringify(updatedPets));

    // Remove as vacinas associadas ao pet
    const updatedVaccines = vaccines.filter(vaccine => vaccine.petId !== id);
    setVaccines(updatedVaccines);
    localStorage.setItem('petVaccines', JSON.stringify(updatedVaccines));
    toast.success("Pet removido com sucesso!");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Adicionar Novo Pet</h3>
        <div className="grid gap-4">
          <Input
            placeholder="Nome do pet"
            value={newPet.name || ''}
            onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
          />
          <Textarea
            placeholder="Descrição"
            value={newPet.description || ''}
            onChange={(e) => setNewPet({ ...newPet, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Idade"
              value={newPet.age || ''}
              onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
            />
            <Input
              placeholder="Tipo (ex: Cachorro, Gato)"
              value={newPet.type || ''}
              onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
            />
          </div>
          <Input
            placeholder="WhatsApp do cliente"
            value={newPet.ownerWhatsapp || ''}
            onChange={(e) => setNewPet({ ...newPet, ownerWhatsapp: e.target.value })}
          />
          <Input
            placeholder="URL da imagem"
            value={newPet.image || ''}
            onChange={(e) => setNewPet({ ...newPet, image: e.target.value })}
          />
          <Button onClick={handleSave}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Pet
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <Card key={pet.id} className="overflow-hidden">
            <img
              src={pet.image}
              alt={pet.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{pet.name}</h4>
                  <p className="text-sm text-gray-600">{pet.type} • {pet.age}</p>
                  {pet.ownerName && (
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {pet.ownerName}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setSelectedPetId(pet.id)}
                      >
                        <Syringe className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Registrar Vacina - {pet.name}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Input
                          placeholder="Nome da vacina"
                          value={newVaccine.name || ''}
                          onChange={(e) => setNewVaccine({ ...newVaccine, name: e.target.value })}
                        />
                        <Input
                          type="date"
                          placeholder="Data da aplicação"
                          value={newVaccine.date || ''}
                          onChange={(e) => setNewVaccine({ ...newVaccine, date: e.target.value })}
                        />
                        <Input
                          type="date"
                          placeholder="Data da próxima dose"
                          value={newVaccine.nextDate || ''}
                          onChange={(e) => setNewVaccine({ ...newVaccine, nextDate: e.target.value })}
                        />
                        <Textarea
                          placeholder="Observações"
                          value={newVaccine.notes || ''}
                          onChange={(e) => setNewVaccine({ ...newVaccine, notes: e.target.value })}
                        />
                        <Button onClick={handleAddVaccine}>
                          Registrar Vacina
                        </Button>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {vaccines
                          .filter(v => v.petId === pet.id)
                          .map(vaccine => (
                            <div key={vaccine.id} className="mb-2 p-2 bg-accent/10 rounded-md">
                              <p className="font-medium">{vaccine.name}</p>
                              <p className="text-sm text-gray-600">
                                Aplicada: {new Date(vaccine.date).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                Próxima: {new Date(vaccine.nextDate).toLocaleDateString()}
                              </p>
                              {vaccine.notes && (
                                <p className="text-sm text-gray-600 mt-1">{vaccine.notes}</p>
                              )}
                            </div>
                          ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(pet.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">{pet.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
