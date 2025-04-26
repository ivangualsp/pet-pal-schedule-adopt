
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dog, Package, Gift } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: <Dog className="h-8 w-8 text-primary" />,
      title: "Banho e Tosa",
      description: "Cuidados completos para a higiene e beleza do seu pet",
    },
    {
      icon: <Package className="h-8 w-8 text-primary" />,
      title: "Pet Shop",
      description: "Produtos de qualidade para o bem-estar do seu animal",
    },
    {
      icon: <Gift className="h-8 w-8 text-primary" />,
      title: "Adoção",
      description: "Encontre um novo amigo e faça parte de uma história de amor",
    },
  ];

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Nossos Serviços</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">{service.icon}</div>
                <CardTitle className="text-center">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
