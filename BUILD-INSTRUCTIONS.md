# 🚀 INSTRUÇÕES PARA DEPLOY VERCEL

## Problema Atual:
O deploy não está renderizando o aplicativo React corretamente.

## Configurações Corretas no Vercel:

### 1. Build Settings
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist/public`
- **Install Command:** `npm install`

### 2. Environment Variables Necessárias
Configure no Vercel Dashboard:
- `DATABASE_URL` - Sua string de conexão Supabase
- `NODE_ENV` - `production`

### 3. Root Directory
- **Root Directory:** `.` (raiz do projeto)

### 4. Redeploy
Após ajustar essas configurações:
1. Vá para **Deployments** no Vercel
2. **Redeploy** a última versão
3. **Deploy** novamente

## O que Esperar:
- Build bem-sucedido em ~2-3 minutos
- Site VM Eventos carregando corretamente
- Formulário de contato funcionando
- Admin dashboard acessível

## Se Ainda Não Funcionar:
1. Verifique logs de build no Vercel
2. Confirme que `dist/public` contém `index.html`
3. Teste localmente com `npm run build`

---
**Use outputDirectory: dist/public conforme a configuração atual do Vite**