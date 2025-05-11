// Rotação da seletora
document.addEventListener("DOMContentLoaded", function () {
  const seletora = document.querySelector(".Seletora")

  // Mapeia ângulos de rotação para cada botão
  const posicoes = {
    Posição4: 0, // CARGA PROTEGIDA
    Posição3: -40, // CONTROLE IHM
    Posição2: -100, // BY-PASS
    Posição1: -150, // DESLIGAR
  }

  // Mapeia qual título deve ficar verde para cada botão
  const modos = {
    Posição4: "h5", // SECURED
    Posição3: "h4", // HMI
    Posição2: "h3", // BYPASS
    Posição1: "h2", // OFF
  }

  Object.keys(posicoes).forEach((classe) => {
    document.querySelector(`.${classe}`).addEventListener("click", function () {
      // Rotaciona a seletora
      const angulo = posicoes[classe]
      seletora.style.transform = `rotate(${angulo}deg)`

      // Atualiza as cores dos elementos na <div class="Mode">
      const modeDiv = document.querySelector(".Mode")
      const tags = modeDiv.querySelectorAll("h2, h3, h4, h5")

      tags.forEach((tag) => {
        tag.style.color = "gray" // deixa todas cinza
      })

      const destaque = modeDiv.querySelector(modos[classe])
      if (destaque) {
        destaque.style.color = "green" // destaca a tag correta
      }
    })
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
