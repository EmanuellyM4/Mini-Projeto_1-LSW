
let etapaAtual = 0; // 0 = vereador, 1 = prefeito, 2 = fim
let numero = '';
let votoEmBranco = false;
let votoNulo = false;
let votoConfirmado = false;


function iniciar() {
    atualizarInterface();
}


function atualizarInterface() {
    const cargoTitulo = document.getElementById('cargo-titulo');
    const numerosContainer = document.getElementById('numeros-container');
    const infoCandidato = document.getElementById('info-candidato');
    const fotoCandidato = document.getElementById('foto-candidato');
    const fotoVice = document.getElementById('foto-vice');
    const legendaFoto = document.getElementById('legenda-foto');
    
    
    numerosContainer.innerHTML = '';
    
    
    let digitos = 0;
    if (etapaAtual < 2) {
        digitos = candidatos[etapaAtual].numeros;
    }
    
    for (let i = 0; i < digitos; i++) {
        const div = document.createElement('div');
        div.className = 'numero';
        if (i === numero.length && etapaAtual < 2) {
            div.classList.add('pisca');
        }
        div.id = `numero-${i}`;
        if (numero[i]) {
            div.innerHTML = numero[i];
        }
        numerosContainer.appendChild(div);
    }
    
    
    if (etapaAtual < 2) {
        cargoTitulo.innerHTML = candidatos[etapaAtual].titulo;
    }
    
    
    if (etapaAtual < 2 && numero.length === digitos && !votoEmBranco) {
        const candidato = encontrarCandidatoPorNumero(numero, etapaAtual);
        
        if (candidato) {
            infoCandidato.innerHTML = `
                Nome: ${candidato.nome}<br/>
                Partido: ${candidato.partido}<br/>
                ${etapaAtual === 1 ? `Vice-Prefeito: ${candidato.vice}` : `Número: ${candidato.numero}`}
            `;
            
            
            if (candidato.fotos) {
                if (candidato.fotos[0]) {
                    fotoCandidato.innerHTML = `
                        <img src="${candidato.fotos[0].url}" alt="${candidato.nome}" />
                        ${candidato.fotos[0].legenda}
                    `;
                }
                
                if (candidato.fotos[1]) {
                    fotoVice.style.display = 'block';
                    fotoVice.innerHTML = `
                        <img src="${candidato.fotos[1].url}" alt="${candidato.vice}" />
                        ${candidato.fotos[1].legenda}
                    `;
                } else {
                    fotoVice.style.display = 'none';
                }
            }
        } else {
            
            infoCandidato.innerHTML = '<span style="color: red;">VOTO NULO</span>';
            fotoCandidato.innerHTML = '';
            fotoVice.style.display = 'none';
            votoNulo = true;
        }
    } else if (votoEmBranco) {
        
        infoCandidato.innerHTML = '<span style="color: blue;">VOTO EM BRANCO</span>';
        fotoCandidato.innerHTML = '';
        fotoVice.style.display = 'none';
    } else if (etapaAtual === 2) {
        
        document.querySelector('.d-1').innerHTML = `
            <div class="tela-fim">
                <div class="aviso--gigante">FIM</div>
                <div class="aviso--grande">Obrigado por votar!</div>
            </div>
        `;
        document.querySelector('.d-2').style.display = 'none';
    } else {
        
        infoCandidato.innerHTML = 'Nome:<br/>Partido:<br/>Vice-Prefeito:';
        fotoCandidato.innerHTML = '<img src="images/84.jpg" alt="" />Prefeito';
        fotoVice.innerHTML = '<img src="images/84_2.jpg" alt="" />Vice-Prefeito';
        fotoVice.style.display = 'block';
        votoNulo = false;
    }
}


function encontrarCandidatoPorNumero(num, etapa) {
    return candidatos[etapa].candidatos.find(c => c.numero === num);
}


function clicou(n) {
    if (etapaAtual >= 2) return;
    
    const digitos = candidatos[etapaAtual].numeros;
    if (numero.length < digitos) {
        numero += n;
        atualizarInterface();
    }
}


function branco() {
    if (etapaAtual >= 2) return;
    
    votoEmBranco = true;
    numero = '';
    atualizarInterface();
}


function corrige() {
    if (etapaAtual >= 2) return;
    
    votoEmBranco = false;
    votoNulo = false;
    numero = '';
    atualizarInterface();
}


function confirma() {
    if (etapaAtual >= 2) return;
    
    const digitos = candidatos[etapaAtual].numeros;
    
    
    if (numero.length === digitos || votoEmBranco) {
        votoConfirmado = true;
        registrarVoto();
        
        
        setTimeout(() => {
            etapaAtual++;
            votoEmBranco = false;
            votoNulo = false;
            numero = '';
            votoConfirmado = false;
            atualizarInterface();
        }, 1000);
    }
}


function registrarVoto() {
    
    let votos = JSON.parse(localStorage.getItem('votos')) || {
        vereadores: {},
        prefeitos: {},
        brancosVereadores: 0,
        brancosPrefeitos: 0,
        nulosVereadores: 0,
        nulosPrefeitos: 0
    };
    
    if (etapaAtual === 0) { 
        if (votoEmBranco) {
            votos.brancosVereadores++;
        } else if (votoNulo || !encontrarCandidatoPorNumero(numero, etapaAtual)) {
            votos.nulosVereadores++;
        } else {
            const candidatoNumero = numero;
            if (!votos.vereadores[candidatoNumero]) {
                votos.vereadores[candidatoNumero] = 0;
            }
            votos.vereadores[candidatoNumero]++;
        }
    } else if (etapaAtual === 1) { 
        if (votoEmBranco) {
            votos.brancosPrefeitos++;
        } else if (votoNulo || !encontrarCandidatoPorNumero(numero, etapaAtual)) {
            votos.nulosPrefeitos++;
        } else {
            const candidatoNumero = numero;
            if (!votos.prefeitos[candidatoNumero]) {
                votos.prefeitos[candidatoNumero] = 0;
            }
            votos.prefeitos[candidatoNumero]++;
        }
    }
    
    
    localStorage.setItem('votos', JSON.stringify(votos));
}


window.addEventListener('load', iniciar);