document.addEventListener("DOMContentLoaded", function () {
  // ===================== Elementos =====================  
  const seletora = document.querySelector(".Seletora"); // Seletora do sistema 
  const bypasstypestopEl = document.querySelector(`.bypasstypestop`);
  const bypasstyperunEl = document.querySelector(`.bypasstyperun`);
  const GENBYPASSEl = document.querySelector(`#GENBYPASS`)
  const SLAGINEl = document.querySelector(`#SLAGIN`)

  const rpmEl = document.getElementById("motorRPMDisplay"); // Varavel temporaria


  const motoronEl = document.querySelector(`#botaoon`)
  const motoroff = document.querySelector(`#botaooff`)

  const imgMotorEl = document.querySelector("#statusmotor"); // imagem do motor
  const imgAcumuladorEl = document.querySelector("#statusacumulador"); // Imagem do acumulador
  const imgEmbreagemEl = document.querySelector(`#statusembreagem`) // Imagem da embreagem

  const LedsecureloadEl = document.querySelector(`.SinopticoCargaProtegida`);
  const ledVerdeEls = document.querySelectorAll(".circulo-verde"); // Sinoptico verde que sinaliza que o sistema esta ok
  const ledAmareloEls = document.querySelectorAll(".circulo-amarelo"); // Sinoptico amarelo que sinaliza uma problema
  const ledVermelhoEls = document.querySelectorAll(".circulo-vermelho"); // Sinoptico vermelho que sinaliza uma falha
 
  const ledsEl = document.querySelector("#leds"); // botao teste de leds da IHM 
  const stopHornEl = document.querySelector("#stophorn"); // botao stop horn
  const languageEl = document.querySelector("#language"); // Botao selecoa de  idiomas

  const unitBypassEl = document.querySelector("#Unit-in-bypass"); // EStado de funcionamenti do sistema
  const unitEmergencyEl = document.querySelector("#Unit-in-emergency-mode"); // EStado de funcionamenti do sistema
  const unitNormalEl = document.querySelector("#Unit-in-normal-mode"); // EStado de funcionamenti do sistema
  const unitPressEl = document.querySelector("#press-sl-again"); // EStado de funcionamenti do sistema 
  const statusoffEl = document.querySelector("#statusoff"); // Sinoptico referente ao estado e posicionamento da seletora
  const statusbypassEl = document.querySelector("#statusbypass"); // Sinoptico referente ao estado e posicionamento da seletora
  const statusihmEl = document.querySelector("#statusihm"); // Sinoptico referente ao estado e posicionamento da seletora
  const statussecuredEl = document.querySelector("#statussecured"); // Sinoptico referente ao estado e posicionamento da seletora

  const btnDesligar = document.querySelector(".ConfirmaçãoDesligar"); // Elemento HTML botao desliga
  const divCirculo6 = document.querySelector(".Circulo6"); // Sinoptico de entra de rede
  const divCirculo7 = document.querySelector(".Circulo7"); // Sinoptioc de KS acumulador
  const botaoContr = document.querySelector(".Contr");  // Botao controle IHM

  const modobypassEL = document.querySelector("#modobypass"); // Botao modo baypass
  const modosecloadEL = document.querySelector("#modosecload"); // Botao modo secload
  const modostopksEL = document.querySelector("#modostopks"); // Botao modo stopKS
  const modorunEL = document.querySelector("#modorun"); // Botao modo run

  let intervaloPiscar = null; // Variavel que para a latencia do sinoptico
  let acumuladorRPM = 2820 
   
  let motorInterval = null;   // apenas um intervalo ativo
  let motorRPM = 0;
  

  // ===================== Posições e Modos =====================
  const posicoes = {
    Posição4: 0,      // CARGA PROTEGIDA
    Posição3: -40,    // CONTROLE IHM
    Posição2: -100,   // BY-PASS
    Posição1: -160,   // DESLIGAR
  };

  // ===================== Funções Auxiliares =====================
  function setUnitColors(baypass, emergency, normal, press) {
    if (unitBypassEl) unitBypassEl.style.color = baypass;
    if (unitEmergencyEl) unitEmergencyEl.style.color = emergency;
    if (unitNormalEl) unitNormalEl.style.color = normal;
    if (unitPressEl) unitPressEl.style.color = press;
  }

  function IHMColors(baypass, emergency, normal, press) { 
    if (statusoffEl) statusoffEl.style.color = baypass;
    if (statusbypassEl) statusbypassEl.style.color = emergency;
    if (statusihmEl) statusihmEl.style.color = normal;
    if (statussecuredEl) statussecuredEl.style.color = press;

    salvarIHMColors(); // ⭐ AGORA SALVA AUTOMATICO
  }

  function mostrarPopup() { // Funcao que chma o PopUp
    const popup = document.querySelector(".popup-aviso");
    if (!popup) return;

    popup.style.display = "block";
    const botaoFechar = popup.querySelector(".fechar-popup");

    if (botaoFechar) { 
      botaoFechar.addEventListener("click", () => {
        popup.style.display = "none";
      });
    }
  }

  function piscarDiv(div, divEl, cor1 = "white", cor2 = "green", intervalo = 500) { 
    if (!div || !divEl) return;

    let corAtual = cor1;
    div.style.backgroundColor = corAtual;
    divEl.style.backgroundColor = cor1;

    intervaloPiscar = setInterval(() => {
      corAtual = corAtual === cor1 ? cor2 : cor1;
      div.style.backgroundColor = corAtual;
    }, intervalo);
  }

  function pararPiscar(div) { 
    if (intervaloPiscar) {
      clearInterval(intervaloPiscar);
      intervaloPiscar = null;
      if (div) div.style.backgroundColor = "white";
    }
  }

  function marcarCheckboxes(ids, checked) { 
    ids.forEach((id) => {
      const checkbox = document.getElementById(id);

      if (checkbox) {
        checkbox.checked = (checked === undefined) ? !checkbox.checked : checked;
        salvarCheckboxes();
      }
    });
  }

  // ===================== Funções de LocalStorage =====================
  function salvarCheckboxes() {
    const estado = {
      QD1: document.getElementById("QD1")?.checked || false,
      QD2: document.getElementById("QD2")?.checked || false,
      QD3: document.getElementById("QD3")?.checked || false,
      QA: document.getElementById("QA")?.checked || false,
      QDM: document.getElementById("QDM")?.checked || false,
      QDA: document.getElementById("QDA")?.checked || false,
      QDB: document.getElementById("QDB")?.checked || false,
    };

    localStorage.setItem("estadoCheckboxes", JSON.stringify(estado));
  }

  function restaurarCheckboxes() {
    const dados = localStorage.getItem("estadoCheckboxes");
    if (!dados) return;

    const estado = JSON.parse(dados);

    Object.keys(estado).forEach(id => {
      const checkbox = document.getElementById(id);
      if (checkbox) checkbox.checked = estado[id];
    });
  }

  // ===================== Funções para salvar e restaurar imagens =====================
  function salvarEstadoImagens() {
    if (imgMotorEl) localStorage.setItem("motorSrc", imgMotorEl.src);
    if (imgAcumuladorEl) localStorage.setItem("acumuladorSrc", imgAcumuladorEl.src);
  }

  function restaurarEstadoImagens() {
    const motorSrc = localStorage.getItem("motorSrc");
    const acumuladorSrc = localStorage.getItem("acumuladorSrc");

    if (imgMotorEl && motorSrc) imgMotorEl.src = motorSrc;
    if (imgAcumuladorEl && acumuladorSrc) imgAcumuladorEl.src = acumuladorSrc;
  }

    function salvarIHMColors() {
    const estado = {
        off: statusoffEl?.style.color || "",
        bypass: statusbypassEl?.style.color || "",
        ihm: statusihmEl?.style.color || "",
        secured: statussecuredEl?.style.color || ""
    };
    localStorage.setItem("ihmColors", JSON.stringify(estado));
    }


    function restaurarIHMColors() {
    const dados = localStorage.getItem("ihmColors");
    if (!dados) return;

    const estado = JSON.parse(dados);
    if (statusoffEl) statusoffEl.style.color = estado.off;
    if (statusbypassEl) statusbypassEl.style.color = estado.bypass;
    if (statusihmEl) statusihmEl.style.color = estado.ihm;
    if (statussecuredEl) statussecuredEl.style.color = estado.secured;
    }

    function atualizarBotaoContr(posicao) {
     const ativar = posicao === "Posição3"; // só ativa na posição 3

        if (botaoContr) {
            botaoContr.style.pointerEvents = ativar ? "auto" : "none";
            botaoContr.style.opacity = ativar ? "1" : "0.6";
            botaoContr.style.cursor = ativar ? "pointer" : "not-allowed";
        }
    }
    
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  // ===================== Botões sem ação =====================
  if (languageEl) languageEl.addEventListener("click", () => alert("Botão não foi configurado"));
  if (stopHornEl) stopHornEl.addEventListener("click", () => alert("Botão não foi configurado"));
  if (GENBYPASSEl) GENBYPASSEl.addEventListener("click", () => alert("Botão não foi configurado"));
  if (SLAGINEl) SLAGINEl.addEventListener("click", () => alert("Botão não foi configurado"));
  if (motoronEl) motoronEl.addEventListener("click", () => moveMotor(1800));
  if (motoroff) motoroff.addEventListener("click", () => moveMotor(0));

  // ===================== LEDs Teste =====================
  if (ledsEl) {
    ledsEl.addEventListener("mousedown", () => {
      ledVerdeEls.forEach(el => el.style.opacity = "1");
      ledAmareloEls.forEach(el => el.style.opacity = "1");
      ledVermelhoEls.forEach(el => el.style.opacity = "1");
    });

    const resetLeds = () => {
      ledVerdeEls.forEach(el => el.style.opacity = "1");
      ledAmareloEls.forEach(el => el.style.opacity = "0.2");
      ledVermelhoEls.forEach(el => el.style.opacity = "0.2");
    };

    ledsEl.addEventListener("mouseup", resetLeds);
    ledsEl.addEventListener("mouseleave", resetLeds);
  }

 function atualizarDisplay() {
  if (rpmEl) rpmEl.textContent = motorRPM;
  }

 function moveMotor(destino) {
      // garante que não existam dois intervalos simultâneos
      if (motorInterval) {
          clearInterval(motorInterval);
          motorInterval = null;
      }

      motorInterval = setInterval(() => {

          if (destino > motorRPM) {
              // acelerar
              motorRPM = Math.min(motorRPM + 60, destino);
              if (imgMotorEl) imgMotorEl.src = "motorligado.png";
              motoronEl.style.backgroundColor = `green`

          } else if (destino < motorRPM) {
              // desacelerar
              motorRPM = Math.max(motorRPM - 60, destino);

              motoronEl.style.backgroundColor = `gray`

              if (motorRPM === 0 && imgMotorEl) {
                  imgMotorEl.src = "motordesligado.png";
                  
              }
          }

          salvarEstadoImagens();
          atualizarDisplay();

          // parar o intervalo quando chegar no destino
          if (motorRPM === destino) {
              clearInterval(motorInterval);
              motorInterval = null;
          }

      }, 300);
 }
  
 function ParaAcumulador() {
        const freioAcumulador = () => {

            const frear = setInterval(() => {

                acumuladorRPM = Math.max(acumuladorRPM - 100, 0); // DIMINUI
                atualizarDisplay()

                if (acumuladorRPM === 0) {
                    if (imgAcumuladorEl) imgAcumuladorEl.src = "acumuladordesligado.png";
                    salvarEstadoImagens();
                    clearInterval(frear);
                }

            }, 100);

        };

    freioAcumulador(); // AGORA SIM CHAMA A FUNÇÃO
  }

  function cargasegura_run(){
    iniciarPartida();

    function iniciarPartida() {
      let motorRPM = 0, acumuladorRPM = 0, freqHz = 0, freq = 0;

      const acelerarMotor = setInterval(() => {
        motorRPM = Math.min(motorRPM + 60, 1800);

        if (imgMotorEl) imgMotorEl.src = "motorligado.png";
        salvarEstadoImagens();

        if (motorRPM === 1800) {
          marcarCheckboxes(["QD1"], false);
          clearInterval(acelerarMotor);
          acelerarAcumulador();
        }
      }, 100);

      const acelerarAcumulador = async () => {
        if (imgAcumuladorEl) imgAcumuladorEl.src = "acumulador.png";
        salvarEstadoImagens();

        const acelerar = setInterval(() => {
          acumuladorRPM = Math.min(acumuladorRPM + 100, 2820);
          freqHz = Math.min(freqHz + 1.619, 47);
          
          if (acumuladorRPM === 2820) {
            freq = 47;
            
            clearInterval(acelerar);
            setTimeout(desacelerarMotor, 3000);
          }
        }, 100);
      };

      const desacelerarMotor = () => {
        const desacelera = setInterval(() => {
          motorRPM = Math.max(motorRPM - 60, 0);
          if (motorRPM === 0) clearInterval(desacelera);
        }, 100);

        if (imgMotorEl) imgMotorEl.src = "motordesligado.png";
        salvarEstadoImagens();
      };
    }
  }

  function baypasstotal(){
    if (imgMotorEl) imgMotorEl.src = "motordesligado.png";
    
      
    marcarCheckboxes(["QD3"], true); // Fecha o QD3
    marcarCheckboxes(["QD2"], true); // Abre o QD2
    marcarCheckboxes(["QD1"], true); // Abre o QD1

    setUnitColors("black", "gray", "gray", "gray");
    IHMColors("gray", "green", "gray", "gray");
    salvarCheckboxes();
    salvarEstadoImagens(); // <== novo - mantém imagens consistentes

    ParaAcumulador()
  }

  function  cargasegura () {
    iniciarPartida();

    function iniciarPartida() {
      let motorRPM = 0, acumuladorRPM = 0, freqHz = 0, freq = 0;

      const atualizarDisplay = () => {
        // motorRPMEl.textContent = motorRPM;
        // acumuladorRPMEl.textContent = acumuladorRPM;
        // freqEl.textContent = freqHz;
      };

      const acelerarMotor = setInterval(() => {
        motorRPM = Math.min(motorRPM + 60, 1800);

        if (imgMotorEl) imgMotorEl.src = "motorligado.png";
        salvarEstadoImagens();
        atualizarDisplay();

        if (motorRPM === 1800) {
          imgEmbreagemEl.style.left = "160px"; // NORMAL 156px
          clearInterval(acelerarMotor);
          acelerarAcumulador();
        }
      }, 100);

      const acelerarAcumulador = async () => {
        await delay (1000);
        if (imgAcumuladorEl) imgAcumuladorEl.src = "acumulador.png";
        salvarEstadoImagens();

        const acelerar = setInterval(() => {
          acumuladorRPM = Math.min(acumuladorRPM + 100, 2820);
          freqHz = Math.min(freqHz + 1.619, 47);
          atualizarDisplay();
          
          if (acumuladorRPM === 2820) {
            freq = 47;

            marcarCheckboxes(["QD2"], false);
            marcarCheckboxes(["QD1"], false);
            imgEmbreagemEl.style.left = "156px"; // NORMAL 156px
            clearInterval(acelerar);
            
            setTimeout(desacelerarMotor, 5000);
            delayQD3();
          }
        }, 100);
      };

      async function delayQD3() {
        await delay(1500);
        marcarCheckboxes(["QD3"], false);

        modosecloadEL.classList.add("ativo");
        modobypassEL.classList.remove("ativo");
      }

      const desacelerarMotor = () => {
        const desacelera = setInterval(() => {
          motorRPM = Math.max(motorRPM - 60, 0);
          atualizarDisplay();

          if (motorRPM === 0) clearInterval(desacelera);
        }, 100);

        if (imgMotorEl) imgMotorEl.src = "motordesligado.png";
        salvarEstadoImagens();
       window.location.href = 'index.html';
      };
    }
  }


  // ===================== Função principal da seletora =====================
  function aplicarPosicao(classe) {

    if (!classe) return;
    atualizarBotaoContr(classe);
    if (seletora) seletora.style.transform = `rotate(${posicoes[classe]}deg)`;
    localStorage.setItem("posicaoSeletora", classe); // <-- garante salvamento automático  
    
    // Posicao 1 ====================Sitema em modo desligado============================== 
    if (classe === "Posição1") mostrarPopup();
    pararPiscar(divCirculo6);
    IHMColors("green", "gray", "gray", "gray");

    // Posicao 2 ====================Sistema em modo By Pass============================== 
    if (classe === "Posição2") {
      if (divCirculo6 && divCirculo7) piscarDiv(divCirculo6, divCirculo7);
      baypasstotal();
      modosecloadEL.classList.remove("ativo");
      modobypassEL.classList.add("ativo");
    }

    // Posicao 3 ====================Botao control habilitado============================== 
    if (classe === "Posição3"){ // Configuracao finalizada
      if (classe !== "Posição3") return;  // 👈 Corta a execução!
      IHMColors("gray", "gray", "green", "gray");
      if (botaoContr) {
        const ativa = classe === "Posição3"; // Habilita o botao Control
        botaoContr.style.pointerEvents = ativa ? "auto" : "none"; // condicoes de stilo
        botaoContr.style.opacity = ativa ? "1" : "0.6"; // condicoes de stilo
        botaoContr.style.cursor = ativa ? "pointer" : "not-allowed"; // Condicoes de stilo
      }
      modosecloadEL.addEventListener("click", () => {
        if (imgAcumuladorEl && imgAcumuladorEl.src.split("/").pop() === "acumuladordesligado.png") { 
         cargasegura();
        } else{

            marcarCheckboxes(["QD2"], false);
            marcarCheckboxes(["QD3"], false);

        }
      });
      modorunEL.addEventListener("click", () => {
        if (imgAcumuladorEl && imgAcumuladorEl.src.split("/").pop() === "acumuladordesligado.png") { 
         cargasegura_run();
        }
      });
      
      if (modobypassEL) { // Caso o botao Bypass seja acionado executa esta parte do code
        modobypassEL.addEventListener("click", () => {
          
          const corAtual = getComputedStyle(modorunEL).backgroundColor; // Variavel armazena o estado do botao
          if (corAtual === "rgb(0, 128, 0)") { // # Verifica se o botao RUN esta ativo IF OK than
           marcarCheckboxes(["QD3"], true); // Fecha o QD3
           if (LedsecureloadEl) LedsecureloadEl.style.opacity = 0.3; // Desliga o led de carga segura
            
           setTimeout(() => { // Deslocamento temporal de 300 milesegundos 
              marcarCheckboxes(["QD2"], true); // Abre o QD2
            }, 300);
          }
          modostopksEL.addEventListener("click", () => { // Quando o botao StopKs e clicado
            const corsecload = getComputedStyle(modosecloadEL).backgroundColor;
            if (corsecload !== "rgb(0, 128, 0)"){

             marcarCheckboxes(["QD1"], true); // Abre o QD1
          
             setTimeout(() => { // Conta o tempo de 1,5 segundo 
                  if (imgMotorEl) imgMotorEl.src = "motordesligado.png"; // Desliga o motor
                  if (imgAcumuladorEl) imgAcumuladorEl.src = "acumuladordesligado.png"; // Desliga o Acumulado
                  if (LedsecureloadEl) LedsecureloadEl.style.opacity = 0.3; // Desliga o led de carga segura
                  salvarEstadoImagens(); // <== novo
                }, 1500);
            }   
          });

          const CorA = getComputedStyle(modostopksEL).backgroundColor; // Variavel salva estado do botao StopKs
          const CorB = getComputedStyle(modobypassEL).backgroundColor;
          if (CorA === "rgb(0, 128, 0)" && CorB === "rgb(0, 128, 0)") { // Verifica o estado do botao
           marcarCheckboxes(["QD3"], true); // Fecha o QD3
          
           setTimeout(() => { // Deslocamento temporal de 300 milesegundo
              marcarCheckboxes(["QD2","QD1" ], true); // Abre QD1 e QD2
              if (LedsecureloadEl) LedsecureloadEl.style.opacity = 0.3; // Desliga led de carga segura
              setTimeout(() => { // Deslocamento temporal de 1.5 segundos
               if (imgAcumuladorEl) imgAcumuladorEl.src = "acumuladordesligado.png"; // Desliga o acumulador
                salvarEstadoImagens(); // <== novo
              }, 1500);
            }, 300);
          }
        });
      }
    }

    //========================================================================
    //========================================================================
    if (classe === "Posição4") {

      setUnitColors("gray", "gray", "black", "gray");
      IHMColors("gray", "gray", "gray", "green");
      if (imgAcumuladorEl && imgAcumuladorEl.src.split("/").pop() === "acumulador.png") { 
        if(imgMotorEl && imgMotorEl.src.split("/").pop() === "motordesligado.png") { 
          marcarCheckboxes(["QD3"], false); // Abre o QD3
          marcarCheckboxes(["QD2"], false); // Fecha o QD2
          marcarCheckboxes(["QD1"], false); // Fecha o QD1
         
          setTimeout(() => {
          //window.location.href='index.html'
          }, 120)

        }
      }  
      if (imgAcumuladorEl && imgAcumuladorEl.src.split("/").pop() === "acumuladordesligado.png") { 
        cargasegura();
      }      

      divCirculo6.style.backgroundColor = "green"
      divCirculo7.style.backgroundColor = "green"
      bypasstyperunEl.style.color = `gray`
      bypasstypestopEl.style.color = `green`

      salvarEstadoImagens(); // <== novo
      salvarCheckboxes();
    }
  }
  // ===================== Eventos de POSIÇÃO - CLIQUES =====================
  Object.keys(posicoes).forEach((classe) => { // Posições da seletora
    const elem = document.querySelector(`.${classe}`);
    if (!elem) return;
    elem.addEventListener("click", () => {
      aplicarPosicao(classe);
      localStorage.setItem("posicaoSeletora", classe);
    });
  });

  // >>> ALTERAÇÃO: mover restaurarCheckboxes() e restaurarEstadoImagens() ANTES de aplicarPosicao
  // Motivo: evitar que aplicarPosicao() (que chama baypasstotal/cargasegura etc.) sobrescreva
  // o estado restaurado vindo do localStorage. Sem isso, ao mudar de página o acumulador
  // e os QDs eram sobrescritos indevidamente.
  restaurarCheckboxes();
  restaurarEstadoImagens();
  restaurarIHMColors();
  // <<< FIM ALTERAÇÃO

  // ===================== Aplicar posição salva (após restauração) =====================
  const posicaoSalva = localStorage.getItem("posicaoSeletora"); // Restaurar estado salvo 
  if (posicaoSalva && posicoes[posicaoSalva]) {
    aplicarPosicao(posicaoSalva);
  }

  if (btnDesligar) {  // Botão Confirmação Desligar 
    let timerPressiona = null;
    
    // >>> NOTE: usa-se a função delay já declarada no escopo superior
    const pressStart = () => {
      timerPressiona = setTimeout(async () => {
        // Se a seletora estiver na posicao1 e o botao Desligar for precionado 
        marcarCheckboxes(["QD1"], true); // #1 passo abrir QD1 se estiver fechado
        marcarCheckboxes(["QD2"], true); // #2 passo abrir QD2 se estiver fechado
        marcarCheckboxes(["QD3"], false); // #3 Passo abrir QD3 se estiver fechado
        if (imgMotorEl) imgMotorEl.src = "motordesligado.png"; // #4 Passo desligar o mortor de estiver ligado
        salvarEstadoImagens(); // <== novo
        if (LedsecureloadEl) LedsecureloadEl.style.opacity = 0.3; // #5 Led sinoptico e deligado
        IHMColors("green", "gray", "gray", "gray");
        
        // Usando o await delay para causar um delay de 5 segundo para o deligamento do acumulador.
        await delay(5000);
        if (imgAcumuladorEl) imgAcumuladorEl.src = "acumuladordesligado.png"; // #6 Acumulador e deligado
        salvarEstadoImagens(); // <== novo
      }, 5000);
    };
    const pressEnd = () => {
      clearTimeout(timerPressiona);
    };
    btnDesligar.addEventListener("mousedown", pressStart);
    btnDesligar.addEventListener("mouseup", pressEnd);
    btnDesligar.addEventListener("mouseleave", pressEnd);
  }
  // ===================== Grupos de botões =====================
  const grupos = ["grupo1", "grupo2"];
  grupos.forEach(grupo => {
    const botoes = document.querySelectorAll(`.${grupo}`);
    botoes.forEach(botao => {
      botao.addEventListener("click", () => {
        botoes.forEach(b => b.classList.remove("ativo"));
        botao.classList.add("ativo");
      });
    });
  });
});

// ===================== Atualização da hora =====================
function atualizarHora() {
  const agora = new Date();
  const horas = agora.getHours().toString().padStart(2, "0");
  const minutos = agora.getMinutes().toString().padStart(2, "0");
  const segundos = agora.getSeconds().toString().padStart(2, "0");
  const elHora = document.querySelector(".HORA");
  if (elHora) elHora.textContent = `${horas}:${minutos}:${segundos}`;
}

setInterval(atualizarHora, 1000);
atualizarHora();

