document.addEventListener("DOMContentLoaded", function () {
  // ===================== Elementos =====================
  // Variavel que controla o botao giratorio da IHM (SELETORA) 
  const seletora = document.querySelector(".Seletora");

  // Variaveis que controla o estado do motor e acumulador (Ligado e Desligado)
  const imgMotorEl = document.querySelector("#statusmotor");
  const imgAcumuladorEl = document.querySelector("#statusacumulador");

  // Variaveis que controla os leds ( sinoptico de alarme)
  const ledVerdeEls = document.querySelectorAll(".circulo-verde");
  const ledAmareloEls = document.querySelectorAll(".circulo-amarelo");
  const ledVermelhoEls = document.querySelectorAll(".circulo-vermelho");
  const ledsEl = document.querySelector("#leds");

  // Variaveis referente aos Botoes de liguagem e Stop Horn
  const stopHornEl = document.querySelector("#stophorn");
  const languageEl = document.querySelector("#language");

  // Variaveis referente ao estado de funcionamento do sitema na tela home
  const unitBypassEl = document.querySelector("#Unit-in-bypass");
  const unitEmergencyEl = document.querySelector("#Unit-in-emergency-mode");
  const unitNormalEl = document.querySelector("#Unit-in-normal-mode");
  const unitPressEl = document.querySelector("#press-sl-again");

  // Variavel referente ao botao que confirma o desligamento do sistema
  const btnDesligar = document.querySelector(".ConfirmaçãoDesligar");

  // Variavel de controla o estado da rede mains (controla o sinotipco de entrada)
  let intervaloPiscar = null;

  // ===================== Posições e Modos =====================
  // Variavel pre-define um angulo de rotacao para cada posicao da seletora 
  const posicoes = {
    Posição4: 0,      // CARGA PROTEGIDA
    Posição3: -40,    // CONTROLE IHM
    Posição2: -100,   // BY-PASS
    Posição1: -160,   // DESLIGAR
  };

  // Variavel qual o status de funcionamento do sistema apartir da seletora 
  const modos = {
    Posição4: "h5",  // SECURED
    Posição3: "h4",  // HMI
    Posição2: "h3",  // BYPASS
    Posição1: "h2",  // OFF
  };

  // ===================== Funções Auxiliares =====================
  // Funcao que mudara a cor da fonte dos elemento conforme posicao da seletora
  function setUnitColors(baypass, emergency, normal, press) {
    if (unitBypassEl) unitBypassEl.style.color = baypass;
    if (unitEmergencyEl) unitEmergencyEl.style.color = emergency;
    if (unitNormalEl) unitNormalEl.style.color = normal;
    if (unitPressEl) unitPressEl.style.color = press;
  }

  function mostrarPopup() {
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

  function marcarCheckboxes(ids, checked = true) {
    ids.forEach((id) => {
      const checkbox = document.getElementById(id);
      if (checkbox) checkbox.checked = checked;
    });
  }

  // ===================== Botões sem ação =====================
  if (languageEl) languageEl.addEventListener("click", () => alert("Botão não foi configurado"));
  if (stopHornEl) stopHornEl.addEventListener("click", () => alert("Botão não foi configurado"));

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

  // ===================== Posições =====================
  Object.keys(posicoes).forEach((classe) => {
    const elem = document.querySelector(`.${classe}`);
    if (!elem) return;

    elem.addEventListener("click", () => {
      // Rotaciona seletora
      if (seletora) seletora.style.transform = `rotate(${posicoes[classe]}deg)`;

      // Atualiza cores na div Mode
      const modeDiv = document.querySelector(".Mode");
      if (modeDiv) {
        const tags = modeDiv.querySelectorAll("h2, h3, h4, h5");
        tags.forEach(tag => tag.style.color = "gray");

        const destaque = modeDiv.querySelector(modos[classe]);
        if (destaque) destaque.style.color = "green";
      }

      // Botão Contr habilita o botao na IHM
      const botaoContr = document.querySelector(".Contr");
      if (botaoContr) {
        if (classe === "Posição3") {
          botaoContr.style.pointerEvents = "auto";
          botaoContr.style.opacity = "1";
          botaoContr.style.cursor = "pointer";
        } else {
          botaoContr.style.pointerEvents = "none";
          botaoContr.style.opacity = "0.6";
          botaoContr.style.cursor = "not-allowed";
        }
      }

      // Posição1 -> popup
      if (classe === "Posição1") mostrarPopup();

      const divCirculo6 = document.querySelector(".Circulo6");
      const divCirculo7 = document.querySelector(".Circulo7");

      // Para qualquer piscar anterior
      pararPiscar(divCirculo6);

      // Posição2 -> BY-PASS
      if (classe === "Posição2") {
        if (divCirculo6 && divCirculo7) piscarDiv(divCirculo6, divCirculo7);

        ["QD1", "QD3", "QD2"].forEach((id, index) => {
          setTimeout(() => {
            const checkbox = document.getElementById(id);
            if (checkbox) checkbox.checked = true;

            if (imgMotorEl) imgMotorEl.src = "motordesligado.png";
            if (imgAcumuladorEl) imgAcumuladorEl.src = "acumuladordesligado.png";

            setUnitColors("black", "gray", "gray", "gray");
          }, index * 70);
        });
      }

      // Posição4 -> Carga Protegida
      if (classe === "Posição4") {
        if (divCirculo6) divCirculo6.style.backgroundColor = "green";
        if (divCirculo7) divCirculo7.style.backgroundColor = "green";

        ["QD1", "QD2", "QD3"].forEach(id => {
          const checkbox = document.getElementById(id);
          if (checkbox) checkbox.checked = false;
          if (imgMotorEl) imgMotorEl.src = "motordesligado.png";
          if (imgAcumuladorEl) imgAcumuladorEl.src = "acumulador.png";
        });

        setUnitColors("gray", "gray", "black", "gray");
      }

      // Posição1 -> DESLIGAR, marcar checkboxes
      if (classe === "Posição1") {
        marcarCheckboxes(["QD1", "QD2", "QD3"], true);
      }
    });
  });

  // ===================== Botão Confirmação Desligar =====================
  if (btnDesligar) {
    let timerPressiona = null;

    const pressStart = () => {
      console.log("Botão pressionado");
      timerPressiona = setTimeout(() => {
        console.log("Executando comando após 5s");
        if (imgMotorEl) imgMotorEl.src = "motordesligado.png";
        if (imgAcumuladorEl) imgAcumuladorEl.src = "acumuladordesligado.png";
        marcarCheckboxes(["QD3"], false);
      }, 5000);
    };

    const pressEnd = () => {
      console.log("Botão solto");
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
