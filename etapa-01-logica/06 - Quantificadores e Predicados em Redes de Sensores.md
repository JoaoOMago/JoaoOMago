# 06 - Quantificadores e Predicados em Redes de Sensores

Este documento formaliza as regras de operação e intertravamento da Estação de Reabastecimento de Hidrogênio sob a ótica da Lógica de Primeira Ordem (FOL). Diferente da lógica proposicional clássica, a lógica de predicados permite parametrizar e avaliar propriedades sistêmicas sobre domínios e conjuntos finitos de ativos industriais, reduzindo a complexidade de programação do sistema SCADA-Core.

## 1. Definição de Domínios (Universo de Discurso) e Predicados

O universo de discurso $U$ representa a totalidade da malha de instrumentos mapeada na planta. Ele é subdividido em subconjuntos lógicos baseados na topologia física do processo:

### Domínios da Rede ($U$)
* **Setor 100 (Armazenamento em Cascata):** $S_{100} = \{\text{PT-101}, \text{PT-102}, \text{PT-103}, \text{PT-104}, \text{PT-105}, \text{PT-106}, \text{TT-101}, \text{TT-102}, \text{TT-103}, \text{AT-101}, \text{AT-102}, \text{AT-103}\}$
* **Setor 200 (Condicionamento Térmico / Chiller):** $S_{200} = \{\text{TT-201}, \text{PT-201}, \text{M-201}, \text{XV-201}\}$
* **Setor 300 (Dispensação e Conexão com Veículo):** $S_{300} = \{\text{HS-301}, \text{COM-301}, \text{BV-301}, \text{XV-301}, \text{PT-301}, \text{TT-301}, \text{AT-301}\}$

### Predicados Lógicos de Processo

As funções booleanas parametrizadas (predicados) mapeiam um elemento do domínio para um valor de verdade $\{0, 1\}$, estabelecendo as condições críticas de operação:

* **Pressão Crítica de Alarme ($P_{\text{crit}}(x)$):**
  Avalia o risco de ruptura estrutural nos vasos de pressão.
  $$P_{\text{crit}}(x) \iff \begin{cases} P(x) > 400\text{ bar}, & x = \text{PT-101} \\ P(x) > 700\text{ bar}, & x = \text{PT-102} \\ P(x) > 1000\text{ bar}, & x = \text{PT-103} \end{cases}$$

* **Temperatura Crítica ($T_{\text{crit}}(x)$):**
  Monitora a expansão térmica indesejada do gás nos cilindros.
  $$T_{\text{crit}}(x) \iff T(x) > 85^\circ\text{C}, \quad \forall x \in \{\text{TT-101}, \text{TT-102}, \text{TT-103}, \text{TT-301}\}$$

* **Vazamento de Hidrogênio ($G_{\text{crit}}(x)$):**
  Aciona protocolos de mitigação caso o gás atinja concentrações perigosas.
  $$G_{\text{crit}}(x) \iff C(x) > 25\%\text{ LIE}, \quad \forall x \in \{\text{AT-101}, \text{AT-102}, \text{AT-103}, \text{AT-301}\}$$

* **Pré-resfriamento Adequado ($R_{\text{ok}}(x)$):**
  Garante o cumprimento da norma SAE J2601 para abastecimento.
  $$R_{\text{ok}}(\text{TT-201}) \iff T(\text{TT-201}) \leq -40^\circ\text{C}$$

---

## 2. Expressões Lógicas Quantificadas e Motor de Varredura

### 2.1 Condição Existencial para Trip de Emergência ($\text{TRIP}_{\text{SIS}}$)
O alarme geral da planta ($\text{ALM-101}$) e o shutdown do Sistema Instrumentado de Segurança (SIS) são ativados imediatamente se **existir pelo menos um** sensor no banco de cilindros do Setor 100 acusando estado crítico de pressão, temperatura ou concentração de gás, ou se a parada de emergência manual ($\text{ESD-100}$) for acionada pelo operador:

$$\text{TRIP}_{\text{SIS}} \iff \exists x \in S_{100} \big( P_{\text{crit}}(x) \lor T_{\text{crit}}(x) \lor G_{\text{crit}}(x) \big) \lor e_{1,1}$$

### 2.2 Condição Universal de Integridade
O armazenamento de alta pressão opera em regime normal, provendo disponibilidade para o processo, se e somente se **para todo e qualquer** instrumento do Setor 100, os valores medidos estiverem estritamente abaixo dos limites de intertravamento:

$$\text{Armazenamento}_{\text{OK}} \iff \forall x \in S_{100} \big( \neg P_{\text{crit}}(x) \land \neg T_{\text{crit}}(x) \land \neg G_{\text{crit}}(x) \big)$$

### 2.3 Permissivo de Abastecimento ($\text{XV-301}$)
A abertura da válvula de controle principal de dispensação $\text{XV-301}$ ($v_{3,1}$) depende de uma matriz complexa que combina avaliação universal de um setor inteiro com estados discretos e analógicos dos subsistemas. É exigida a integridade universal do Setor 100, um fluxo de gás adequadamente pré-resfriado ($T \leq -40^\circ\text{C}$), o motor do chiller $M_{201}$ em pleno funcionamento operacional, comunicação de dados $COM_{301}$ criptografada ativa com a ECU do veículo, a integridade estrutural da trava de ruptura pneumática $BV_{301}$ e, por fim, o comando explícito do operador no painel $HS_{301}$:

$$\text{Permissivo}_{\text{XV-301}} \iff \Big( \forall x \in S_{100} \big(\neg P_{\text{crit}}(x) \land \neg T_{\text{crit}}(x) \land \neg G_{\text{crit}}(x)\big) \Big) \land R_{\text{ok}}(\text{TT-201}) \land m_{2,1} \land c_{3,1} \land bv_{3,1} \land h_{3,1} \land \neg e_{1,1}$$
