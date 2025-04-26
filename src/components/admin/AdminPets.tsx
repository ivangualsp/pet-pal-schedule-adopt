
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

export interface Pet {
  id: string;
  name: string;
  description: string;
  image: string;
  age: string;
  type: string;
}

export const AdminPets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [newPet, setNewPet] = useState<Partial<Pet>>({});

  useEffect(() => {
    const savedPets = localStorage.getItem('pets');
    if (savedPets) {
      setPets(JSON.parse(savedPets));
    }
  }, []);

  const handleSave = () => {
    if (!newPet.name || !newPet.type || !newPet.age) return;

    const pet: Pet = {
      id: Date.now().toString(),
      name: newPet.name,
      description: newPet.description || '',
      image: newPet.image || 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=500&auto=format',
      age: newPet.age,
      type: newPet.type,
    };

    const updatedPets = [...pets, pet];
    setPets(updatedPets);
    localStorage.setItem('pets', JSON.stringify(updatedPets));
    setNewPet({});
  };

  const handleDelete = (id: string) => {
    const updatedPets = pets.filter(pet => pet.id !== id);
    setPets(updatedPets);
    localStorage.setItem('pets', JSON.stringify(updatedPets));
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
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(pet.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-sm text-gray-600">{pet.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
