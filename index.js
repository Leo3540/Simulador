document.addEventListener("DOMContentLoaded", function () {
  const seletora = document.querySelector(".Seletora");
  const imgmotorEL = document.querySelector(`#statusmotor`);
  const imgacumuladorEl = document.querySelector(`#statusacumulador`);

  const posicoes = {
    Posição4: 0,      // CARGA PROTEGIDA
    Posição3: -40,    // CONTROLE IHM
    Posição2: -100,   // BY-PASS
    Posição1: -160,   // DESLIGAR
  };

  const modos = {
    Posição4: "h5",  // SECURED
    Posição3: "h4",  // HMI
    Posição2: "h3",  // BYPASS
    Posição1: "h2",  // OFF
  };

  Object.keys(posicoes).forEach((classe) => {
    document.querySelector(`.${classe}`).addEventListener("click", function () {
      // Rotaciona a seletora
      const angulo = posicoes[classe];
      seletora.style.transform = `rotate(${angulo}deg)`;

      // Atualiza as cores dos elementos na <div class="Mode">
      const modeDiv = document.querySelector(".Mode");
      const tags = modeDiv.querySelectorAll("h2, h3, h4, h5");
      tags.forEach((tag) => {
        tag.style.color = "gray";
      });

      const destaque = modeDiv.querySelector(modos[classe]);
      if (destaque) {
        destaque.style.color = "green";
      }

      // Ativa ou desativa o botão ".Contr"
      const botaoContr = document.querySelector(".Contr");
      if (classe === "Posição3") {
        botaoContr.style.pointerEvents = "auto";
        botaoContr.style.opacity = "1";
        botaoContr.style.cursor = "pointer";
      } else {
        botaoContr.style.pointerEvents = "none";
        botaoContr.style.opacity = "0.6";
        botaoContr.style.cursor = "not-allowed";
      }

      // Exibe popup se for a posição 1 (DESLIGAR)
      if (classe === "Posição1") {
        mostrarPopup();
      }

      // Marca os checkboxes se for a posição 2 (BY-PASS)
          if (classe === "Posição2") {
                const div = document.querySelector('.Circulo6');
                let corAtual = 'white'; // Começa com branco
                div.style.backgroundColor = corAtual;

                // Faz a cor piscar a cada 500ms
                setInterval(() => {
                  corAtual = (corAtual === 'white') ? 'green' : 'white';
                  div.style.backgroundColor = corAtual;
                }, 500);
            ["QD1", "QD3", "QD2"].forEach((id, index) => {
              setTimeout(() => {
                const checkbox = document.getElementById(id);
                imgmotorEL.src = `MotorLigado.png`;
                imgacumuladorEl.src = `ACUMULADOR.PNG`;
                if (checkbox) checkbox.checked = true;
              }, index * 70); // 500ms de delay entre cada checkbox
            });
          }
      // Marca os checkboxes se for a posição 4 (Carga Protegida)
      if (classe === "Posição4") {
          const div = document.querySelector('.Circulo6 ');
          div.style.backgroundColor = 'Green';
        ["QD1", "QD2", "QD3"].forEach((id) => {
          const checkbox = document.getElementById(id);
          imgmotorEL.src = `MOTOR.png`;
          imgacumuladorEl.src = `ACUMULADOR.PNG`;
          if (checkbox) checkbox.checked = false;
        });
      }
        // ✅ Se estiver na Posição1, marque os checkboxes
        if (classe === "Posição1") {
          console.log("Desmarcando checkboxes");
          ["QD1", "QD2", "QD3"].forEach((id) => {
            const checkbox = document.getElementById(id);
            if (checkbox) checkbox.checked = true;
          });
        }
    });
  });
  // Função para mostrar o popup
function mostrarPopup(classe) {
  const popup = document.querySelector(".popup-aviso");
  if (!popup) return;
  popup.style.display = "block";

  const botaoFechar = popup.querySelector(".fechar-popup");
  if (botaoFechar) {
    botaoFechar.addEventListener("click", function () {
      popup.style.display = "none";
    });
  }
}
  // ✅ Pressionar por 5 segundos marca os checkboxes
  const btnDesligar = document.querySelector(".ConfimaçãoDesligar")
  let timerPressiona

  btnDesligar.addEventListener("mousedown", function () {
    timerPressiona = setTimeout(() => {
      const checkboxes = ["QD3"]
            imgmotorEL.src = `MOTOR.PNG`;
            imgacumuladorEl.src = `AcumuladorDesligado.PNG`;
      checkboxes.forEach((id) => {
        const checkbox = document.getElementById(id)
        if (checkbox) {
          checkbox.checked = false
        }
      })
    }, 5000)
  })

  btnDesligar.addEventListener("mouseup", function () {
    clearTimeout(timerPressiona)
  })

  btnDesligar.addEventListener("mouseleave", function () {
    clearTimeout(timerPressiona)
  })
})
// Atualização da hora
function atualizarHora() {
  const agora = new Date()
  const horas = agora.getHours().toString().padStart(2, "0")
  const minutos = agora.getMinutes().toString().padStart(2, "0")
  const segundos = agora.getSeconds().toString().padStart(2, "0")
  document.querySelector(
    ".HORA"
  ).textContent = `${horas}:${minutos}:${segundos}`
}

setInterval(atualizarHora, 1000) // atualiza a cada segundo
atualizarHora() // mostra logo ao carregar

