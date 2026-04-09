
-- Tabela para armazenar dados do checkout
CREATE TABLE public.checkout_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_key TEXT NOT NULL,
  product_title TEXT NOT NULL,
  product_price NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  shipping_cost NUMERIC DEFAULT 0,
  shipping_option TEXT,
  email TEXT,
  nome TEXT,
  cpf TEXT,
  celular TEXT,
  cep TEXT,
  rua TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  uf TEXT,
  pay_method TEXT NOT NULL,
  card_name TEXT,
  card_last4 TEXT,
  card_brand TEXT,
  card_expiry TEXT,
  parcelas INTEGER DEFAULT 1,
  current_step INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para rastrear visitas e etapas
CREATE TABLE public.checkout_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  product_key TEXT,
  step_reached INTEGER DEFAULT 1,
  page_visited TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS - permitir inserção pública (sem auth)
ALTER TABLE public.checkout_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkout_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on checkout_orders" ON public.checkout_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on checkout_analytics" ON public.checkout_analytics FOR INSERT WITH CHECK (true);
