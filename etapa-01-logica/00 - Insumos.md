# Mapeamento de Insumos: Matérias-Primas e Variáveis Lógicas

Este documento descreve os insumos físicos (matérias-primas e utilidades) que alimentam a Estação de Reabastecimento de Hidrogênio, bem como o mapeamento completo dos insumos lógicos (entradas e saídas discretas) utilizados nas equações de intertravamento do sistema SCADA.

## 1. Matérias-Primas Primárias e Utilidades Físicas

Antes da abstração lógica, o sistema depende de insumos físicos fundamentais para a sua operação. Eles representam a massa e a energia transformadas ou controladas pela planta:

* **Gás Hidrogênio ($H_2$):** A matéria-prima principal do processo. É recebido em alta pressão, distribuido para o armazenamento em multiplas pressões e, por fim, dispensado no veículo.
* **Energia Elétrica (Potência Motriz e Controle):** Insumo utilitário crítico que alimenta os motores dos compressores, as bombas do chiller e todo o painel de automação (CLP, SCADA, instrumentação).
* **Fluido Refrigerante / Glicol:** Insumo utilitário circulante no sistema do Chiller (Setor 200), vital para o pré-resfriamento do hidrogênio ($T \leq -40^\circ C$) antes da dispensação.
* **Ar Comprimido / Gás Nitrogênio ($N_2$):** Insumo utilitário frequentemente utilizado para atuação de válvulas pneumáticas ou rotinas de purga de segurança nas tubulações.

---

## 2. Insumos Lógicos de Entrada (Sensoriamento e Comandos)

Estas são as proposições lógicas lidas do campo (valores discretos Verdadeiro/Falso) que atuam como as premissas nas equações lógicas de permissivo e trip.

### Setor 100: Banco de Armazenamento (Baixa, Média e Alta Pressão)

**Tanque de baixa pressão**
* $p_{1,1}$: Pressão do tanque excede o limite de segurança, $P > 400\text{ bar}$ (PT-101)
* $p_{1,4}$: Pressão do tanque atinge o valor desejado de operação, $P > 350\text{ bar}$ (PT-104)
* $t_{1,1}$: Temperatura do tanque excede o limite de segurança, $T > 85^\circ\text{C}$ (TT-101)
* $g_{1,1}$: Vazamento de H₂ detectado no tanque de baixa pressão (AT-101)
* $r_{1,1}$: Válvula de alívio de pressão ATUADA — confirmação de disparo mecânico (PSV-101)

**Tanque de média pressão**
* $p_{1,2}$: Pressão do tanque excede o limite de segurança, $P > 700\text{ bar}$ (PT-102)
* $p_{1,5}$: Pressão do tanque atinge o valor desejado de operação, $P > 650\text{ bar}$ (PT-105)
* $t_{1,2}$: Temperatura do tanque excede o limite de segurança, $T > 85^\circ\text{C}$ (TT-102)
* $g_{1,2}$: Vazamento de H₂ detectado no tanque de média pressão (AT-102)
* $r_{1,2}$: Válvula de alívio de pressão ATUADA — confirmação de disparo mecânico (PSV-102)

**Tanque de alta pressão**
* $p_{1,3}$: Pressão do tanque excede o limite de segurança, $P > 1000\text{ bar}$ (PT-103)
* $p_{1,6}$: Pressão do tanque atinge o valor desejado de operação, $P > 950\text{ bar}$ (PT-106)
* $t_{1,3}$: Temperatura do tanque excede o limite de segurança, $T > 85^\circ\text{C}$ (TT-103)
* $g_{1,3}$: Vazamento de H₂ detectado no tanque de alta pressão (AT-103)
* $r_{1,3}$: Válvula de alívio de pressão ATUADA — confirmação de disparo mecânico (PSV-103)

**Segurança geral**
* $e_{1,1}$: Parada de emergência acionada pelo operador (ESD-100)

### Setor 200: Condicionamento e Resfriamento
* $t_{2,1}$: Temperatura de saída do pré-resfriador adequada, $T \leq -40^\circ\text{C}$ (TT-201)
* $p_{2,1}$: Pressão do buffer de condicionamento dentro da faixa de operação (PT-201)

### Setor 300: Dispensador (Abastecimento)
* $h_{3,1}$: Botão de comando para início de abastecimento acionado (HS-301)
* $c_{3,1}$: Comunicação de dados (IR, protocolo J2799) estabelecida com o veículo (COM-301)
* $bv_{3,1}$: Acoplamento mecânico (*breakaway* valve) conectado e íntegro (BV-301)
* $p_{3,1}$: Pressão de enchimento atinge o setpoint do veículo, $P \approx 700\text{ bar}$ (PT-301)
* $t_{3,1}$: Temperatura no receptáculo do veículo excede o limite (TT-301)
* $g_{3,1}$: Vazamento de H₂ detectado na área de dispensação (AT-301)

---

## 3. Insumos Lógicos de Saída (Atuadores e Alarmes)

Estas são as proposições que representam os estados de comando enviados pelo controlador (CLP) para o campo, resultado do processamento das equações lógicas.

### Setor 100: Atuadores de Bloqueio, Seleção e Sinalização
* $v_{1,1}$: Válvula de corte rápido do tanque de baixa pressão (XV-101) no estado ABERTA
* $v_{1,2}$: Válvula de corte rápido do tanque de média pressão (XV-102) no estado ABERTA
* $v_{1,3}$: Válvula de corte rápido do tanque de alta pressão (XV-103) no estado ABERTA
* $v_{1,4}$: Válvula direcional 4/3 vias (XV-104) em posição neutra — resultado de nenhuma bobina energizada
* $y_{1,4a}$: Comando da bobina A — seleciona tanque de baixa pressão (YV-104A)
* $y_{1,4b}$: Comando da bobina B — seleciona tanque de alta pressão (YV-104B)
* $s_{1,1}$: Luz sinalizadora do tanque de baixa pressão (SL-101) ACESA
* $s_{1,2}$: Luz sinalizadora do tanque de média pressão (SL-102) ACESA
* $s_{1,3}$: Luz sinalizadora do tanque de alta pressão (SL-103) ACESA
* $a_{1,1}$: Sirene / alarme geral da planta (ALM-101) ATIVADO

### Setor 200: Atuadores de Força Motriz e Bloqueio
* $m_{2,1}$: Contator do motor do chiller (M-201) no estado LIGADO
* $v_{2,1}$: Válvula de entrada do chiller (XV-201) no estado ABERTA

### Setor 300: Atuadores de Dispensação
* $v_{3,1}$: Válvula solenoide do bico dispensador (XV-301) no estado ABERTA

---

## 4. Fundamentos Teóricos e Conceituais da Arquitetura de Controle

### 4.1 Abstração Lógica e Modelagem de Estados Discretos
A representação formal de processos industriais por meio de proposições lógicas constitui a base fundamental para a engenharia de automação moderna. A conversão sistemática de grandezas físicas contínuas em variáveis binárias permite a implementação de malhas de controle e intertravamentos robustos. Esse método garante que a planta opere sob critérios determinísticos, eliminando ambiguidades interpretativas e assegurando que o sistema de controle responda de maneira previsível e segura diante de variações operacionais ou distúrbios externos.

### 4.2 Filosofia de Segurança Integrada e Lógica de Permissivos
A operação de sistemas envolvendo fluidos sob alta pressão exige uma filosofia estrita baseada em permissivos de partida e restrições intertravadas. Nenhum estado ativo de atuação pode ser estabelecido sem a validação prévia de todas as condições de integridade estrutural e ambiental. Essa abordagem assegura que desvios operacionais ou falhas incipientes na instrumentação sejam tratados de forma preventiva, acionando rotinas de segurança antes que qualquer condição crítica afete a integridade física dos equipamentos ou dos operadores.

### 4.3 Padronização e Rastreabilidade de Instrumentação
A consistência na identificação de instrumentos e malhas de controle é indispensável para a manutenibilidade e escalabilidade de projetos de automação industrial. A correlação direta entre os elementos físicos dispostos no campo e as respectivas variáveis lógicas no ambiente computacional do controlador lógico programável (CLP) viabiliza auditorias técnicas eficientes e simplifica futuras expansões da arquitetura de supervisão e controle.

## 5. Diretrizes Complementares de Confiabilidade e Gestão Operacional

### 5.1 Confiabilidade de Redes e Sistemas Supervisórios
A resiliência operacional de uma planta industrial depende diretamente da integridade da comunicação entre os dispositivos de campo e as estações de operação do sistema supervisório (SCADA). A redundância estrutural no tratamento e na exibição das variáveis lógicas assegura que a equipe de operação disponha de informações claras, consistentes e em tempo real para a tomada de decisões estratégicas e o gerenciamento de contingências.

### 5.2 Documentação Técnica e Boas Práticas de Engenharia
A manutenção de um repositório documental detalhado, coeso e estruturado reflete o rigor metodológico aplicado no desenvolvimento de projetos de controle e automação. A especificação minuciosa dos insumos lógicos e utilitários facilita o entendimento conceitual por equipes multidisciplinares, otimizando tanto as etapas de comissionamento quanto as revisões periódicas de engenharia de processo.
