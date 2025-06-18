-- SQL para criar tabela no Supabase
-- Execute este código no SQL Editor do Supabase

-- Criar tabela para armazenar os leads de evangelismo
CREATE TABLE evangelismo_leads (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    decision VARCHAR(50),
    step VARCHAR(50),
    started_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    declined_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Criar índices para melhor performance
CREATE INDEX idx_evangelismo_leads_name ON evangelismo_leads(name);
CREATE INDEX idx_evangelismo_leads_decision ON evangelismo_leads(decision);
CREATE INDEX idx_evangelismo_leads_created_at ON evangelismo_leads(created_at);
CREATE INDEX idx_evangelismo_leads_step ON evangelismo_leads(step);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_evangelismo_leads_updated_at
    BEFORE UPDATE ON evangelismo_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Adicionar comentários para documentação
COMMENT ON TABLE evangelismo_leads IS 'Tabela para armazenar leads capturados no site de evangelismo';
COMMENT ON COLUMN evangelismo_leads.name IS 'Nome do usuário';
COMMENT ON COLUMN evangelismo_leads.phone IS 'Telefone do usuário (opcional)';
COMMENT ON COLUMN evangelismo_leads.decision IS 'Decisão tomada: accepted, declined, null';
COMMENT ON COLUMN evangelismo_leads.step IS 'Último passo onde o usuário parou';
COMMENT ON COLUMN evangelismo_leads.started_at IS 'Quando começou a jornada';
COMMENT ON COLUMN evangelismo_leads.accepted_at IS 'Quando aceitou Jesus';
COMMENT ON COLUMN evangelismo_leads.declined_at IS 'Quando recusou';
COMMENT ON COLUMN evangelismo_leads.completed_at IS 'Quando completou todo o processo';
COMMENT ON COLUMN evangelismo_leads.ip_address IS 'IP do usuário para analytics';
COMMENT ON COLUMN evangelismo_leads.user_agent IS 'User agent para analytics';

-- Configurar RLS (Row Level Security) se necessário
ALTER TABLE evangelismo_leads ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (ajuste conforme sua necessidade)
CREATE POLICY "Permitir inserção pública" ON evangelismo_leads
    FOR INSERT 
    TO public
    WITH CHECK (true);

-- Política para permitir visualização apenas para usuários autenticados
CREATE POLICY "Visualização apenas autenticados" ON evangelismo_leads
    FOR SELECT 
    TO authenticated
    USING (true);

-- View para relatórios básicos
CREATE VIEW vw_evangelismo_stats AS
SELECT 
    DATE(created_at) as data,
    COUNT(*) as total_leads,
    COUNT(CASE WHEN decision = 'accepted' THEN 1 END) as aceitaram,
    COUNT(CASE WHEN decision = 'declined' THEN 1 END) as recusaram,
    COUNT(CASE WHEN phone IS NOT NULL THEN 1 END) as compartilharam_telefone,
    ROUND(
        COUNT(CASE WHEN decision = 'accepted' THEN 1 END) * 100.0 / 
        NULLIF(COUNT(CASE WHEN decision IS NOT NULL THEN 1 END), 0), 
        2
    ) as taxa_conversao
FROM evangelismo_leads
GROUP BY DATE(created_at)
ORDER BY data DESC;

-- Comentário da view
COMMENT ON VIEW vw_evangelismo_stats IS 'Estatísticas diárias do evangelismo online';
