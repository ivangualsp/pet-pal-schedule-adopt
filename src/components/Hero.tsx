import { Button } from "@/components/ui/button";
import { Calendar, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-secondary to-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Cuidado e Carinho para seu Pet
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Agendamento de serviços e adoção responsável em um só lugar.
            Confie seu pet aos melhores profissionais.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-accent hover:bg-accent/90" size="lg" asChild>
              <Link to="/booking">
                <Calendar className="mr-2 h-5 w-5" />
                Agendar Serviço
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/admin">
                <Settings className="mr-2 h-5 w-5" />
                Área Admin
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
