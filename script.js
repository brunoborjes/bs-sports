// Script Principal - BS SPORTS

document.addEventListener('DOMContentLoaded', () => {
    
    // --- CABEÇALHO COM SCROLL ---
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- MENU MOBILE ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMobile = document.getElementById('nav-mobile');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileMenuBtn.addEventListener('click', () => {
        navMobile.classList.toggle('active');
        if(navMobile.classList.contains('active')){
            mobileMenuBtn.innerHTML = '✕';
        } else {
            mobileMenuBtn.innerHTML = '☰';
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMobile.classList.remove('active');
            mobileMenuBtn.innerHTML = '☰';
        });
    });

    // --- SISTEMA DE ABAS (EVENTOS) ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- FORMULÁRIO DINÂMICO (ATLETAS) ---
    const athletesList = document.getElementById('athletesList');
    const addAthleteBtn = document.getElementById('addAthleteBtn');
    let athleteCount = 0;

    function addAthleteRow() {
        athleteCount++;
        const row = document.createElement('div');
        row.className = 'athlete-row';
        row.id = `athlete-${athleteCount}`;
        row.style.animation = "fadeIn 0.3s ease"; // Efeito suave de entrada
        
        row.innerHTML = `
            <div class="form-group">
                <input type="text" class="athlete-name" placeholder="Nome Completo do Atleta" required>
            </div>
            <div class="form-group">
                <input type="date" class="athlete-birth" placeholder="Data Nasc." required>
            </div>
            <div class="form-group">
                <input type="text" class="athlete-doc" placeholder="Nº Camisa / RG">
            </div>
            <button type="button" class="remove-btn" aria-label="Remover atleta" onclick="removeAthlete(${athleteCount})">✕</button>
        `;
        
        athletesList.appendChild(row);
    }

    addAthleteRow();

    addAthleteBtn.addEventListener('click', addAthleteRow);

    window.removeAthlete = function(id) {
        const row = document.getElementById(`athlete-${id}`);
        if(row) {
            row.style.opacity = '0';
            setTimeout(() => row.remove(), 300);
        }
    }

    // --- INTEGRAÇÃO COM PLANILHA (GOOGLE SHEETS - INSCRIÇÕES) ---
    const GOOGLE_SHEETS_WEB_APP_URL = 'COLE_AQUI_A_URL_DO_SEU_APPS_SCRIPT';
    const form = document.getElementById('registrationForm');
    const formMessage = document.getElementById('formMessage');

    function collectAthletes() {
        const rows = athletesList.querySelectorAll('.athlete-row');
        return Array.from(rows).map(row => ({
            nome: row.querySelector('.athlete-name').value,
            nascimento: row.querySelector('.athlete-birth').value,
            documento: row.querySelector('.athlete-doc').value
        }));
    }

    function showMessage(text, color) {
        formMessage.innerHTML = `<span style="color: ${color}; display: block; margin-top: 1rem; text-align: center; font-weight: 500;">${text}</span>`;
        setTimeout(() => {
            formMessage.innerHTML = '';
        }, 5000);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Enviando aguarde...';
        submitBtn.disabled = true;

        const formData = {
            equipe: document.getElementById('teamName').value,
            modalidade: document.getElementById('sport').value,
            categoria: document.getElementById('category').value,
            responsavel: document.getElementById('manager').value,
            telefone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            observacoes: document.getElementById('notes').value,
            atletas: collectAthletes()
        };

        const isConfigured = GOOGLE_SHEETS_WEB_APP_URL && GOOGLE_SHEETS_WEB_APP_URL !== 'COLE_AQUI_A_URL_DO_SEU_APPS_SCRIPT';

        try {
            if (isConfigured) {
                await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
            } else {
                await new Promise(resolve => setTimeout(resolve, 1500));
                console.log('Dados da inscrição (simulação):', formData);
            }

            form.reset();
            athletesList.innerHTML = '';
            athleteCount = 0;
            addAthleteRow();

            showMessage('Inscrição enviada com sucesso! Entraremos em contato.', '#4CAF50');
        } catch (err) {
            console.error('Erro ao enviar inscrição:', err);
            showMessage('Não foi possível enviar sua inscrição. Tente novamente.', '#ff4444');
        } finally {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    });

    // --- INTEGRAÇÃO COM CMS (GOOGLE SHEETS PARA EVENTOS) ---
    const API_EVENTOS_URL = 'COLE_AQUI_A_URL_DO_APP_DA_WEB'; 

    async function carregarProximosEventos() {
        const containerProximos = document.getElementById('proximos-grid');
        
        if (!containerProximos) return;

        containerProximos.innerHTML = '<p style="text-align:center; width:100%; color:var(--color-gold);">Carregando próximos eventos...</p>';

        try {
            const response = await fetch(API_EVENTOS_URL);
            const eventos = await response.json();
            
            containerProximos.innerHTML = '';

            const eventosAtivos = eventos.filter(e => e.Status === 'Em Breve' || e.Status === 'Inscrições Abertas');

            if (eventosAtivos.length === 0) {
                containerProximos.innerHTML = '<p style="text-align:center; width:100%; color:#888;">Nenhum evento programado no momento.</p>';
                return;
            }

            eventosAtivos.forEach(evento => {
                const badgeClass = evento.Status === 'Inscrições Abertas' ? 'badge-outline' : 'badge-gray';
                
                const cardHTML = `
                    <div class="event-card">
                        <img class="event-img" src="${evento.Imagem}" alt="${evento.Titulo}" loading="lazy">
                        <div class="event-info">
                            <span class="event-badge ${badgeClass}">${evento.Status}</span>
                            <h3 class="event-title">${evento.Titulo}</h3>
                            <p class="event-detail">Modalidade: ${evento.Modalidade}</p>
                            <p class="event-detail">Data: ${evento.Data}</p>
                            <p class="event-detail">Local: ${evento.Local}</p>
                            ${evento.Status === 'Inscrições Abertas' 
                                ? '<a href="#inscricao" class="btn btn-primary" style="margin-top: 1rem; width: 100%; text-align:center; display: block;">Inscrever-se</a>' 
                                : '<button class="btn btn-outline" style="margin-top: 1rem; width: 100%;">Ver Detalhes</button>'}
                        </div>
                    </div>
                `;
                containerProximos.innerHTML += cardHTML;
            });

        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
            // Para não ficar vazio, inserimos as mensagens dentro de onde seria o grid
            containerProximos.innerHTML = '<p style="text-align:center; width:100%; color:#ff4444;">Erro ao carregar os eventos da planilha.</p>';
        }
    }

    carregarProximosEventos();
});