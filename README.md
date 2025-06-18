# 📖 Sistema de Evangelismo Online - Palavra da Fé

Uma aplicação web para evangelismo digital protestante com base na teologia da Palavra da Fé (RHEMA), captura de leads e integração com Supabase.

## 🙏 **Fundamento Teológico**

Esta aplicação é baseada na **teologia protestante** e nos princípios da **Palavra da Fé (RHEMA)**:
- ✝️ **Sola Scriptura** - Apenas a Bíblia como fonte de autoridade
- 🎁 **Salvação pela fé** - Dom gratuito de Deus, não por obras
- 💫 **Vida abundante** - Jesus veio para dar vida com abundância
- 🗣️ **Poder da confissão** - Crer no coração e confessar com a boca
- 📖 **Fé pela Palavra** - "A fé vem pelo ouvir a Palavra de Deus"

## 🎯 Funcionalidades

### ✨ **Nova Versão (v2) - Melhorias Implementadas:**

#### 🔄 **Fluxo Melhorado:**
- **10 cards sequenciais** para melhor qualificação do lead
- **Nome capturado no primeiro card** para personalização
- **Conversa personalizada** com o nome do usuário em todos os cards
- **Mensagem de parabéns personalizada**
- **Campo de telefone separado** no final do processo

#### 📱 **Transições Aprimoradas:**
- **Efeitos 3D** com rotação nos cards
- **Animações mais suaves** com cubic-bezier
- **Tempo de transição otimizado** (700ms entrada, 500ms saída)
- **Efeitos de hover melhorados**

#### 📊 **Jornada Completa do Lead:**
1. **Card 1:** Captura do nome
2. **Card 2:** Sentido da vida 
3. **Card 3:** Vazio interior
4. **Card 4:** Problema do pecado
5. **Card 5:** Solução de Deus
6. **Card 6:** Vida eterna
7. **Card 7:** Como receber
8. **Card 8:** Decisão (única com opção de recusa)
9. **Card 9:** Parabéns personalizado
10. **Card 10:** Captura de telefone (opcional)
11. **Card Final:** Próximos passos

## 🗄️ **Integração com Supabase**

### **Estrutura da Tabela:**
```sql
evangelismo_leads (
    id, name, phone, decision, step,
    started_at, accepted_at, declined_at, completed_at,
    created_at, updated_at, ip_address, user_agent
)
```

### **Dados Capturados:**
- ✅ Nome do usuário
- ✅ Telefone (opcional)  
- ✅ Decisão tomada (accepted/declined)
- ✅ Progresso na jornada
- ✅ Timestamps de cada etapa
- ✅ IP e User Agent para analytics

## 🚀 **Como Configurar**

### **1. Configurar Supabase:**
```bash
1. Crie conta em https://supabase.com
2. Crie novo projeto
3. Execute o SQL em `supabase_setup.sql`
4. Copie URL e chave anônima do projeto
5. Configure no arquivo HTML
```

### **2. Configurar o HTML:**
```javascript
// Substitua estas constantes no evangelismo_v2.html:
const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANONIMA_AQUI';
```

### **3. Adicionar Script do Supabase:**
```html
<!-- Adicione antes do </head> -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

## 📊 **Analytics e Relatórios**

### **View de Estatísticas:**
```sql
SELECT * FROM vw_evangelismo_stats;
```

**Retorna:**
- Total de leads por dia
- Quantos aceitaram Jesus
- Quantos recusaram
- Quantos compartilharam telefone
- Taxa de conversão

### **Consultas Úteis:**
```sql
-- Leads que aceitaram hoje
SELECT name, phone, accepted_at 
FROM evangelismo_leads 
WHERE decision = 'accepted' 
AND DATE(accepted_at) = CURRENT_DATE;

-- Taxa de conversão geral
SELECT 
    COUNT(*) as total,
    COUNT(CASE WHEN decision = 'accepted' THEN 1 END) as convertidos,
    ROUND(COUNT(CASE WHEN decision = 'accepted' THEN 1 END) * 100.0 / COUNT(*), 2) as taxa
FROM evangelismo_leads 
WHERE decision IS NOT NULL;
```

## 🎨 **Funcionalidades Visuais**

### **Animações:**
- ✨ Elementos flutuantes de fundo
- 🎊 Confetes animados nas celebrações
- 🔄 Transições 3D entre cards
- 💫 Efeitos de hover e focus
- 📱 Vibração no mobile

### **Design Responsivo:**
- 📱 Otimizado para mobile-first
- 🎯 Área de toque aumentada
- 📏 Tipografia fluida com clamp()
- 🎨 Glassmorphism e gradientes modernos

## 📝 **Arquivos do Projeto**

```
📁 evangelismo/
├── 📄 evangelismo_v2.html      # Versão nova e melhorada
├── 📄 evangelismo.html         # Versão original
├── 📄 supabase_setup.sql       # Script para criar tabela
├── 📄 supabase_config.js       # Configurações do Supabase
└── 📄 README.md               # Este arquivo
```

## 🔧 **Próximos Passos**

### **Para Produção:**
1. ✅ Configure domínio personalizado
2. ✅ Ative HTTPS
3. ✅ Configure backup do Supabase
4. ✅ Monitore performance
5. ✅ Configure alertas de novos leads

### **Melhorias Futuras:**
- 📧 Envio automático de email de boas-vindas
- 📱 Notificações push
- 📊 Dashboard administrativo
- 🎥 Integração com vídeos
- 📋 Formulário de acompanhamento

## 🆘 **Suporte**

Para dúvidas ou problemas:
1. Verifique se o Supabase está configurado corretamente
2. Confira o console do navegador para erros
3. Teste a conexão com a API do Supabase
4. Verifique as políticas RLS se houver problemas de permissão

---

**🙏 Que Deus abençoe este projeto e use-o para alcançar muitas vidas!**
