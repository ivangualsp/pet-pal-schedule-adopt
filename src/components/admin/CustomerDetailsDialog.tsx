
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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

          {localPets && localPets.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Pets do Cliente</h3>
              <div className="grid gap-4">
                {localPets.map((pet, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    {editingPet === pet ? (
                      <div className="space-y-4">
                        <Input
                          value={editingPet.name}
                          onChange={(e) => setEditingPet({ ...editingPet, name: e.target.value })}
                          placeholder="Nome do pet"
                          className="mb-2"
                        />
                        <Input
                          value={editingPet.type}
                          onChange={(e) => setEditingPet({ ...editingPet, type: e.target.value })}
                          placeholder="Tipo (ex: Cachorro, Gato)"
                          className="mb-2"
                        />
                        <Input
                          value={editingPet.breed}
                          onChange={(e) => setEditingPet({ ...editingPet, breed: e.target.value })}
                          placeholder="Raça"
                          className="mb-2"
                        />
                        <Input
                          value={editingPet.age}
                          onChange={(e) => setEditingPet({ ...editingPet, age: e.target.value })}
                          placeholder="Idade"
                          className="mb-2"
                        />
                        <Input
                          value={editingPet.weight}
                          onChange={(e) => setEditingPet({ ...editingPet, weight: e.target.value })}
                          placeholder="Peso (kg)"
                          className="mb-2"
                        />
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
