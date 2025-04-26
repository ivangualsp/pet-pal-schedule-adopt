
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export const Adoption = () => {
  const pets = [
    {
      name: "Luna",
      image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=500&auto=format",
      age: "2 anos",
      type: "Cachorro",
    },
    {
      name: "Thor",
      image: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=500&auto=format",
      age: "6 meses",
      type: "Gato",
    },
    {
      name: "Bob",
      image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=500&auto=format",
      age: "1 ano",
      type: "Cachorro",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Adoção</h2>
          <p className="text-gray-600 mb-8">
            Conheça nossos amigos que estão à procura de um lar amoroso
          </p>
          <Button variant="outline" className="mb-8">
            <Heart className="mr-2 h-4 w-4" />
            Cadastrar Pet para Adoção
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pets.map((pet) => (
            <Card key={pet.name} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="pt-4">
                <CardTitle className="text-xl mb-2">{pet.name}</CardTitle>
                <p className="text-gray-600">{pet.type} • {pet.age}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="secondary">
                  <Heart className="mr-2 h-4 w-4" />
                  Conhecer
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
