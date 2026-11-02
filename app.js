const $ = id => document.getElementById(id);
const response = $('response');
let lastAnswer = response.textContent;
const store = {
  get(key){try{return JSON.parse(localStorage.getItem('jarvis_'+key)||'[]')}catch{return []}},
  set(key,value){localStorage.setItem('jarvis_'+key,JSON.stringify(value))}
};
function say(text){lastAnswer=text;response.textContent=text;$('voiceHint').textContent='Resposta pronta.'}
function speak(text=lastAnswer){
  if(!('speechSynthesis' in window)){say(text+'\n\nEste navegador não oferece leitura em voz alta.');return}
  speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='pt-BR';u.rate=.96;speechSynthesis.speak(u);
}
function renderNotes(){const ul=$('notesList');ul.innerHTML='';store.get('notes').forEach((n,i)=>{const li=document.createElement('li');const span=document.createElement('span');span.textContent=n;const b=document.createElement('button');b.textContent='×';b.setAttribute('aria-label','Apagar anotação');b.onclick=()=>{const a=store.get('notes');a.splice(i,1);store.set('notes',a);renderNotes()};li.append(span,b);ul.append(li)})}
function renderReminders(){const ul=$('remindersList');ul.innerHTML='';store.get('reminders').forEach((r,i)=>{const li=document.createElement('li');const span=document.createElement('span');span.textContent=r.text+' — '+new Date(r.time).toLocaleString('pt-BR');const b=document.createElement('button');b.textContent='×';b.onclick=()=>{const a=store.get('reminders');a.splice(i,1);store.set('reminders',a);renderReminders()};li.append(span,b);ul.append(li)})}
function addNote(note){if(!note.trim())return;const a=store.get('notes');a.unshift(note.trim());store.set('notes',a.slice(0,30));renderNotes();say('Anotação salva neste celular: '+note.trim())}
function addReminder(text,time){const d=new Date(time);if(!text.trim()||Number.isNaN(d.getTime())||d.getTime()<=Date.now()){say('Escolha um horário futuro válido para o lembrete.');return}const a=store.get('reminders');a.push({text:text.trim(),time:d.toISOString(),done:false});store.set('reminders',a);renderReminders();say('Lembrete criado para '+d.toLocaleString('pt-BR')+'. Deixe o JARVIS aberto para receber o aviso.')}
function calc(expr){
  const s=expr.replace(/,/g,'.').replace(/[×x]/gi,'*').replace(/÷/g,'/');
  if(!/^[\d+\-*/().%\s]+$/.test(s))throw Error('Expressão inválida');
  const tokens=s.match(/\d+(?:\.\d+)?|[()+\-*/%]/g)||[];let p=0;
  function atom(){let t=tokens[p++];if(t==='('){let v=add();if(tokens[p++]!==')')throw Error();return v}if(t==='-')return -atom();if(t==='+')return atom();if(!t||!/^(\d+\.?\d*|\.\d+)$/.test(t))throw Error();return Number(t)}
  function mul(){let v=atom();while(['*','/','%'].includes(tokens[p])){let op=tokens[p++],b=atom();if((op==='/'||op==='%')&&b===0)throw Error();v=op==='*'?v*b:op==='/'?v/b:v%b}return v}
  function add(){let v=mul();while(['+','-'].includes(tokens[p])){let op=tokens[p++],b=mul();v=op==='+'?v+b:v-b}return v}
  const v=add();if(p!==tokens.length||!Number.isFinite(v))throw Error();return Number(v.toFixed(8));
}
function handle(raw){
  const q=raw.trim(),s=q.toLowerCase();if(!q)return;
  if(/^(ajuda|help|o que você faz|o que voce faz)/.test(s)){say('Posso: dizer as horas e a data; fazer contas; guardar notas; criar lembretes; abrir Google, YouTube, Gmail e Agenda; e responder a comandos simples. Minha versão atual não é uma IA conectada à internet e não acessa suas contas privadas.');return}
  if(/que horas|horário|horas são/.test(s)){say('Agora são '+new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})+'.');return}
  if(/que dia|data de hoje|qual a data/.test(s)){say('Hoje é '+new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+'.');return}
  const note=q.match(/^(?:jarvis[, ]*)?(?:anote|anotar|salve|guardar nota|lembre disso)\s*[:,-]?\s*(.+)$/i);if(note){addNote(note[1]);return}
  const math=q.match(/(?:quanto é|calcule|calcular|resolva)\s+(.+)\??$/i);if(math){try{say('O resultado é '+calc(math[1])+'.')}catch{say('Não consegui interpretar essa conta. Digite uma expressão como: quanto é 25 vezes 4? (use * para multiplicação e / para divisão).')}return}
  if(/youtube/.test(s)&&/(abra|abrir|acessar|ir para)/.test(s)){window.open('https://www.youtube.com','_blank','noopener');say('Abrindo o YouTube.');return}
  if(/gmail/.test(s)&&/(abra|abrir|acessar|ir para)/.test(s)){window.open('https://mail.google.com','_blank','noopener');say('Abrindo o Gmail. Entre na sua conta pela página oficial.');return}
  if(/agenda|calendário|calendario/.test(s)&&/(abra|abrir|acessar|ir para)/.test(s)){window.open('https://calendar.google.com','_blank','noopener');say('Abrindo o Google Agenda.');return}
  if(/google/.test(s)&&/(abra|abrir|pesquise|buscar|ir para)/.test(s)){window.open('https://www.google.com','_blank','noopener');say('Abrindo o Google.');return}
  say('Entendi seu comando: “'+q+'”. Ainda não tenho um modelo de inteligência artificial conectado para responder perguntas livres. Posso ajudar com os comandos exibidos em Ajuda.');
}
$('sendButton').onclick=()=>{handle($('commandInput').value);$('commandInput').value=''};
$('commandInput').addEventListener('keydown',e=>{if(e.key==='Enter')$('sendButton').click()});
document.querySelectorAll('[data-command]').forEach(b=>b.onclick=()=>handle(b.dataset.command));
$('speakButton').onclick=()=>speak();$('clearButton').onclick=()=>say('Conversa limpa. Como posso ajudar?');
$('noteForm').onsubmit=e=>{e.preventDefault();addNote($('noteInput').value);$('noteInput').value=''};
$('reminderForm').onsubmit=e=>{e.preventDefault();addReminder($('reminderText').value,$('reminderTime').value);if(lastAnswer.startsWith('Lembrete criado')){$('reminderText').value='';$('reminderTime').value=''}};
let recognition;
const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
if(SpeechRecognition){recognition=new SpeechRecognition();recognition.lang='pt-BR';recognition.interimResults=false;recognition.maxAlternatives=1;recognition.onstart=()=>{$('voiceButton').classList.add('listening');$('statusText').textContent='OUVINDO';$('voiceHint').textContent='Pode falar...'};recognition.onend=()=>{$('voiceButton').classList.remove('listening');$('statusText').textContent='SISTEMA PRONTO'};recognition.onerror=e=>say('Não consegui ouvir. Verifique a permissão do microfone e tente novamente ('+e.error+').');recognition.onresult=e=>{const t=e.results[0][0].transcript;$('commandInput').value=t;handle(t)}}
$('voiceButton').onclick=()=>{if(!recognition){say('O reconhecimento de voz não está disponível neste navegador. Use o campo de texto ou abra pelo Chrome atualizado.');return}try{recognition.start()}catch{say('O microfone já está ativo. Aguarde e tente novamente.')}};
async function requestNotifications(){if(!('Notification'in window))return false;if(Notification.permission==='granted')return true;if(Notification.permission==='denied')return false;return (await Notification.requestPermission())==='granted'}
async function checkReminders(){const a=store.get('reminders');let changed=false;for(const r of a){if(!r.done&&new Date(r.time).getTime()<=Date.now()){r.done=true;changed=true;if('Notification'in window&&Notification.permission==='granted'&&navigator.serviceWorker?.controller){navigator.serviceWorker.ready.then(reg=>reg.showNotification('Lembrete do JARVIS',{body:r.text,icon:'icons/icon-192.png'}))}else{say('Lembrete: '+r.text)}}}if(changed){store.set('reminders',a);renderReminders()}}
$('reminderTime').min=new Date(Date.now()+60000).toISOString().slice(0,16);
renderNotes();renderReminders();setInterval(checkReminders,15000);
if('serviceWorker'in navigator&&location.protocol!=='file:'){navigator.serviceWorker.register('./sw.js').catch(()=>{$('statusText').textContent='MODO NAVEGADOR'})}
if('Notification'in window&&Notification.permission==='default'){$('statusText').textContent='SISTEMA PRONTO'}
