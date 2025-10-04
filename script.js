// 1. Encontrar os elementos no HTML que vamos usar.
const startButton = document.getElementById('startButton');
const abelha = document.getElementById('abelha');

// 2. Adicionar um "ouvinte de eventos" ao botão.
//    Isso diz: "Fique de olho nesse botão e me avise quando alguém clicar nele."
startButton.addEventListener('click', () => {

    console.log("O botão Start foi clicado!"); // Para vermos no console que funcionou

    // 3. A ação principal: Adicionar a classe "voando" ao elemento da abelha.
    abelha.classList.add('voando');

});