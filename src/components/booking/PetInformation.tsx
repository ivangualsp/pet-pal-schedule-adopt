
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Pet {
  name: string;
  type: string;
  breed: string;
  age: string;
  weight: string;
  ownerWhatsapp?: string;
}

interface PetInformationProps {
  pet: Pet;
  onPetChange: (pet: Pet) => void;
  customerPets: Pet[];
  selectedPetId: string;
  onPetSelection: (petName: string) => void;
  isLoggedIn: boolean;
}

export const PetInformation = ({
  pet,
  onPetChange,
  customerPets,
  selectedPetId,
  onPetSelection,
  isLoggedIn,
}: PetInformationProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dados do Pet</h3>
      
      {isLoggedIn && customerPets.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Selecionar Pet</label>
          <Select value={selectedPetId} onValueChange={onPetSelection}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um pet" />
            </SelectTrigger>
            <SelectContent>
              {customerPets.map((pet) => (
                <SelectItem key={pet.name} value={pet.name}>
                  {pet.name} ({pet.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome do Pet</label>
          <Input
            placeholder="Nome do pet"
            value={pet.name}
            onChange={(e) => onPetChange({ ...pet, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo</label>
          <Input
            placeholder="Tipo (ex: Cachorro, Gato)"
            value={pet.type}
            onChange={(e) => onPetChange({ ...pet, type: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Raça</label>
          <Input
            placeholder="Raça"
            value={pet.breed}
            onChange={(e) => onPetChange({ ...pet, breed: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Idade</label>
            <Input
              placeholder="Idade"
              value={pet.age}
              onChange={(e) => onPetChange({ ...pet, age: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Peso (kg)</label>
            <Input
              placeholder="Peso (kg)"
              value={pet.weight}
              onChange={(e) => onPetChange({ ...pet, weight: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
