# Sincronização em nuvem (opcional)

O Enterprise Educacional continua funcionando sem conta. A nuvem só é ativada quando o proprietário conecta um projeto Supabase.

1. Crie um projeto no Supabase.
2. Abra o SQL Editor e execute `supabase/schema.sql`.
3. Em Authentication, configure o fluxo de e-mail/senha como preferir. Se a confirmação de e-mail estiver ativa, o usuário precisa confirmar o e-mail antes do primeiro login.
4. Abra o site → Progresso → Conta e nuvem → Configurar nuvem.
5. Informe a **Project URL** e a **anon/public key**.
6. Nunca use a `service_role` no navegador.

A tabela usa RLS e cada usuário só consegue ler/escrever a linha cujo `user_id` corresponde a `auth.uid()`.

A sincronização é deliberadamente explícita:
- **Enviar este dispositivo** substitui o backup daquele usuário na nuvem.
- **Restaurar da nuvem** substitui os dados locais depois de uma confirmação.

O backup inclui progresso, notas, histórico, checkpoints e projetos salvos do Playground.

## Sincronização automática (v44)

Depois que o backend e a conta estiverem configurados, o painel de nuvem possui a opção **Sincronização automática**.

- alterações locais aguardam alguns segundos antes do envio para evitar várias gravações seguidas;
- se o site detectar mudanças locais e um backup remoto mais recente desde a última sincronização, o envio automático é pausado;
- nesse caso, escolha manualmente **Enviar este dispositivo** ou **Restaurar da nuvem** depois de decidir qual estado deve prevalecer.

Esse comportamento evita que duas sessões abertas em dispositivos diferentes sobrescrevam dados silenciosamente.
