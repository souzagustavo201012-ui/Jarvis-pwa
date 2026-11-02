JARVIS — ASSISTENTE PESSOAL (PWA)
================================

O QUE ESTA VERSÃO FAZ
- Interface instalável como aplicativo pelo Chrome.
- Comandos de voz em navegadores compatíveis (Chrome Android; requer HTTPS e permissão do microfone).
- Respostas faladas usando a voz do dispositivo.
- Hora e data.
- Calculadora para operações básicas.
- Notas salvas localmente no dispositivo.
- Lembretes verificados enquanto o app está aberto.
- Atalhos para Google, YouTube, Gmail e Google Agenda.
- Cache offline básico após a primeira visita.

LIMITAÇÕES IMPORTANTES
- Esta versão não é um modelo de IA conectado: não responde livremente a qualquer pergunta.
- Gmail e Google Agenda abrem os sites oficiais; não leem nem alteram sua conta.
- Lembretes não são garantidos se o app estiver fechado ou suspenso pelo Android.
- O reconhecimento de voz do navegador pode enviar áudio para o serviço de reconhecimento do navegador.
- Dados de notas e lembretes ficam no armazenamento local do navegador. Limpar os dados do Chrome pode apagá-los.

COMO PUBLICAR PARA INSTALAR PELO CHROME
O Chrome exige que o PWA esteja hospedado em HTTPS (ou localhost). Este ZIP é o projeto; não é um link público já hospedado.

Opção simples: GitHub Pages
1. Entre em github.com e crie uma conta, se necessário (com ajuda de um responsável, se for o caso).
2. Crie um repositório novo chamado jarvis-pwa.
3. Envie TODOS os arquivos e a pasta icons deste projeto para a raiz do repositório.
4. Em Settings > Pages, escolha Deploy from a branch, branch main, pasta /(root), e salve.
5. Aguarde a publicação. O GitHub mostrará um endereço HTTPS para o site.
6. Abra esse endereço no Google Chrome do Android.
7. Menu ⋮ > Instalar app (ou Adicionar à tela inicial).

Você também pode hospedar em outro serviço estático HTTPS.

COMANDOS DE EXEMPLO
- "Que horas são?"
- "Que dia é hoje?"
- "Abra o YouTube"
- "Abra o Gmail"
- "Abra a Agenda"
- "Anote estudar matemática"
- "Quanto é 25 vezes 4?"
- "Ajuda"

TESTES FEITOS NO CÓDIGO
- Conferência da estrutura do projeto e dos arquivos do PWA.
- As funções de voz dependem de suporte do navegador/dispositivo e precisam ser testadas no próprio celular.
