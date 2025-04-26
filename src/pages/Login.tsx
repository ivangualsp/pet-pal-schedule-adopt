
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [whatsapp, setWhatsapp] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const savedCustomers = localStorage.getItem('customers');
    if (!savedCustomers) {
      toast.error("Cliente não encontrado");
      return;
    }

    const customers = JSON.parse(savedCustomers);
    const customer = customers.find((c: any) => c.whatsapp === whatsapp);

    if (!customer) {
      toast.error("Cliente não encontrado");
      return;
    }

    localStorage.setItem('currentCustomer', JSON.stringify(customer));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="WhatsApp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
