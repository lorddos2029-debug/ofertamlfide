import { ChevronRight, Menu, ShoppingCart, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const tires = [
  { aro: 13, label: "Pneu Aro 13 Pirelli" },
  { aro: 14, label: "Pneu Aro 14 Pirelli" },
  { aro: 15, label: "Pneu Aro 15 Pirelli" },
  { aro: 16, label: "Pneu Aro 16 Pirelli" },
  { aro: 17, label: "Pneu Aro 17 Pirelli" },
  { aro: 18, label: "Pneu Aro 18 Pirelli" },
];

const Pneus = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#ffe600] px-4 py-3 flex items-center justify-between">
        <Menu className="w-6 h-6 text-[#333]" />
        <span className="text-[#333] font-bold text-base tracking-wide">MERCADO LIVRE OFERTAS</span>
        <ShoppingCart className="w-6 h-6 text-[#333]" />
      </div>

      {/* Title */}
      <div className="px-4 pt-5 pb-2">
        <h1 className="text-xl font-bold text-[#333]">Esquenta Carnaval</h1>
      </div>

      {/* Product List */}
      <div className="px-4 flex flex-col gap-4 pb-8">
        {tires.map((tire) => (
          <Link
            key={tire.aro}
            to={`/pneus/aro${tire.aro}`}
            className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4 active:bg-gray-50 transition-colors"
          >
            <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
              <img
                src="/images/pneu-pirelli.png"
                alt={tire.label}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base text-[#333]">
                Pneu Aro <span className="font-bold">{tire.aro}</span> Pirelli
              </p>
              <p className="text-sm mt-1">
                <span className="text-[#00a650] font-medium">Frete grátis </span>
                <span className="font-black text-[#00a650]">FULL</span>
                <Zap className="inline w-3.5 h-3.5 text-[#00a650] ml-0.5 -mt-0.5" fill="#00a650" />
              </p>
            </div>
            <ChevronRight className="w-6 h-6 text-[#3483fa] flex-shrink-0" />
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-4 py-6 text-center">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-[#333] mb-3">
          <span>Minha conta</span>
          <span>Compras</span>
          <span>Histórico</span>
          <span>Favoritos</span>
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-[#333] mb-4">
          <span>Categorias</span>
          <span>Ofertas do dia</span>
          <span>Vender</span>
          <span>Contato</span>
        </div>
        <p className="text-xs text-gray-500 mb-2">
          Termos e condições · Como cuidamos da sua privacidade · Acessibilidade
        </p>
        <p className="text-xs text-gray-400 italic mb-1">
          Copyright © 1999-2024 Ebazar.com.br LTDA.
        </p>
        <p className="text-xs text-gray-400 italic leading-relaxed">
          CNPJ n.º 03.007.331/0001-41 / Av. das Nações Unidas, nº 3.003, Bonfim, Osasco/SP - CEP 06233-903 - empresa do grupo Mercado Livre.
        </p>
      </div>
    </div>
  );
};

export default Pneus;
