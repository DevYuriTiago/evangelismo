# 🚀 Deploy no Netlify - Passo a Passo

## 📋 **Pré-requisitos**
- ✅ Conta no [Netlify](https://netlify.com)
- ✅ Projeto configurado no GitHub
- ✅ Conta no [Supabase](https://supabase.com) (opcional)

## 🔧 **Opção 1: Deploy via GitHub (Recomendado)**

### **1. Conectar Repositório:**
1. Acesse [Netlify](https://app.netlify.com)
2. Clique em "New site from Git"
3. Escolha "GitHub"
4. Selecione o repositório `DevYuriTiago/evangelismo`

### **2. Configurações de Build:**
```
Build command: echo 'Static site ready'
Publish directory: .
```

### **3. Deploy:**
- Clique em "Deploy site"
- Aguarde o deploy finalizar
- Seu site estará disponível em: `https://random-name.netlify.app`

### **4. Configurar Domínio Personalizado (Opcional):**
1. Vá em "Domain settings"
2. Clique em "Add custom domain"
3. Digite seu domínio: `evangelismo.com.br`
4. Configure DNS conforme instruções

## 🔧 **Opção 2: Deploy Manual**

### **1. Preparar Arquivos:**
```bash
# Comprimir arquivos do projeto
zip -r evangelismo.zip . -x "node_modules/*" ".git/*"
```

### **2. Upload Manual:**
1. Acesse [Netlify](https://app.netlify.com)
2. Arraste a pasta do projeto para a área de drop
3. Site será deployado automaticamente

## 🗄️ **Configurar Supabase (Opcional)**

### **1. Criar Projeto Supabase:**
1. Acesse [Supabase](https://app.supabase.com)
2. Clique em "New project"
3. Configure nome e senha

### **2. Executar SQL:**
```sql
-- Cole o conteúdo do arquivo supabase_setup.sql
-- Execute no SQL Editor do Supabase
```

### **3. Obter Credenciais:**
1. Vá em Settings > API
2. Copie `Project URL` e `anon key`

### **4. Configurar no Site:**
1. Edite `evangelismo_v2.html`
2. Substitua:
```javascript
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-anonima';
```

## 🔒 **Variáveis de Ambiente (Netlify)**

### **Para maior segurança, use variáveis de ambiente:**

1. **No Netlify:**
   - Site settings > Environment variables
   - Adicione:
     - `SUPABASE_URL`: https://seu-projeto.supabase.co
     - `SUPABASE_ANON_KEY`: sua-chave-anonima

2. **No código JavaScript:**
```javascript
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
```

## 📊 **Monitoramento**

### **Analytics (Netlify):**
- Analytics automático disponível no dashboard
- Métricas de visitantes, pageviews, etc.

### **Logs de Leads (Supabase):**
```sql
-- Ver leads de hoje
SELECT * FROM evangelismo_leads 
WHERE DATE(created_at) = CURRENT_DATE;

-- Estatísticas gerais
SELECT * FROM vw_evangelismo_stats;
```

## 🎯 **URLs do Projeto**

- **Site Principal:** `https://seu-site.netlify.app`
- **Página de Evangelismo:** `https://seu-site.netlify.app/evangelismo_v2.html`
- **Supabase Dashboard:** `https://app.supabase.com/project/seu-projeto`

## 🔧 **Comandos Úteis**

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login no Netlify
netlify login

# Deploy manual
netlify deploy --prod

# Ver logs
netlify logs

# Configurar domínio
netlify domains:add exemplo.com
```

## 🆘 **Troubleshooting**

### **Site não carrega:**
- Verifique se `index.html` existe
- Confirme configurações no `netlify.toml`

### **Supabase não conecta:**
- Verifique URLs e chaves
- Confirme políticas RLS no Supabase
- Verifique console do navegador

### **Erro 404:**
- Verifique arquivo `_redirects`
- Confirme estrutura de pastas

---

**🙏 Que Deus abençoe este projeto e use-o para alcançar muitas vidas!**
