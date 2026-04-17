/**
 * LÓGICA DO QUIZ NENEXONINHO
 * Atualizado com sistema de macros e informações dinâmicas
 */

const quizData = {
    steps: [
        {
            id: 'landing',
            title: 'Descubra Em 2 Minutos Como Seu Bebê Pode Aprender a Dormir Sem Ser Mamando',
            image: 'quizbanner.jpeg',
            type: 'landing',
            bullets: [
                'O potencial do seu bebê para dormir a noite toda',
                'O método personalizado ideal para seu caso',
                'Quanto tempo você poderia recuperar para si mesma'
            ],
            buttonText: 'Começar Agora',
            showProgress: false
        },
        {
            id: 'social-proof',
            title: 'Mais de 25 mil',
            subtitle: 'É o número de mães que já ajudamos a conquistarem noites tranquilas, através deste projeto.',
            image: 'quizbanner2.jpeg',
            type: 'info',
            buttonText: 'Continuar',
            progress: 0
        },
        {
            id: 'dream',
            title: 'Para começar, me conte uma coisa boa:',
            subtitle: 'Qual dessas conquistas você mais sonha realizar?',
            type: 'options',
            progress: 10,
            options: [
                { emoji: '🌸', text: 'Ter mais tempo para cuidar de mim mesma' },
                { emoji: '😴', text: 'Ver meu bebê dormindo tranquilo a noite toda' },
                { emoji: '⚡', text: 'Recuperar minha energia e disposição' },
                { emoji: '👩‍❤️‍💋‍👨', text: 'Ter momentos especiais com meu parceiro(a)' }
            ]
        },
        {
            id: 'age',
            title: 'Qual a idade do seu bebê?',
            type: 'options',
            progress: 25,
            options: [
                { emoji: '👶', text: '0-3 meses' },
                { emoji: '👩‍🍼', text: '4-6 meses' },
                { emoji: '🚼', text: '7-12 meses' },
                { emoji: '🍼', text: 'Mais de 1 ano' }
            ]
        },
        {
            id: 'habit',
            title: 'Como seu bebê costuma adormecer?',
            subtitle: 'Escolha a opção mais frequente:',
            type: 'options',
            progress: 40,
            options: [
                { emoji: '😐', text: 'Sempre precisa do peito/mamadeira até adormecer' },
                { emoji: '😅', text: 'Às vezes dorme sem peito/mamadeira, mas é raro' },
                { emoji: '😶', text: 'Adormece sem peito/mamadeira, mas acorda na madrugada procurando' },
                { emoji: '😑', text: 'Precisa do peito/mamadeira em todos os sonos do dia e da noite' }
            ]
        },
        {
            id: 'wakeups',
            title: 'Quantas vezes ele acorda por noite?',
            type: 'options',
            progress: 55,
            options: [
                { emoji: '🥱', text: '1 a 2 vezes' },
                { emoji: '😫', text: '3 a 5 vezes' },
                { emoji: '😵', text: 'Mais de 5 vezes' },
                { emoji: '😇', text: 'Dorme a noite toda' }
            ]
        },
        {
            id: 'environment',
            title: 'Onde o bebê dorme a maior parte da noite?',
            type: 'options',
            progress: 70,
            options: [
                { emoji: '🛏️', text: 'No berço dele' },
                { emoji: '👩‍👦', text: 'Cama compartilhada' },
                { emoji: '🤱', text: 'No colo ou carrinho' },
                { emoji: '🏠', text: 'Varia muito entre as opções' }
            ]
        },
        // --- NOVA TELA DINÂMICA (ALERTA) ---
        {
            id: 'did-you-know',
            title: 'Você sabia?',
            subtitle: 'Se seu bebê tem {{idade_texto}}, você já passou aproximadamente:',
            type: 'alert',
            progress: 75,
            alertValue: '{{horas_perdidas}}',
            alertSubtitle: 'O que equivale a {{dias_perdidos}} acordada tentando fazê-lo dormir!',
            buttonText: 'Continuar'
        },
        {
            id: 'willingness',
            title: 'Se existisse um método gentil...',
            subtitle: 'Que pudesse ajudar seu bebê a dormir sem precisar do peito em apenas 3 dias, quanto isso mudaria sua vida?',
            type: 'options',
            progress: 85,
            layout: 'grid-2',
            cardStyle: 'vertical',
            options: [
                { emoji: '✅', text: 'Seria uma transformação completa' },
                { emoji: '🤔', text: 'Ajudaria muito, gostaria de saber mais' }
            ]
        },
        {
            id: 'mother-feeling',
            title: 'Como você se sente hoje em relação ao sono?',
            type: 'options',
            progress: 95,
            options: [
                { emoji: '🌋', text: 'No meu limite, exausta' },
                { emoji: '☁️', text: 'Cansada, mas tentando lidar' },
                { emoji: '💪', text: 'Ainda tenho energia, mas quero melhorar' }
            ]
        },
        {
            id: 'loader',
            title: 'Analisando seu perfil...',
            type: 'loader',
            progress: 100,
            items: [
                'Calculando o potencial de sono do seu bebê',
                'Avaliando o impacto das noites picadas',
                'Identificando padrões de {{idade_texto}}',
                'Preparando seu resultado'
            ]
        },
        {
            id: 'final',
            title: 'Resultado da sua análise',
            subtitle: 'Com base em suas respostas, identificamos que seu bebê tem:',
            image: 'quizbanner.jpeg',
            type: 'final',
            buttonText: 'Ver Solução Recomendada'
        },
        {
            id: 'pitch',
            type: 'pitch',
            buttonText: 'QUERO COMEÇAR AGORA',
            ctaUrl: 'https://pay.hotmart.com/B105422450G?checkoutMode=10'
        }
    ]
};

let currentStepIndex = 0;
const answers = {};

// Elementos DOM
const appContainer = document.getElementById('step-content');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');

// Sistema de processamento de texto dinâmico
function processText(text) {
    if (!text) return text;
    let newText = text;

    const age = answers['age'] || '';
    let ageText = 'alguns meses';
    let hoursText = 'centenas de horas';
    let daysText = 'vários dias';

    if (age.includes('7-12 meses')) {
        ageText = 'de 7 a 12 meses';
        hoursText = '990 horas';
        daysText = 'mais de 41 dias completos';
    } else if (age.includes('Mais de 1 ano')) {
        ageText = 'mais de 1 ano';
        hoursText = '1.170 horas';
        daysText = 'quase 50 dias seguidos';
    } else if (age.includes('0-3 meses')) {
        ageText = 'de 0 a 3 meses';
        hoursText = 'mais de 200 horas';
        daysText = 'mais de 8 dias diretos';
    } else if (age.includes('4-6 meses')) {
        ageText = 'de 4 a 6 meses';
        hoursText = 'mais de 500 horas';
        daysText = 'mais de 20 dias inteiros';
    }

    newText = newText.replace(/{{idade_texto}}/g, ageText);
    newText = newText.replace(/{{horas_perdidas}}/g, hoursText);
    newText = newText.replace(/{{dias_perdidos}}/g, daysText);

    return newText;
}

function init() {
    setTimeout(renderStep, 100);
}

function renderStep() {
    const step = quizData.steps[currentStepIndex];
    appContainer.innerHTML = '';

    appContainer.classList.remove('active');
    setTimeout(() => {
        appContainer.classList.add('active');
    }, 50);

    // Progresso
    if (step.progress !== undefined) {
        progressContainer.style.display = 'block';
        setTimeout(() => {
            progressBar.style.width = `${step.progress}%`;
        }, 50);
    } else {
        progressContainer.style.display = 'none';
        progressBar.style.width = '0%';
    }

    // Título Dinâmico
    const title = document.createElement('h1');
    title.innerText = processText(step.title);
    appContainer.appendChild(title);

    // Subtítulo Dinâmico
    if (step.subtitle) {
        const sub = document.createElement('p');
        sub.className = 'subtitle';
        sub.innerText = processText(step.subtitle);
        appContainer.appendChild(sub);
    }

    // Imagem
    if (step.image) {
        const imgDiv = document.createElement('div');
        imgDiv.className = 'image-container';
        imgDiv.innerHTML = `<img src="${step.image}" alt="Imagem do quiz">`;
        appContainer.appendChild(imgDiv);
    }

    // --- Lógica por tipo ---
    if (step.type === 'landing') {
        const list = document.createElement('div');
        list.className = 'check-list';
        step.bullets.forEach((text, index) => {
            const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            list.innerHTML += `<p style="animation: fadeUp 0.5s ease forwards; animation-delay: ${index * 0.15}s; opacity: 0;"><span class="icon-check">${svgIcon}</span> ${processText(text)}</p>`;
        });
        appContainer.appendChild(list);

        const btn = document.createElement('button');
        btn.className = 'btn-primary pulse';
        btn.innerText = step.buttonText;
        btn.style.animation = `fadeUp 0.5s ease forwards`;
        btn.style.animationDelay = `${step.bullets.length * 0.15}s`;
        btn.style.opacity = '0';
        btn.onclick = nextStep;
        appContainer.appendChild(btn);

    } else if (step.type === 'info') {
        const btn = document.createElement('button');
        btn.className = 'btn-primary';
        btn.innerText = step.buttonText;
        btn.onclick = nextStep;
        appContainer.appendChild(btn);

    } else if (step.type === 'alert') {
        const box = document.createElement('div');
        box.className = 'alert-box';

        box.innerHTML = `
            <div class="alert-value">${processText(step.alertValue)}</div>
            <p class="alert-subtitle-text">${processText(step.alertSubtitle)}</p>
        `;
        appContainer.appendChild(box);

        const btn = document.createElement('button');
        btn.className = 'btn-primary pulse';
        btn.innerText = step.buttonText || 'Continuar';
        btn.onclick = nextStep;
        appContainer.appendChild(btn);

    } else if (step.type === 'options') {
        const grid = document.createElement('div');
        grid.className = 'options-grid';
        if (step.layout === 'grid-2') {
            grid.classList.add('grid-2');
        }

        step.options.forEach((opt, index) => {
            const card = document.createElement('div');
            card.className = 'option-card';
            if (step.cardStyle === 'vertical') {
                card.classList.add('vertical');
            }
            card.style.animationDelay = `${index * 0.1}s`;

            if (step.cardStyle === 'vertical') {
                card.innerHTML = `
                    <div class="option-text">${processText(opt.text)}</div>
                    <div class="option-emoji">${opt.emoji}</div>
                `;
            } else {
                card.innerHTML = `
                    <div class="option-emoji">${opt.emoji}</div>
                    <div class="option-text">${processText(opt.text)}</div>
                `;
            }
            card.onclick = () => {
                answers[step.id] = opt.text;
                nextStep();
            };
            grid.appendChild(card);
        });
        appContainer.appendChild(grid);

    } else if (step.type === 'loader') {
        const loaderContainer = document.createElement('div');
        loaderContainer.className = 'loader-container';

        const svgCheck = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

        step.items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'loader-item';
            div.innerHTML = `<div class="spinner"></div> <span class="text">${processText(item)}</span>`;
            loaderContainer.appendChild(div);

            setTimeout(() => {
                div.classList.add('active');
                setTimeout(() => {
                    div.classList.add('done');
                    const spinnerEl = div.querySelector('.spinner');
                    if (spinnerEl) {
                        const doneIcon = document.createElement('div');
                        doneIcon.className = 'done-icon';
                        doneIcon.innerHTML = svgCheck;
                        spinnerEl.replaceWith(doneIcon);
                    }
                }, 900);
            }, index * 1300);
        });
        appContainer.appendChild(loaderContainer);

        setTimeout(nextStep, (step.items.length * 1300) + 1200);

    } else if (step.type === 'final') {
        const resultContainer = document.createElement('div');

        // Novo título principal com o subtitulo (pode vir do step, já renderizado, 
        // mas vamos adicionar o grid customizado a ele).

        // Grid (Card do Gráfico e Imagem)
        const grid = document.createElement('div');
        grid.className = 'result-grid';

        // Card do Gráfico
        const graphCard = document.createElement('div');
        graphCard.className = 'result-card';
        graphCard.innerHTML = `
            <div class="result-graph-title">Chance de dormir sem ser mamando em 3 dias</div>
            <div class="circular-chart" id="resultChart">
                <span class="circular-percent">0%</span>
            </div>
        `;

        // Card da Imagem
        const imageCard = document.createElement('div');
        imageCard.className = 'result-card';
        imageCard.innerHTML = `
            <div style="font-size: 0.85rem; font-weight:700; margin-bottom: 24px">Resultado: 🤩 Bom</div>
            <div class="result-image"><img src="quizbanner.jpeg"></div>
        `;

        grid.appendChild(graphCard);
        grid.appendChild(imageCard);
        resultContainer.appendChild(grid);

        // Alerta Amarelo
        const alertBox = document.createElement('div');
        alertBox.className = 'alert-yellow';
        alertBox.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
            <span>Descobrimos 3 pontos importantes</span>
        `;
        resultContainer.appendChild(alertBox);

        // Lista de Análises
        const list = document.createElement('div');
        list.className = 'analysis-list';
        list.innerHTML = `
            <div class="analysis-item">
                <div class="analysis-icon">🪄</div>
                <div class="analysis-content">
                    <h4>A Hora Certa</h4>
                    <p>Seu bebê está na fase ideal para aprender a dormir sem mamar</p>
                </div>
            </div>
            <div class="analysis-item">
                <div class="analysis-icon">⚓</div>
                <div class="analysis-content">
                    <h4>Nível da Associação</h4>
                    <p>A associação atual com o peito/mamadeira é forte</p>
                </div>
            </div>
            <div class="analysis-item">
                <div class="analysis-icon">⏳</div>
                <div class="analysis-content">
                    <h4>Nível de saúde</h4>
                    <p>Você perdeu ${processText('{{horas_perdidas}}')} tentando fazê-lo dormir. Isso representa ${processText('{{dias_perdidos}}')}!</p>
                </div>
            </div>
        `;
        resultContainer.appendChild(list);

        const btn = document.createElement('button');
        btn.className = 'btn-primary pulse';
        btn.innerText = 'Ver Solução Recomendada' || step.buttonText;
        btn.style.backgroundColor = '#059669'; // verde do botão
        btn.onclick = nextStep;
        resultContainer.appendChild(btn);

        appContainer.appendChild(resultContainer);

        // Lógica para animar o gráfico linearmente de 0 a 87
        setTimeout(() => {
            const chart = document.getElementById('resultChart');
            const percentLabel = chart.querySelector('.circular-percent');
            let val = 0;
            const targetVal = 87;
            const interval = setInterval(() => {
                val++;
                chart.style.background = `conic-gradient(#059669 ${val * 3.6}deg, #e2e8f0 0deg)`;
                percentLabel.innerText = `${val}%`;
                if (val >= targetVal) clearInterval(interval);
            }, 25);
        }, 500);

    } else if (step.type === 'pitch') {
        const pitchContainer = document.createElement('div');

        let pitchHtml = `
            <div class="pitch-header">
                <h2>ÓTIMAS NOTÍCIAS!</h2>
                <p style="margin-bottom:16px;">Você está exatamente onde milhares de outras mães estavam antes de descobrirem o Desafio de 3 Dias: Meu NeneXoninho.</p>
                <div class="bullets-list" style="text-align:left; font-size:0.95rem;">
                    <p><b>O que descobrimos sobre sua situação:</b></p>
                    <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Seu bebê tem a idade ideal para o método.</p>
                    <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Seu nível de exaustão está afetando sua qualidade de vida.</p>
                    <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Você está pronta para uma mudança gentil e eficaz.</p>
                </div>
                <h2>A BOA NOTÍCIA É:</h2>
                <p>Você não precisa continuar assim. Nosso método já ajudou mais de 25.000 famílias e pode ajudar você também.</p>
            </div>
            
            <div class="chart-grid">
                <div class="chart-col">
                    <div class="chart-title">Resultado atual</div>
                    <div class="bar-bg"><div class="bar-fill" style="background:#dc2626; height:0%" data-target="20"></div></div>
                    <div class="chart-subtitle">HOJE</div>
                    <div class="chart-desc">Seu bebê só dorme mamando</div>
                </div>
                <div class="chart-col">
                    <div class="chart-title">Resultado em 1 dia</div>
                    <div class="bar-bg"><div class="bar-fill" style="background:#10b981; height:0%" data-target="40">40%</div></div>
                    <div class="chart-subtitle">DIA 1</div>
                    <div class="chart-desc">Aprende a Técnica da Vaquinha</div>
                </div>
                <div class="chart-col">
                    <div class="chart-title">Resultado em 2 dias</div>
                    <div class="bar-bg"><div class="bar-fill" style="background:#10b981; height:0%" data-target="60">60%</div></div>
                    <div class="chart-subtitle">DIA 2</div>
                    <div class="chart-desc">Primeiros resultados</div>
                </div>
                <div class="chart-col">
                    <div class="chart-title">Resultado em 3 dias</div>
                    <div class="bar-bg"><div class="bar-fill" style="background:#10b981; height:0%" data-target="80">80%</div></div>
                    <div class="chart-subtitle">DIA 3</div>
                    <div class="chart-desc">Bebê dormindo sem ser mamando</div>
                </div>
            </div>
            
            <div class="alert-yellow" style="margin-bottom:32px; flex-direction:column; align-items:flex-start; text-align:left; gap:8px">
                <span style="font-size:1.1rem">🔥 Seu Desafio Prático de 3 Dias Para Ensinar Seu Bebê a Dormir Sem Ser Mamando</span>
                <p style="font-size:0.95rem; color:#111827;">Em no máximo 3 Dias o seu bebê não dependerá mais do peito para dormir, e <u>você poderá descansar</u> como fazia antes.</p>
            </div>

            <button class="btn-primary pulse" style="background-color:#059669; margin-bottom:24px" onclick="window.location.href='${step.ctaUrl}'">${step.buttonText}</button>
            
            <div class="pricing-box">
                <div class="pricing-left">
                    <div style="background:#d1fae5; border-radius:50%; width:32px; height:32px; min-width:32px; display:flex; align-items:center; justify-content:center; color:#059669">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <div class="pricing-left-text">
                        <span class="old-price">De R$197,00</span>
                        <span class="trial">TESTE POR 7 DIAS</span>
                    </div>
                </div>
                <div class="pricing-right">
                    <p>Por apenas</p>
                    <h3>R$ 37,90</h3>
                </div>
            </div>
            
            <div class="bullets-list" style="text-align:left;">
                <p><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Garantia de 7 dias</p>
                <p><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Método 100% gentil (não precisa deixar bebê chorando sozinho)</p>
                <p><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Resultados em 72 horas (3 dias)</p>
            </div>
            
            <div class="guarantee-box">
                <span>🏵️</span>
                <h3>O seu bebê dormindo sem ser mamando ou <strong>o seu dinheiro de volta!</strong></h3>
                <p>Todo o passo a passo deve ser feito por 3 dias consecutivos, esse é o tempo que várias mamães precisaram para verem seus bebês dormindo melhor sem o peito. Por esse motivo, com a nossa garantia de 7 dias, você não corre nenhum risco. Se em 7 dias ou menos, você aplicar as técnicas e não ver nenhum resultado, devolvemos 100% do seu dinheiro.</p>
            </div>
            
            <button class="btn-primary pulse" style="background-color:#059669; margin-bottom:24px" onclick="window.location.href='${step.ctaUrl}'">${step.buttonText}</button>
            
        `;
        pitchContainer.innerHTML = pitchHtml;
        appContainer.appendChild(pitchContainer);

        // Animação das barras
        setTimeout(() => {
            const fills = pitchContainer.querySelectorAll('.bar-fill');
            fills.forEach(fill => {
                const target = fill.getAttribute('data-target');
                fill.style.height = target + '%';
            });
        }, 300);


    }
}

function nextStep() {
    if (currentStepIndex < quizData.steps.length - 1) {
        appContainer.classList.remove('active');
        appContainer.style.transform = 'translateY(-15px)';

        setTimeout(() => {
            currentStepIndex++;
            renderStep();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 400);
    }
}

document.addEventListener('DOMContentLoaded', init);
