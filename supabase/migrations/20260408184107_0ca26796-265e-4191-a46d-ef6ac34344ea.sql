
CREATE POLICY "Allow public select on checkout_orders" ON public.checkout_orders FOR SELECT USING (true);
CREATE POLICY "Allow public select on checkout_analytics" ON public.checkout_analytics FOR SELECT USING (true);
