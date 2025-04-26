
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Heart, PawPrint } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <PawPrint className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-semibold text-primary">PetPal</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Agendar
            </Button>
            <Button variant="ghost" className="flex items-center">
              <Heart className="mr-2 h-4 w-4" />
              Adoção
            </Button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </Button>
          </div>
        </div>
        
        {isOpen && (
          <div className="md:hidden pb-4">
            <Button variant="ghost" className="w-full flex items-center justify-center mb-2">
              <Calendar className="mr-2 h-4 w-4" />
              Agendar
            </Button>
            <Button variant="ghost" className="w-full flex items-center justify-center">
              <Heart className="mr-2 h-4 w-4" />
              Adoção
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
