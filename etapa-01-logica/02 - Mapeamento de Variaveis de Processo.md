# Mapeamento de Variáveis de Processo para Proposições Lógicas

Na automação industrial (norma ISA-5.1), instrumentos e atuadores emitem e recebem sinais discretos (binários: $0$ = Falso / $1$ = Verdadeiro), permitindo a tradução de condições físicas de campo em variáveis lógicas estruturadas para o processamento em sistemas de controle e intertravamento.

![Estação de reabastecimento](/etapa-01-logica/projeto2.png)

## Setor 100: Armazenamento de Hidrogênio (Banco de Cilindros de Alta Pressão)
 
| Tag Instrumento | Tipo de Dispositivo    | Variável Física                     | Proposição Lógica | Estado 1                                                             |
| ---------------- | ----------------------- | ------------------------------------ | ------------------ | ---------------------------------------------------------------------- |
| **PT-101**       | Transmissor Pressão     | Pressão do tanque de Armazenamento de baixa pressão   | $p\_{1,1}$              | Pressão excede o limite máximo de armazenamento ($P > 400\text{ bar}$) |
| **PT-104**       | Transmissor Pressão     | Pressão do tanque de Armazenamento de baixa pressão   | $p\_{1,4}$              | Pressão atinge o desejado do tanque ($P > 350\text{ bar}$) |
| **TT-101**       | Transmissor Temp.       | Temp. do tanque de Armazenamento de baixa pressão      | $t\_{1,1}$              | Temperatura excede o limite seguro do vaso ($T > 85^\circ\text{C}$)    |
| **AT-101**       | Detector de Gás H₂      | Concentração de H₂ na área do tanque de Armazenamento de baixa pressão          | $g\_{1,1}$              | Vazamento de hidrogênio detectado ($C > 1\text{\% vol, } 25\text{\% LIE}$) |                            |                                   |
| **PSV-101**      | Válvula de Alívio       | Proteção contra sobrepressão         | $r\_{1,1}$              | Válvula de alívio de pressão ATUADA
| **XV-101**       | Válvula Corte Rápido    | entrada do tanque de Armazenamento de baixa pressão      | $v\_{1,1}$              | Válvula de segurança de entrada ABERTA
| **SL-101**       | Sinalizador / luz    | alarme do tanque de baixa pressão     | $s\_{1,1}$              | Luz ACESSA                                    
| **PT-102**       | Transmissor Pressão     | Pressão do tanque de Armazenamento de média pressão   | $p\_{1,2}$              | Pressão excede o limite máximo de armazenamento ($P > 700\text{ bar}$) |
| **PT-105**       | Transmissor Pressão     | Pressão do tanque de Armazenamento de média pressão   | $p\_{1,5}$              | Pressão atinge o desejado do tanque ($P > 650\text{ bar}$) |
| **TT-102**       | Transmissor Temp.       | Temp. do tanque de Armazenamento de média pressão      | $t\_{1,2}$              | Temperatura excede o limite seguro do vaso ($T > 85^\circ\text{C}$)    |
| **AT-102**       | Detector de Gás H₂      | Concentração de H₂ na área do tanque de Armazenamento de média pressão          | $g\_{1,2}$              | Vazamento de hidrogênio detectado ($C > 1\text{\% vol, } 25\text{\% LIE}$) |                            |                                   |
| **PSV-102**      | Válvula de Alívio       | Proteção contra sobrepressão         | $r\_{1,2}$              | Válvula de alívio de pressão ATUADA
| **XV-102**       | Válvula Corte Rápido    | entrada do tanque de Armazenamento de média pressão      | $v\_{1,2}$              | Válvula de segurança de entrada ABERTA
| **SL-102**       | Sinalizador / luz    | alarme do tanque de média pressão     | $s\_{1,2}$              | Luz ACESSA                                     
| **PT-103**       | Transmissor Pressão     | Pressão do tanque de Armazenamento de alta pressão   | $p\_{1,3}$              | Pressão excede o limite máximo de armazenamento ($P > 1000\text{ bar}$) |
| **PT-106**       | Transmissor Pressão     | Pressão do tanque de Armazenamento de alta pressão   | $p\_{1,6}$              | Pressão atinge o desejado do tanque ($P > 950\text{ bar}$) |
| **TT-103**       | Transmissor Temp.       | Temp. do tanque de Armazenamento de alta pressão      | $t\_{1,3}$              | Temperatura excede o limite seguro do vaso ($T > 85^\circ\text{C}$)    |
| **AT-103**       | Detector de Gás H₂      | Concentração de H₂ na área do tanque de Armazenamento de alta pressão          | $g\_{1,3}$              | Vazamento de hidrogênio detectado ($C > 1\text{\% vol, } 25\text{\% LIE}$) |                            |                                   |
| **PSV-103**      | Válvula de Alívio       | Proteção contra sobrepressão         | $r\_{1,3}$              | Válvula de alívio de pressão ATUADA
| **XV-103**       | Válvula Corte Rápido    | entrada do tanque de Armazenamento de alta pressão      | $v\_{1,3}$              | Válvula de segurança de entrada ABERTA
| **SL-103**       | Sinalizador / luz    | alarme do tanque de alta pressão     | $s\_{1,3}$              | Luz ACESSA
| **XV-104**       | 	Válvula Direcional 4/3 vias (duplo solenoide, retorno por mola)   | Posição de seleção do tanque     | $v\_{1,4}$              | quando ambas as bobinas não ligadas seleciona media pressão
| **YV-104A**       | Bobina Solenoide (lado A)    | Comando elétrico de acionamento A     | $y\_{1,4a}$              | Bobina A energizada → seleciona tanque de baixa pressão
| **YV-104B**       | Bobina Solenoide (lado B)    | Comando elétrico de acionamento B     | $y\_{1,4b}$              | Bobina B energizada → seleciona tanque de alta pressão                                  
| **ALM-101**      | Sinaleiro / Buzzer      | Alarme Geral                         | $a\_{1,1}$              | Sistema de alarme e evacuação ATIVADO  
| **ESD-100**      | Botão Físico            | Segurança Manual                     | $e\_{1,1}$              | Parada de emergência acionada pelo operador                                |
 
 
## Setor 200: Condicionamento (Pré-resfriamento)
 
| Tag Instrumento | Tipo de Dispositivo    | Variável Física                  | Proposição Lógica | Estado 1                                                       |
| ---------------- | ----------------------- | ---------------------------------- | ------------------ | ------------------------------------------------------------------ |
| **TT-201**       | Transmissor Temp.       | Temp. de Saída do Pré-resfriador   | $t\_{2,1}$              | Temperatura de pré-resfriamento adequada ($T \leq -40^\circ\text{C}$) |
| **PT-201**       | Transmissor Pressão     | Pressão do Buffer de Condicionamento| $p\_{2,1}$             | Pressão do buffer dentro da faixa de operação                      |
| **M-201**        | Contator do Motor       | Unidade de Refrigeração (Chiller)  | $m\_{2,1}$              | Chiller LIGADO e operacional  
| **XV-201**        | Válvula Corte Rápido      | valvula de entrada do chiller  | $v\_{2,1}$              | Válvula de segurança de entrada ABERTA                                       |
 
## Setor 300: Dispensador e Transferência para o Veículo
 
| Tag Instrumento | Tipo de Dispositivo    | Variável Física                              | Proposição Lógica | Estado 1                                                        |
| ---------------- | ----------------------- | ---------------------------------------------- | ------------------ | -------------------------------------------------------------------- |
| **HS-301**       | Chave Manual            | Comando de Início de Abastecimento             | $h\_{3,1}$              | Botão de início de abastecimento acionado pelo operador              |
| **COM-301**      | Comunicação IR          | Protocolo de Comunicação com o Veículo (J2799) | $c\_{3,1}$              | Comunicação estabelecida com o veículo                               |
| **BV-301**       | Válvula de Ruptura      | Acoplamento do Bico Dispensador (Breakaway)    | $bv\_{3,1}$             | Acoplamento do bico conectado e íntegro                              |
| **XV-301**       | Válvula Solenoide       | Alimentação do Bico Dispensador                | $v\_{3,1}$              | Válvula de dispensação ABERTA                                        |
| **PT-301**       | Transmissor Pressão     | Pressão no Bico (Nozzle)                       | $p\_{3,1}$              | Pressão de enchimento atinge o setpoint do veículo ($P \approx 700\text{ bar}$) |
| **TT-301**       | Transmissor Temp.       | Temp. no Ponto de Recepção do Veículo          | $t\_{3,1}$              | Temperatura no ponto de recepção excede o limite ($T > 85^\circ\text{C}$) |
| **AT-301**       | Detector de Gás H₂      | Concentração de H₂ na Área do Dispensador      | $g\_{3,1}$              | Vazamento de hidrogênio detectado na área de abastecimento           |
