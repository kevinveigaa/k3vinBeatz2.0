Console.log("Beat Retroceder carregado 🎧🔥");

// FUNÇÃO PARA ADICIONAR EFEITO DE INCLINAÇÃO 3D (TILT) AO CARD
document.addEventListener('DOMContentLoaded', () => {
    
    // Seleciona o cartão principal do beat
    const card = document.querySelector('.beat-card');

    if(card) {
        // 1. Efeito de inclinação ao mover o mouse
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            // Posição X e Y do mouse dentro do cartão
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;
            
            // Cálculo da rotação (o divisor 20 suaviza o efeito)
            const xRotation = -((y - rect.height / 2) / 20); 
            const yRotation = (x - rect.width / 2) / 20;

            // Aplica a transformação 3D
            card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.02)`;
        });

        // 2. Retorna à posição normal ao retirar o mouse
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    }
});