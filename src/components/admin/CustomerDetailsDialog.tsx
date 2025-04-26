
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { Pet } from './AdminCustomers';

interface CustomerDetailsProps {
  customer: {
    name: string;
    whatsapp: string;
    address: string;
    pets: Pet[];
  };
}

export const CustomerDetailsDialog = ({ customer }: CustomerDetailsProps) => {
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

          {customer.pets.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Pets do Cliente</h3>
              <div className="grid gap-4">
                {customer.pets.map((pet, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <h4 className="font-medium">{pet.name}</h4>
                    <p className="text-sm text-gray-600">
                      {pet.type} {pet.breed && `• ${pet.breed}`}
                    </p>
                    {pet.age && <p className="text-sm text-gray-600">Idade: {pet.age}</p>}
                    {pet.weight && <p className="text-sm text-gray-600">Peso: {pet.weight}kg</p>}
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
