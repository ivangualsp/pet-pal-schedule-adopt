import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Pencil, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";

// Define Pet interface here to avoid import issues
export interface Pet {
  name: string;
  type: string;
  breed: string;
  age: string;
  weight: string;
}

interface CustomerDetailsProps {
  customer: {
    name: string;
    whatsapp: string;
    address: string;
    pets: Pet[];
  };
}

export const CustomerDetailsDialog = ({ customer }: CustomerDetailsProps) => {
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [localPets, setLocalPets] = useState<Pet[]>(customer.pets || []);
  const [showNewPetForm, setShowNewPetForm] = useState(false);
  const [newPet, setNewPet] = useState<Pet>({
    name: '',
    type: '',
    breed: '',
    age: '',
    weight: ''
  });

  const handleSavePet = (updatedPet: Pet, index: number) => {
    const updatedPets = [...localPets];
    updatedPets[index] = updatedPet;
    setLocalPets(updatedPets);

    // Update pets in localStorage
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updatedAppointments = appointments.map((apt: any) => {
      if (apt.owner?.whatsapp === customer.whatsapp && 
          apt.pet?.name === editingPet?.name) {
        return {
          ...apt,
          petName: updatedPet.name,
          petType: updatedPet.type,
          petBreed: updatedPet.breed,
          petAge: updatedPet.age,
          petWeight: updatedPet.weight,
          pet: updatedPet
        };
      }
      return apt;
    });
    
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    setEditingPet(null);
    toast.success("Pet atualizado com sucesso!");
  };

  const handleAddNewPet = () => {
    if (!newPet.name || !newPet.type || !newPet.age) {
      toast.error("Por favor, preencha os campos obrigatórios");
      return;
    }

    // Update pets in both localStorage locations
    const clientPets = JSON.parse(localStorage.getItem('clientPets') || '[]');
    const newClientPet = {
      ...newPet,
      id: Date.now().toString(),
      ownerId: customer.whatsapp,
      ownerName: customer.name,
      ownerWhatsapp: customer.whatsapp
    };
    
    const updatedClientPets = [...clientPets, newClientPet];
    localStorage.setItem('clientPets', JSON.stringify(updatedClientPets));

    // Update customer pets in appointments
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updatedAppointments = appointments.map((apt: any) => {
      if (apt.ownerWhatsapp === customer.whatsapp) {
        return {
          ...apt,
          ownerPets: [...(apt.ownerPets || []), newPet]
        };
      }
      return apt;
    });
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    // Update local state
    setLocalPets([...localPets, newPet]);
    setNewPet({
      name: '',
      type: '',
      breed: '',
      age: '',
      weight: ''
    });
    setShowNewPetForm(false);
    toast.success("Pet cadastrado com sucesso!");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <FileText className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico do Cliente</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Dados do Cliente</h3>
            <p className="text-sm text-gray-600">Nome: {customer.name}</p>
            <p className="text-sm text-gray-600">WhatsApp: {customer.whatsapp}</p>
            <p className="text-sm text-gray-600">Endereço: {customer.address}</p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Pets do Cliente</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowNewPetForm(!showNewPetForm)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Pet
              </Button>
            </div>

            {showNewPetForm && (
              <div className="border p-4 rounded-lg mb-4 space-y-4">
                <FormItem>
                  <FormLabel>Nome do Pet</FormLabel>
                  <Input
                    value={newPet.name}
                    onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                    placeholder="Nome do pet"
                  />
                </FormItem>
                <FormItem>
                  <FormLabel>Tipo de Animal</FormLabel>
                  <Input
                    value={newPet.type}
                    onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
                    placeholder="Tipo (ex: Cachorro, Gato)"
                  />
                </FormItem>
                <FormItem>
                  <FormLabel>Raça</FormLabel>
                  <Input
                    value={newPet.breed}
                    onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                    placeholder="Raça"
                  />
                </FormItem>
                <FormItem>
                  <FormLabel>Idade</FormLabel>
                  <Input
                    value={newPet.age}
                    onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                    placeholder="Idade"
                  />
                </FormItem>
                <FormItem>
                  <FormLabel>Peso (kg)</FormLabel>
                  <Input
                    value={newPet.weight}
                    onChange={(e) => setNewPet({ ...newPet, weight: e.target.value })}
                    placeholder="Peso (kg)"
                  />
                </FormItem>
                <div className="flex gap-2">
                  <Button onClick={handleAddNewPet}>
                    Cadastrar Pet
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewPetForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {localPets.map((pet, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  {editingPet === pet ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nome do Pet</label>
                        <Input
                          value={editingPet.name}
                          onChange={(e) => setEditingPet({ ...editingPet, name: e.target.value })}
                          placeholder="Nome do pet"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tipo de Animal</label>
                        <Input
                          value={editingPet.type}
                          onChange={(e) => setEditingPet({ ...editingPet, type: e.target.value })}
                          placeholder="Tipo (ex: Cachorro, Gato)"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Raça</label>
                        <Input
                          value={editingPet.breed}
                          onChange={(e) => setEditingPet({ ...editingPet, breed: e.target.value })}
                          placeholder="Raça"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Idade</label>
                        <Input
                          value={editingPet.age}
                          onChange={(e) => setEditingPet({ ...editingPet, age: e.target.value })}
                          placeholder="Idade"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Peso (kg)</label>
                        <Input
                          value={editingPet.weight}
                          onChange={(e) => setEditingPet({ ...editingPet, weight: e.target.value })}
                          placeholder="Peso (kg)"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleSavePet(editingPet, index)}>
                          Salvar
                        </Button>
                        <Button variant="outline" onClick={() => setEditingPet(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={() => setEditingPet(pet)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <h4 className="font-medium">{pet.name}</h4>
                      <p className="text-sm text-gray-600">
                        {pet.type} {pet.breed && `• ${pet.breed}`}
                      </p>
                      {pet.age && <p className="text-sm text-gray-600">Idade: {pet.age}</p>}
                      {pet.weight && <p className="text-sm text-gray-600">Peso: {pet.weight}kg</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
