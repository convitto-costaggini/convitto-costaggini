-- Area famiglie: configurazione dell'OTP nel Vault (25/10/2026)
-- La funzione otp-famiglie legge OTP_PEPPER, OTP_MAIL_URL e OTP_MAIL_TOKEN dai
-- secret delle Edge Functions; se mancano, da qui. I valori stanno cifrati nel
-- Vault (nomi otp_pepper, otp_mail_url, otp_mail_token) e la funzione è
-- eseguibile solo con la service role: né il sito né le famiglie possono leggerli.

create or replace function public.otp_famiglie_config()
returns table (pepper text, mail_url text, mail_token text)
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select decrypted_secret from vault.decrypted_secrets where name = 'otp_pepper'),
    (select decrypted_secret from vault.decrypted_secrets where name = 'otp_mail_url'),
    (select decrypted_secret from vault.decrypted_secrets where name = 'otp_mail_token');
$$;

revoke all on function public.otp_famiglie_config() from public, anon, authenticated;
grant execute on function public.otp_famiglie_config() to service_role;
