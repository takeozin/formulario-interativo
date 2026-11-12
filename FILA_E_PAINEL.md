# Fila e painel do evento

## Regras combinadas

- Há uma única fila compartilhada para jogar no estande. A equipe organiza a distribuição dos jogadores entre os jogos disponíveis.
- Quem quer jogar recebe uma senha da fila. Quem quer somente aprender continua diretamente para o feedback.
- A chamada dá até cinco minutos para a pessoa chegar. Após a chegada, há vinte minutos de jogo. O atendente pode ajustar a operação conforme a realidade do estande.
- A pessoa pode demonstrar interesse em aprender sem sair da fila. O feedback fica para depois da partida.
- Bloquear o celular ou deixar o aplicativo em segundo plano não cancela a inscrição. Um botão explícito de desistência deve existir; fechamento do aplicativo não é detectável de modo confiável em todas as situações pelo Expo Go.
- Um painel web restrito à equipe deverá permitir chamar, confirmar chegada, iniciar e finalizar a partida e registrar desistências. Também deverá mostrar dados agregados do evento.

## Ordem de implementação

1. Concluído para teste: fila única, emissão concorrente e permissões testadas em banco isolado.
2. Concluído para teste: aplicativo e painel conectados, com ciclo de chamada até feedback testado no Expo Go.
3. Pendente: acrescentar gráficos de participação, faixa etária, interesse e avaliação.
4. Pendente: revisar os limites abaixo e validar a operação com a equipe antes do evento.

O SQL experimental foi testado em PostgreSQL isolado: emissão sequencial,
pedidos simultâneos da mesma inscrição, chamada com até cinco vagas, início e
fim da partida, expiração, desistência e permissões. A chegada e o início da
partida são uma confirmação única; o fim é confirmado pela equipe, mesmo que os
20 minutos tenham passado. A fila foi criada no projeto `ikyoqrpvqtodingkjdwq`
e está habilitada para teste nesta máquina por `EXPO_PUBLIC_QUEUE_ENABLED=true`.
O painel e o app consultam a mesma fila. O usuário confirmou no Expo Go a chamada,
chegada, finalização e feedback. Falta revisar segurança, política de dados e
regras de operação antes de usar em evento.

As estruturas de administrador e de fila foram aplicadas pelo SQL Editor, sem
registro automático no histórico de migrations do Supabase. Antes de usar
`supabase db push`, reconciliar o histórico com a equipe; não reaplicar esses
arquivos cegamente ao projeto remoto.

## Limitações a resolver

- No Android, o Expo Go não oferece notificações push remotas. A notificação local depende de o aplicativo conseguir executar; não há garantia de aviso em segundo plano ou com o app fechado.
- Uma confirmação de chegada pelo atendente é necessária para diferenciar atraso de tempo de jogo. A chamada automática precisa respeitar a disponibilidade de jogos; 25 minutos contados de uma chamada não comprovam que a pessoa chegou.
- O painel chama as inscrições ativas em ordem de chegada mesmo após meia-noite, mas o cálculo de pessoas à frente no celular ainda considera apenas o dia da inscrição.
- O aplicativo não recupera a inscrição após ser fechado; saída involuntária não é detectada de forma confiável.
- A autorização atual de coleta precisa ser revista antes de incluir novos usos e dados no painel.
- Verificar a política de backup e recuperação do projeto correto antes de executar migrações. Nunca usar a chave service_role no aplicativo ou no navegador.
