
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, X, User, Syringe, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface Pet {
  id: string;
  name: string;
  type: string;
  breed?: string;
  age: string;
  weight?: string;
  ownerId: string;
  ownerName: string;
  ownerWhatsapp: string;
  notes?: string;
}

interface Vaccine {
  id: string;
  petId: string;
  name: string;
  date: string;
  nextDate: string;
  notes?: string;
}

export const AdminClientPets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [newPet, setNewPet] = useState<Partial<Pet>>({});
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [newVaccine, setNewVaccine] = useState<Partial<Vaccine>>({});
  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");

  useEffect(() => {
    const savedPets = localStorage.getItem('clientPets');
    const savedVaccines = localStorage.getItem('petVaccines');
    const savedCustomers = localStorage.getItem('customers');

    if (savedPets) setPets(JSON.parse(savedPets));
    if (savedVaccines) setVaccines(JSON.parse(savedVaccines));
    if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
  }, []);

  const handleSave = () => {
    if (!newPet.name || !newPet.type || !newPet.age || !selectedCustomer) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const owner = customers.find(c => c.whatsapp === selectedCustomer);
    if (!owner) {
      toast.error("Cliente não encontrado");
      return;
    }

    const pet: Pet = {
      id: Date.now().toString(),
      name: newPet.name,
      type: newPet.type,
      breed: newPet.breed,
      age: newPet.age,
      weight: newPet.weight,
      ownerId: owner.id || owner.whatsapp,
      ownerName: owner.name,
      ownerWhatsapp: owner.whatsapp,
      notes: newPet.notes
    };

    const updatedPets = [...pets, pet];
    setPets(updatedPets);
    localStorage.setItem('clientPets', JSON.stringify(updatedPets));
    setNewPet({});
    setSelectedCustomer("");
    toast.success("Pet cadastrado com sucesso!");
  };

  const handleUpdatePet = (updatedPet: Pet) => {
    const updatedPets = pets.map(pet => 
      pet.id === updatedPet.id ? updatedPet : pet
    );
    setPets(updatedPets);
    localStorage.setItem('clientPets', JSON.stringify(updatedPets));

    // Update appointments to reflect pet changes
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updatedAppointments = appointments.map((apt: any) => {
      if (apt.ownerWhatsapp === updatedPet.ownerWhatsapp && 
          apt.petName === editingPet?.name) {
        return {
          ...apt,
          petName: updatedPet.name,
          petType: updatedPet.type,
          petBreed: updatedPet.breed,
          petAge: updatedPet.age,
          petWeight: updatedPet.weight,
        };
      }
      return apt;
    });
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    
    setEditingPet(null);
    toast.success("Pet atualizado com sucesso!");
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
    localStorage.setItem('clientPets', JSON.stringify(updatedPets));

    const updatedVaccines = vaccines.filter(vaccine => vaccine.petId !== id);
    setVaccines(updatedVaccines);
    localStorage.setItem('petVaccines', JSON.stringify(updatedVaccines));
    toast.success("Pet removido com sucesso!");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Cadastrar Pet do Cliente</h3>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pet-name">Nome do pet</Label>
              <Input
                id="pet-name"
                placeholder="Nome do pet"
                value={newPet.name || ''}
                onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pet-type">Tipo de animal</Label>
              <Input
                id="pet-type"
                placeholder="Tipo (ex: Cachorro, Gato)"
                value={newPet.type || ''}
                onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pet-breed">Raça</Label>
              <Input
                id="pet-breed"
                placeholder="Raça"
                value={newPet.breed || ''}
                onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pet-age">Idade</Label>
              <Input
                id="pet-age"
                placeholder="Idade"
                value={newPet.age || ''}
                onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pet-weight">Peso (kg)</Label>
              <Input
                id="pet-weight"
                placeholder="Peso (kg)"
                type="number"
                value={newPet.weight || ''}
                onChange={(e) => setNewPet({ ...newPet, weight: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pet-owner">Cliente</Label>
            <select
              id="pet-owner"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
            >
              <option value="">Selecione o cliente</option>
              {customers.map((customer) => (
                <option key={customer.whatsapp} value={customer.whatsapp}>
                  {customer.name} ({customer.whatsapp})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pet-notes">Observações</Label>
            <Textarea
              id="pet-notes"
              placeholder="Observações"
              value={newPet.notes || ''}
              onChange={(e) => setNewPet({ ...newPet, notes: e.target.value })}
            />
          </div>
          <Button onClick={handleSave}>
            <Plus className="mr-2 h-4 w-4" />
            Cadastrar Pet
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <Card key={pet.id} className="p-4">
            {editingPet?.id === pet.id ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`edit-name-${pet.id}`}>Nome do pet</Label>
                  <Input
                    id={`edit-name-${pet.id}`}
                    placeholder="Nome do pet"
                    value={editingPet.name}
                    onChange={(e) => setEditingPet({ ...editingPet, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`edit-type-${pet.id}`}>Tipo de animal</Label>
                  <Input
                    id={`edit-type-${pet.id}`}
                    placeholder="Tipo (ex: Cachorro, Gato)"
                    value={editingPet.type}
                    onChange={(e) => setEditingPet({ ...editingPet, type: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`edit-breed-${pet.id}`}>Raça</Label>
                  <Input
                    id={`edit-breed-${pet.id}`}
                    placeholder="Raça"
                    value={editingPet.breed}
                    onChange={(e) => setEditingPet({ ...editingPet, breed: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`edit-age-${pet.id}`}>Idade</Label>
                  <Input
                    id={`edit-age-${pet.id}`}
                    placeholder="Idade"
                    value={editingPet.age}
                    onChange={(e) => setEditingPet({ ...editingPet, age: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`edit-weight-${pet.id}`}>Peso (kg)</Label>
                  <Input
                    id={`edit-weight-${pet.id}`}
                    placeholder="Peso (kg)"
                    value={editingPet.weight}
                    onChange={(e) => setEditingPet({ ...editingPet, weight: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleUpdatePet(editingPet)}>
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={() => setEditingPet(null)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{pet.name}</h4>
                  <p className="text-sm text-gray-600">{pet.type} • {pet.age}</p>
                  {pet.breed && <p className="text-sm text-gray-600">Raça: {pet.breed}</p>}
                  {pet.weight && <p className="text-sm text-gray-600">Peso: {pet.weight}kg</p>}
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-2">
                    <User className="h-4 w-4" />
                    {pet.ownerName}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setEditingPet(pet)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
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
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
