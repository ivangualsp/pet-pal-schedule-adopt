
import { Service } from "../admin/AdminServices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ServiceSelectionProps {
  services: Service[];
  selectedService: string;
  onServiceChange: (value: string) => void;
}

export const ServiceSelection = ({
  services,
  selectedService,
  onServiceChange,
}: ServiceSelectionProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Serviço</label>
      <Select value={selectedService} onValueChange={onServiceChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um serviço" />
        </SelectTrigger>
        <SelectContent>
          {services.map((service) => (
            <SelectItem key={service.id} value={service.id}>
              {service.name} - R$ {service.price.toFixed(2)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
