# Ideias por tela

Espaço para a equipe alinhar as ideias de cada tela do formulário.
Telas listadas na ordem do fluxo ([AppNavigator](src/navigation/AppNavigator.jsx)).

---

## 1. Splash

Melhorar o titulo e verificar se adiciona algo ao background para dar volume, tipo um mestre splinter

- **Sensei chamando para a aventura:** o sensei aparece na tela chamando o usuário para iniciar a aventura, como gancho para atrair e engajar quem está entrando no app.

## 2. Welcome

- **Sensei com caixa de mensagem:** o sensei aparece com uma caixa de diálogo explicando, de forma resumida, para que serão usadas as informações coletadas no formulário.
- **"Ler mais":** opção para expandir a explicação resumida e ver o texto completo sobre o uso das informações.
- **Avançar/Voltar:** botão **avançar** representa a concordância com a coleta de informações e segue o fluxo; botão **voltar** é usado caso o usuário não aceite.
Melhorar o titulo e verificar se adiciona algo ao background para dar volume

## 2. Welcome

_A definir._

## 3. Character

Duas opções para a escolha do personagem:

- **Opção A: 1 card com seta (atual):** um card só, na largura toda, começando no ninja masculino. Uma seta discreta à direita troca para o feminino, e no feminino a seta passa para a esquerda para voltar. Tocar no card escolhe o personagem. A imagem paisagem aparece inteira e grande.
  - **Pendência:** pode não ficar claro que é preciso tocar no card para escolher. Seria bom incluir um botão (ex.: **"Escolher"**) para deixar a ação mais intuitiva.
- **Opção B: 2 cards em 2 colunas:** os ninjas masculino e feminino lado a lado, cada um no seu card. Basta tocar no personagem para escolher, sem seta nem botão extra. É mais direto, mas cada card fica estreito e corta parte da imagem paisagem.

## 4. Name

Duas opções para a tela de nome:

- **Opção A: Pergaminho com alvos de treino:**
  - **Pergaminho:** o campo de nome fica em formato de pergaminho na parte superior da tela, com o título **"Qual seu nome?"**.
  - **Alvos no lugar do teclado:** em vez do teclado padrão, os caracteres aparecem como alvos de treino.
  - **Shuriken:** ao tocar em um alvo, uma animação de shuriken acerta o alvo; cerca de **150 ms** depois a shuriken some.
  - **Sensação:** cada letra digitada é um "acerto no alvo", como se o usuário estivesse treinando.
  - **Som:** cada letra digitada faz o som de shuriken sendo lançado para maior imersão.
  
- **Opção B: Personagem em evidência com nametag:**
  - **Personagem em evidência:** o personagem escolhido na tela anterior (masculino/feminino) aparece em destaque no fundo da tela.
  - **Nome acima da cabeça:** um campo translúcido posicionado acima da cabeça do personagem vai exibindo o nome conforme o usuário digita, como se fosse o "nametag" dele.


- **Pergaminho:** o campo de nome fica em formato de pergaminho na parte superior da tela, com o título **"Qual seu nome?"**.
- **Alvos no lugar do teclado:** em vez do teclado padrão, os caracteres aparecem como alvos de treino.
- **Shuriken:** ao tocar em um alvo, uma animação de shuriken acerta o alvo; cerca de **150 ms** depois a shuriken some.
- **Sensação:** cada letra digitada é um "acerto no alvo", como se o usuário estivesse treinando.
- **Som:** cada letra digitada faz o som de shuriken sendo lançado para maior imersão

## 5. Age

- **Bonecos de treino:** 4 bonecos de treino, um para cada faixa de idade: **-10**, **11 a 15**, **16 a 20** e **+21**.
- **Corte:** ao tocar em um boneco, um efeito de corte aparece no boneco escolhido.

## 6. Intent

_A definir._

## 7. Feedback

_A definir._

## 8. Done

_A definir._
