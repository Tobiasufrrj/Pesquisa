let images = [];
let currentIndex = 0;
let pauseShown = false;
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
        return;
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
    updateProgressBar();
}

function submitAnswer(answer) {
    const formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSffj5vaGzP7l5D0nGrYRytNADQtbKGr1-Df-6xJgIOgKc5HbA/formResponse';

    const dados = new URLSearchParams();
    dados.append('entry.1536112537', dadosIniciais.idade);
    dados.append('entry.530226893', dadosIniciais.genero);
    dados.append('entry.1687929616', dadosIniciais.escolaridade);
    dados.append('entry.1224577743', images[currentIndex].split('/').pop());
    dados.append('entry.138354110', answer);

    fetch(formURL, {
        method: 'POST',
        mode: 'no-cors',
        body: dados
    }).then(() => {
        currentIndex++;
        showImage();
    }).catch(error => {
        console.error("Erro ao enviar resposta:", error);
        currentIndex++;
        showImage();
    });
}

function updateProgressBar() {
    const percentage = Math.round((currentIndex / images.length) * 100);
    setProgress(percentage);
}

function endSurvey() {
    document.getElementById('survey-screen').style.display = 'none';
    document.getElementById('end-screen').style.display = 'block';
}

function setProgress(percent) {
    const text = document.getElementById('liquid-text');
    const fill = document.getElementById('liquid-fill');
    const liquidGroup = document.getElementById('liquid-group');

    percent = Math.max(0, Math.min(percent, 100));
    text.textContent = `${percent}%`;

    const maxWidth = 300;
    const newWidth = (maxWidth * percent) / 100;
    fill.setAttribute("width", newWidth);

    if (liquidGroup) {
        liquidGroup.style.display = "block";
    }
}
