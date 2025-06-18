// Configuração do Supabase para o projeto de evangelismo
// Substitua as constantes abaixo pelos dados do seu projeto Supabase

const SUPABASE_CONFIG = {
    url: 'https://SEU_PROJETO.supabase.co',
    anonKey: 'SUA_CHAVE_ANONIMA_AQUI'
};

// Exemplo de como usar no HTML (substitua no arquivo evangelismo_v2.html):
/*
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
    // Inicializar cliente Supabase
    const { createClient } = supabase;
    const supabaseClient = createClient(
        'https://SEU_PROJETO.supabase.co',
        'SUA_CHAVE_ANONIMA_AQUI'
    );

    // Função para salvar no Supabase (versão funcional)
    async function saveToSupabase(data) {
        try {
            const { data: result, error } = await supabaseClient
                .from('evangelismo_leads')
                .insert([{
                    name: data.name,
                    phone: data.phone,
                    decision: data.decision,
                    step: data.step,
                    started_at: data.started_at,
                    accepted_at: data.accepted_at,
                    declined_at: data.declined_at,
                    completed_at: data.completed_at,
                    ip_address: await getUserIP(),
                    user_agent: navigator.userAgent
                }]);

            if (error) {
                console.error('Erro ao salvar:', error);
                return false;
            }

            console.log('Dados salvos com sucesso:', result);
            return true;
        } catch (error) {
            console.error('Erro na conexão:', error);
            return false;
        }
    }

    // Função auxiliar para pegar IP do usuário
    async function getUserIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.log('Não foi possível obter IP:', error);
            return null;
        }
    }
</script>
*/

// PASSOS PARA CONFIGURAR NO SUPABASE:
// 1. Crie uma conta em https://supabase.com
// 2. Crie um novo projeto
// 3. Vá em SQL Editor e execute o arquivo supabase_setup.sql
// 4. Copie a URL e a chave anônima do seu projeto (Settings > API)
// 5. Substitua as constantes acima
// 6. Adicione o script do Supabase no HTML conforme exemplo acima
