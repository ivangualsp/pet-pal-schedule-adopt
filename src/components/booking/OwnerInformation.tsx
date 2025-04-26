
import { Input } from "@/components/ui/input";

interface Owner {
  name: string;
  whatsapp: string;
  address: string;
}

interface OwnerInformationProps {
  owner: Owner;
  onOwnerChange: (owner: Owner) => void;
}

export const OwnerInformation = ({
  owner,
  onOwnerChange,
}: OwnerInformationProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dados do Tutor</h3>
      <div className="grid gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome completo</label>
          <Input
            placeholder="Nome completo"
            value={owner.name}
            onChange={(e) => onOwnerChange({ ...owner, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">WhatsApp</label>
          <Input
            placeholder="WhatsApp"
            value={owner.whatsapp}
            onChange={(e) => onOwnerChange({ ...owner, whatsapp: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Endereço</label>
          <Input
            placeholder="Endereço"
            value={owner.address}
            onChange={(e) => onOwnerChange({ ...owner, address: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
