import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Menu, Search, ShoppingCart, CreditCard, Package, Shield } from "lucide-react";
import { useState } from "react";
import { getAroData } from "@/data/pneusData";

const paymentSlides = [
  {
    icon: <CreditCard size={36} className="text-[#3483fa]" />,
    title: "Escolha como pagar",
    desc: "Com Mercado Pago, você paga com cartão, boleto ou Pix.",
    link: "Como pagar com Mercado Pago",
  },
  {
    icon: <Package size={36} className="text-[#3483fa]" />,
    title: "Frete grátis a partir de R$ 19",
    desc: "Ao se cadastrar no Mercado Livre, você tem frete grátis em milhares de produtos.",
  },
  {
    icon: <Shield size={36} className="text-[#3483fa]" />,
    title: "Segurança, do início ao fim",
    desc: "Você não gostou do que comprou? Devolva! No Mercado Livre não há nada que você não possa fazer.",
  },
];

const PaymentCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [touchX, setTouchX] = useState(0);

  return (
    <div>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {paymentSlides.map((item, i) => (
            <div key={i} className="min-w-full text-center px-8 py-2"
              onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                const diff = touchX - e.changedTouches[0].clientX;
                if (diff > 50 && current < paymentSlides.length - 1) setCurrent(current + 1);
                if (diff < -50 && current > 0) setCurrent(current - 1);
              }}
            >
              <div className="flex justify-center mb-3">{item.icon}</div>
              <h3 className="text-[15px] font-semibold text-[#333] mb-1">{item.title}</h3>
              <p className="text-[13px] text-[#999] leading-snug">{item.desc}</p>
              {item.link && (
                <button className="text-[#3483fa] text-[13px] font-medium mt-2">{item.link}</button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-[6px] mt-2">
        {paymentSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-[7px] h-[7px] rounded-full ${i === current ? "bg-[#3483fa]" : "bg-[#ddd]"}`}
          />
        ))}
      </div>
    </div>
  );
};

const AroListing = () => {
  const { aro } = useParams<{ aro: string }>();
  const aroNum = parseInt((aro || "aro13").replace("aro", ""));
  const data = getAroData(aroNum);

  if (!data) {
    return <div className="p-8 text-center">Aro não encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-[#ededed] max-w-[480px] mx-auto">
      {/* Header ML */}
      <header className="bg-[#ffe600] sticky top-0 z-50">
        <div className="flex items-center justify-between px-3 py-2">
          <Menu size={22} className="text-[#333]" />
          <img
            src="/e7b320f4-9a9c-45e1-8f2e-d116c127d186.png"
            alt="Mercado Livre"
            className="h-[34px]"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <ShoppingCart size={22} className="text-[#333]" />
        </div>
        <div className="px-3 pb-2">
          <div className="flex items-center bg-white rounded-full px-3 py-[7px] shadow-sm">
            <Search size={16} className="text-[#999] mr-2" />
            <span className="text-[#999] text-[14px]">Buscar produtos, muito mais...</span>
          </div>
        </div>
      </header>

      {/* Back link */}
      <Link to="/pneus" className="flex items-center gap-1 px-4 py-2 text-[#3483fa] text-[13px] bg-white border-b border-[#eee]">
        <ChevronLeft size={16} />
        Conferir mais tamanhos de Aro
      </Link>

      {/* Banner */}
      <img src={data.bannerImage} alt="Promoção" className="w-full" />

      {/* Title */}
      <div className="bg-white px-4 py-3 border-b border-[#eee]">
        <h1 className="text-[18px] font-bold text-[#333]">Aro {aroNum}</h1>
        <p className="text-[13px] text-[#999]">{data.products.length} produtos</p>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 gap-[1px] bg-[#eee] mt-2">
        {data.products.map((tire) => (
          <Link
            key={tire.slug}
            to={`/pneus/aro${aroNum}/${tire.slug}`}
            className="bg-white p-3 flex flex-col items-center active:bg-gray-50 transition-colors"
          >
            <div className="w-full aspect-square flex items-center justify-center mb-2">
              <img
                src={tire.image}
                alt={tire.size}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <p className="text-[12px] text-[#333] text-center leading-tight">
              Promoção [Entrega Rápida] <span className="font-bold">{tire.size}</span>
            </p>
            <p className="text-[15px] font-semibold text-[#333] mt-1">R$ 109,90</p>
            <p className="text-[11px] text-[#999]">12x de R$ {tire.parcela12x}</p>
            <div className="mt-2 bg-[#3483fa] text-white text-[12px] font-bold px-4 py-[6px] rounded-[4px] w-full text-center">
              COMPRAR
            </div>
          </Link>
        ))}
      </div>

      {/* Payment Methods Carousel */}
      <div className="bg-white mt-2 py-5">
        <PaymentCarousel />
      </div>

      {/* Footer Links */}
      <div className="bg-white mt-2 px-4 py-4 text-center">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[13px] text-[#666] mb-3">
          <span>Minha conta</span>
          <span>Compras</span>
          <span>Histórico</span>
          <span>Favoritos</span>
          <span>Categorias</span>
          <span>Ofertas do dia</span>
          <span>Vender</span>
          <span>Contato</span>
        </div>
        <div className="text-[11px] text-[#999] space-y-1">
          <p>Termos e condições · Privacidade · Acessibilidade</p>
          <p>Copyright © 1999-2024 Ebazar.com.br LTDA.</p>
        </div>
      </div>
    </div>
  );
};

export default AroListing;
