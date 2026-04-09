import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Heart, Share2, ChevronLeft, ChevronRight, Menu, Search, ShoppingCart, MapPin, ThumbsUp, Shield, RotateCcw, Zap, CreditCard, Package, MoreVertical, CheckCircle, Clock, MessageCircle, Medal } from "lucide-react";
import { getTireProduct, reviews } from "@/data/pneusData";
import { supabase } from "@/integrations/supabase/client";

const BASE = "https://mercadopneusml.online/ml/aros";

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

const PneuDetalhe = () => {
  const { aro, slug } = useParams<{ aro: string; slug: string }>();
  const navigate = useNavigate();
  const aroNum = parseInt((aro || "aro13").replace("aro", ""));
  const tire = getTireProduct(aroNum, slug || "");
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedQty, setSelectedQty] = useState(1);
  const [touchStart, setTouchStart] = useState(0);
  const [userLocation, setUserLocation] = useState("sua localização");

  useEffect(() => {
    if (!tire) return;
    const sid = sessionStorage.getItem("checkout_session_id") || crypto.randomUUID();
    sessionStorage.setItem("checkout_session_id", sid);
    supabase.from("checkout_analytics").insert({ session_id: sid, page_visited: `pneu_${slug}`, product_key: slug }).then(() => {});
  }, [slug, tire]);

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

  if (!tire) {
    return <div className="p-8 text-center">Produto não encontrado</div>;
  }

  const images = tire.detailImages;

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "left" && currentImage < images.length - 1) setCurrentImage(currentImage + 1);
    if (direction === "right" && currentImage > 0) setCurrentImage(currentImage - 1);
  };

  const pricePerQty = (qty: number) => {
    if (qty === 2) return 209.80;
    if (qty === 4) return 399.60;
    return 109.90;
  };

  const handleBuy = () => {
    const productKey = `pneu_${tire.slug}_${selectedQty}`;
    navigate(`/checkout?product=${productKey}`);
  };

  const reviewImages = [
    `${BASE}/aro${aroNum}/${slug}/images/avali1.webp`,
    `${BASE}/aro${aroNum}/${slug}/images/avali2.webp`,
    `${BASE}/aro${aroNum}/${slug}/images/avali3.webp`,
    `${BASE}/aro${aroNum}/${slug}/images/avali4.webp`,
    `${BASE}/aro${aroNum}/${slug}/images/avali5.webp`,
    `${BASE}/aro${aroNum}/${slug}/images/avali6.webp`,
    `${BASE}/aro${aroNum}/${slug}/images/avali7.webp`,
    `${BASE}/aro${aroNum}/${slug}/images/avali8.webp`,
    `${BASE}/aro${aroNum}/${slug}/images/avali9.webp`,
    `${BASE}/aro${aroNum}/${slug}/images/avali10.webp`,
    `${BASE}/aro${aroNum}/${slug}/images/avali11.webp`,
    `${BASE}/aro${aroNum}/${slug}/images/avali12.webp`,
    `${BASE}/aro${aroNum}/${slug}/images/avali13.webp`,
    `${BASE}/aro${aroNum}/${slug}/images/avali14.webp`,
    `${BASE}/aro${aroNum}/${slug}/images/avali15.webp`,
    `${BASE}/aro${aroNum}/${slug}/images/avali16.webp`,
    `${BASE}/aro${aroNum}/${slug}/images/avali17.webp`,
  ];

  const reviewsData = [
    {
      name: "Natália Ibrahim",
      rating: 4,
      date: "a 18 horas atrás",
      text: "Gostei da qualidade e a entrega foi cumprida! Agora é aproveitar!!!",
      photos: [reviewImages[0], reviewImages[1], reviewImages[2], reviewImages[3]],
    },
    {
      name: "José Oliveira",
      rating: 5,
      date: "a 1 dia atrás",
      text: "Super recomendo a compra veio tudo certo, Entrega super rápida, só instalar. Atendimento incrível e entrega rápida. Estou muito satisfeito!",
      photos: [reviewImages[4], reviewImages[5], reviewImages[6]],
    },
    {
      name: "Paulo Brossi",
      rating: 5,
      date: "a 1 dia atrás",
      text: "Gostei do pneu, chegou antes do prazo, bem embalado, gostei vou comprar mais dois.",
      photos: [reviewImages[7], reviewImages[8]],
    },
    {
      name: "Henrique Paulo",
      rating: 5,
      date: "a 1 dia atrás",
      text: "Pneus entregues e foi até rápido pra chegar, aparentemente de boa qualidade. Instalar pra ver o resultado rodando no carro.",
      photos: [reviewImages[9]],
    },
    {
      name: "Felipe Alves",
      rating: 5,
      date: "a 1 dia atrás",
      text: "Podem comprar sem medo chegou no prazo ótimo produto com certeza comprarei outras vezes",
      photos: [],
    },
    {
      name: "Eliseias Cruz",
      rating: 5,
      date: "a 1 dia atrás",
      text: "Pneus chegaram bem embalados, são de boa qualidade. Já fiz a montagem dos mesmos e não apresentou nenhum defeito. Indico a compra do produto. Chegou antes da data prevista.",
      photos: [reviewImages[10]],
    },
  ];

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
          <Link to={`/pneus/aro${aroNum}`} className="text-[#3483fa] text-[13px]">
            Conferir mais produtos da marca Pirelli
          </Link>
        </div>

        {/* Product meta */}
        <div className="px-4 pb-1">
          <div className="flex items-center justify-between text-[12px] text-[#999] mb-1.5">
            <span>Novo | +1000 vendidos</span>
            <div className="flex items-center gap-1">
              <span>4.9</span>
              <span className="text-[#3483fa]">★★★★★</span>
              <span className="text-[11px]">(3.209)</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="px-4 pb-2 flex items-center gap-2">
          <span className="bg-[#f73] text-white text-[10px] font-bold px-2 py-[3px] rounded-[3px] uppercase">
            Mais vendido
          </span>
          <span className="text-[12px] text-[#3483fa]">1º Mais vendidos em Pneus</span>
        </div>

        {/* Title */}
        <h1 className="px-4 pb-3 text-[15px] font-normal text-[#333] leading-[1.35]">
          Promoção <strong>{tire.size}</strong> [Entrega Rápida]
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
              src={images[currentImage]}
              alt={`Pneu ${tire.size} - Imagem ${currentImage + 1}`}
              className="w-full h-full object-contain"
            />
            <div className="absolute top-3 left-3 bg-[rgba(0,0,0,0.55)] text-white text-[11px] px-2 py-0.5 rounded-full">
              {currentImage + 1}/{images.length}
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
            {images.map((_, i) => (
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

        {/* Quantity Selector */}
        <div className="px-4 py-3 border-t border-[#eee]">
          <p className="text-[13px] text-[#666] mb-2">
            Quantidade de pneus: <strong className="text-[#333]">{selectedQty}</strong>
          </p>
          <div className="flex gap-2">
            {[1, 2, 4].map((q) => (
              <button
                key={q}
                onClick={() => setSelectedQty(q)}
                className={`px-4 py-[7px] rounded-[6px] text-[13px] border transition-colors ${
                  selectedQty === q
                    ? "border-[#3483fa] text-[#3483fa] bg-[#f0f6ff]"
                    : "border-[#ddd] text-[#333]"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="px-4 py-4">
          <div className="text-[14px] text-[#999] line-through mb-0.5">
            R$ {(tire.originalPrice * selectedQty).toFixed(2).replace(".", ",")}
          </div>
          <div className="flex items-baseline gap-1 mb-0.5">
            <span className="text-[32px] font-light text-[#333] leading-none">
              R$ {Math.floor(pricePerQty(selectedQty))}<span className="text-[18px] align-super">{(pricePerQty(selectedQty) % 1).toFixed(2).replace("0.", "")}</span>
            </span>
            <span className="text-[13px] text-[#00a650] font-semibold ml-1">25% OFF</span>
          </div>
          <div className="flex items-center text-[14px] mt-1.5">
            <CreditCard size={14} className="text-[#333] mr-1" />
            <span className="text-[#333]">em 12x de </span>
            <span className="text-[#00a650] ml-1">R$ {(pricePerQty(selectedQty) / 12).toFixed(2).replace(".", ",")} sem juros</span>
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

        {/* Quantity display */}
        <div className="mx-4 my-4 bg-[#f5f5f5] rounded-[6px] px-4 py-3 text-[14px] text-[#333]">
          Quantidade: <strong>{selectedQty} {selectedQty === 1 ? "Unidade" : "Unidades"}</strong>{" "}
          <span className="text-[#999]">(+7 disponíveis)</span>
        </div>

        {/* Buy Button */}
        <div className="px-4 pb-4">
          <button
            onClick={handleBuy}
            className="block w-full bg-[#3483fa] text-white py-[14px] rounded-[6px] font-semibold text-[16px] text-center"
          >
            Comprar agora
          </button>
        </div>
      </main>

      {/* Bottom content area */}
      <div className="bg-white mt-2">
        {/* Seller Card */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={`${BASE}/aro${aroNum}/${slug}/images/logo_mp.svg`}
              alt="Mercado Pago"
              className="h-[36px]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://http2.mlstatic.com/frontend-assets/mp-web-navigation/ui-navigation/6.6.92/mercadopago/logo__large@2x.png";
              }}
            />
            <div>
              <div className="text-[15px] font-bold text-[#333]">Mercado Líder Platinum</div>
              <div className="text-[13px] text-[#999]">Loja Oficial Pirelli</div>
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
            <p className="text-[13px] text-[#333]">5 anos de garantia de fábrica.</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="text-[18px] font-semibold text-[#333] mb-3">Descrição</h2>
        <div className="text-[14px] text-[#333] leading-[1.6] space-y-3">
          <p>
            <strong>DURABILIDADE</strong><br />
            Um pneu de longa vida útil, conta com uma banda de rodagem mais larga e com blocos dispostos de maneira especial. Por conta disso, há menor resistência na hora do rolamento e uma maior área de contato com a superfície também. A soma desses dois fatores é um aumento significativo na durabilidade do produto, tornando-o bastante longevo e com um desgaste bastante amenizado.
          </p>
          <p>
            <strong>SEGURANÇA</strong><br />
            Extremamente eficiente e seguro, conta com diversas características que fazem deste um pneu confiável e seguro. Os ombros rígidos garantem maior resistência, mas também menor deformação na hora de fazer curvas e outras manobras bruscas que forçam o pneu. Por conta disso, consegue manter estabilidade, tração e aderência mesmo em situações mais extremas.
          </p>
          <p>
            <strong>ECONOMIA</strong><br />
            Um rolamento suave torna a experiência de dirigir muito mais agradável, mas mais importante do que isso, garante também economia e um consumo energético mais eficiente para o veículo como um todo. Combinando as características deste pneu, é possível dirigir mais, por mais tempo, gastando menos.
          </p>
          <p className="italic text-[#666]">
            • Não inclui roda.
          </p>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="text-[18px] font-semibold text-[#333] mb-3">Opiniões do produto</h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[36px] font-light text-[#333]">4.9</span>
          <div>
            <div className="text-[#3483fa] text-[18px] tracking-tight">★★★★★</div>
            <span className="text-[12px] text-[#999]">(3.209 avaliações)</span>
          </div>
        </div>

        <div className="space-y-0">
          {reviewsData.map((review, i) => (
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
            <p className="text-[15px] font-semibold text-[#333]">R$ {pricePerQty(selectedQty).toFixed(2).replace(".", ",")}</p>
            <p className="text-[12px] text-[#333]">10x R$ {(pricePerQty(selectedQty) / 10).toFixed(2).replace(".", ",")} sem juros</p>
            <p className="text-[13px] text-[#333] font-extrabold">{selectedQty} {selectedQty === 1 ? "Unidade" : "Unidades"}</p>
          </div>
          <button
            onClick={handleBuy}
            className="bg-[#3483fa] text-white px-6 py-2.5 rounded-[6px] font-semibold text-[14px]"
          >
            Comprar agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default PneuDetalhe;
