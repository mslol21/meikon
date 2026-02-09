import { MercadoPagoConfig, Preference, PreApproval } from 'mercadopago';

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  console.warn('MERCADOPAGO_ACCESS_TOKEN is not set');
}

export const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!
});

export const preference = new Preference(mercadopago);
export const preapproval = new PreApproval(mercadopago);
