let images = [];
let currentIndex = 0;
let pauseShown = false;
let responses = [];
let dadosIniciais = {};

for (let i = 1; i <= 50; i++) {
    images.push(`imagens/${i}.png`);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function goToForm() {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('form-screen').style.display = 'block';
}

function startSurvey() {
    const idade = document.getElementById('idade').value;
    const genero = document.getElementById('genero').value;
    const escolaridade = document.getElementById('escolaridade').value;

    if (!idade || !genero || !escolaridade) {
        alert("Por favor, preencha todos os campos antes de começar.");
        return;
    }

    dadosIniciais = { idade, genero, escolaridade };
    shuffle(images);

    document.getElementById('form-screen').style.display = 'none';
    document.getElementById('survey-screen').style.display = 'block';
    showImage();
    setProgress(0);
}

function showImage() {
    if (currentIndex === 24 && !pauseShown) {
        pauseShown = true;
        document.getElementById('survey-screen').style.display = 'none';
        document.getElementById('mid-screen').style.display = 'block';
        return; // 👈 só pausa, e espera ação do usuário
    }

    if (currentIndex < images.length) {
        document.getElementById('portrait').src = images[currentIndex];
        updateProgressBar();
    } else {
        endSurvey();
    }
}

function continueSurvey() {
    document.getElementById('mid-screen').style.display = 'none';
    document.getElementById('survey-screen').style.display = 'block';
    showImage();
    updateProgressBar(); // ✅ garante continuidade da barra após pausa
}

function submitAnswer(answer) {
    responses.push({
        imagem: images[currentIndex],
        resposta: answer,
        timestamp: new Date().toISOString()
    });

    currentIndex++;

    // Verifica se é o momento de exibir a pausa
    if (currentIndex === 24 && !pauseShown) {
        showImage(); // Isso aciona a pausa corretamente
    } else {
        showImage(); // Continua normalmente
    }
}

function updateProgressBar() {
    const percentage = Math.round((currentIndex / images.length) * 100);
    setProgress(percentage);
}


function endSurvey() {
    document.getElementById('survey-screen').style.display = 'none';
    document.getElementById('end-screen').style.display = 'block';
    downloadResponses();
}

function downloadResponses() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Idade,Genero,Escolaridade\n";
    csvContent += `${dadosIniciais.idade},${dadosIniciais.genero},${dadosIniciais.escolaridade}\n\n`;
    csvContent += "Imagem,Resposta,Timestamp\n";
    responses.forEach(row => {
        csvContent += `${row.imagem},${row.resposta},${row.timestamp}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "respostas_pesquisa_pardos.csv");
    document.body.appendChild(link);
    link.click();
}

function setProgress(percent) {
    const text = document.getElementById('liquid-text');
    const fill = document.getElementById('liquid-fill');
    const liquidGroup = document.getElementById('liquid-group');
  
    // Garante que o valor fique entre 0 e 100
    percent = Math.max(0, Math.min(percent, 100));
  
    // Atualiza o texto no centro
    text.textContent = `${percent}%`;
  
    // Calcula a nova largura do líquido
    const maxWidth = 300; // largura total do SVG
    const newWidth = (maxWidth * percent) / 100;
  
    // Aplica nova largura ao retângulo de preenchimento
    fill.setAttribute("width", newWidth);
  
    // Exibe o grupo de líquido (onda + bolhas)
    if (liquidGroup) {
      liquidGroup.style.display = "block";
    }
  }