# Representação Simbólica das Regras de Processo e Intertravamentos

No contexto do controle lógico de processos da Estação de Reabastecimento de Hidrogênio, a análise de tautologias e contradições garante que as equações booleanas dos intertravamentos (SIS) sejam consistentes e seguras.

## A. Intertrava de Trip de Emergência do Banco de Armazenamento (Setor 100)

A válvula de corte rápido do banco de armazenamento ($v_{1,X}$, XV-10X {1-3}) deve ser imediatamente FECHADA ($\neg v_{1,X}$) e o alarme geral acionado ($a_1$)e a respectiva sinalização ($s\_{1,X}$ ,SL-10X) caso haja sobrepressão, sobretemperatura, vazamento de gás ou acionamento manual de emergência.

* **Condição de Falha / Evento Crítico ($F_1$):**

$$F_{1,X}  \equiv p_{1,X} \lor t_{1,X} \lor g_{1,X} \lor e_1$$

* **Equação Lógica de Intertravamento:**

$$F_{1,X} \rightarrow (\neg v_{1,X} \land S{1,x} \land a_1)$$

$$F_{1,X}  \equiv F_1 $$

Adicionalmente, a válvula de alívio ($r_1$, PSV-101) atua especificamente em caso de sobrepressão, de forma independente do fechamento de $v_1$:

$$p_{1,x} C r_{1,x}$$

* **Exemplo para o tanque 1**

$$F_{1,1}  \equiv p_{1,1} \lor t_{1,1} \lor g_{1,1} \lor e_1$$

$$F_{1,1} \rightarrow (\neg v_{1,1} \land S{1,1} \land a_1)$$

$$p_{1,1} \rightarrow r_{1,1}$$

## B. Abastecimento dos tanques (Setor 100)

a ordem de abastecimento é tanque 3 $$\rightarrow$$ tanque 2 $$\rightarrow$$ tanque 1 sendo comandandado pelos sensores de presssão ($$p_{1,X}$$ , PT-10X {4-6})

$$\neg p_{1,6} \rightarrow ( v_{1,3} \land \neg v_{1,2} \land \neg v_{1,1})$$

$$p_{1,6} \land \neg p_{1,5} \rightarrow (\neg v_{1,3} \land v_{1,2} \land \neg v_{1,1})$$

$$p_{1,6} \land p_{1,5} \land \neg p_{1,4} \rightarrow (\neg v_{1,3} \land \neg v_{1,2} \land v_{1,1})$$

## C. loop do chiller do chiller (Setor 200)

enquanto a pressão e a tempuratura não forem suficientes  o chiller deve manter ligado até acumular a pressão e a temperatura adequada

$$ XV_{3,1} \rightarrow (p_{2,1} \land t_{2,1})

### D. Permissivo de Abertura do Dispensador / Início de Abastecimento (Setor 300)

A válvula de dispensação ($v_{3,1}$, XV-301) só pode abrir se: o operador tiver acionado o comando de início ($h_{3,1}$), a comunicação com o veículo estiver estabelecida ($c_{3,1}$), o acoplamento breakaway estiver íntegro ($bv_{3,1}$), o condicionamento do gás estiver adequado (pré-resfriamento $t_{3,1}$, pressão de buffer $p_{3,1}$ e chiller operacional $m_{2,1}$), e não houver vazamento de H₂ em nenhuma das duas zonas de detecção ($g_{1,X}$, $g_{3,1}$) nem parada de emergência ativa ($e_1$).

* **Condição de Permissivo de Abertura ($P_{disp}$):**

$$P_{disp} \equiv h_{3,1} \land c_{3,1} \land bv_{3,1} \land \not t_{3,1} \land p_{3,1} \land m_{2,1} \land \lnot g_{1,X} \land \lnot g_{3,1} \land \lnot e_1$$

* **Regra Operacional:**

$$P_{disp} \rightarrow v_{3,1}$$

## E. Trip de Abastecimento — Fechamento Imediato do Dispensador (Setor 300)

A válvula de dispensação ($v_3$) deve ser imediatamente fechada ($\neg v_3$) se a temperatura no ponto de recepção do veículo exceder o limite, se houver vazamento de H₂ detectado na área do dispensador, se o *breakaway* se desconectar, ou se a parada de emergência for acionada.

* **Condição de Falha de Abastecimento ($F_3$):**

$$F_3 \equiv t_{3,1} \lor g_{3,1} \lor \neg bv_{3,1} \lor e_1$$

* **Regra de Bloqueio:**

$$F_3 \rightarrow \neg v_{3,1}$$

---

# Validação Formal por Prova Lógica (Tautologia de Segurança)

## Prova 1 — Segurança do Banco de Armazenamento

Para demonstrar ao motor do SCADA-Core que a planta nunca entrará em estado de risco de explosão por sobrepressão mantendo a válvula de saída do armazenamento aberta, constrói-se a prova formal do teorema de segurança.

* **Afirmação de Segurança:** "Não é possível ter sobrepressão no armazenamento ($p_{1,X}$) E manter a válvula de saída $v_{1,X}$ aberta."
* **Proposição do Estado de Risco ($S_{risco,1}$):**

$$S_{risco,1} \equiv p_{1,X} \land v_{1,X}$$

Da regra de intertravamento A, sabe-se que $F_{1,X} \rightarrow (\neg v_{1,X} \land a_{1,1})$, e que $p_{1,X} \rightarrow F_{1,X}$ (pois $p_{1,X}$ é um dos disjuntos de $F_{1,X}$). Por silogismo hipotético, obtém-se a regra derivada implementada no controlador:

$$p_{1,X} \rightarrow \neg v_{1,X}$$

Aplica-se a equivalência lógica do condicional ($\mathbf{A} \rightarrow \mathbf{B} \equiv \neg \mathbf{A} \lor \mathbf{B}$):

$$p_{1,X} \rightarrow \neg v_{1,X} \equiv \neg p_{1,X} \lor \neg v_{1,X}$$

Substituindo o estado de risco sob a premissa de que a regra $p_{1,X} \rightarrow \neg v_{1,X}$ é estritamente VERDADEIRA (restringindo o espaço de estados):

$$S_{risco,1} \land (\neg p_{1,X} \lor \neg v_{1,X})$$

$$(p_{1,X} \land v_{1,X}) \land (\neg p_{1,X} \lor \neg v_{1,X})$$

Distribuindo $(p_{1,X} \land v_{1,X})$:

$$\big((p_{1,X} \land v_{1,X}) \land \neg p_{1,X}\big) \lor \big((p_{1,X} \land v_{1,X}) \land \neg v_{1,X}\big)$$

$$(Falso \land v_{1,X}) \lor (p_{1,X} \land Falso)$$

$$Falso \lor Falso \equiv \text{FALSO}$$

O estado de risco $S_{risco,1}$ é, portanto, uma **contradição** sob a regra de intertravamento vigente — o controlador nunca permitirá que esse estado seja alcançado.

(Exemplo aplicado ao tanque 1: substituindo $X \to 1$, obtém-se $S_{risco,1,1} \equiv p_{1,1} \land v_{1,1}$, também uma contradição, pela mesma dedução.)*

## Prova 2 — Segurança do Dispensador

Analogamente, demonstra-se que a planta nunca abastecerá um veículo na presença de vazamento de H₂ detectado na área do dispensador.

* **Afirmação de Segurança:** "Não é possível ter vazamento de H₂ no dispensador ($g_{3,1}$) E manter a válvula de dispensação $v_{3,1}$ aberta."
* **Proposição do Estado de Risco ($S_{risco,3}$):**

$$S_{risco,3} \equiv g_{3,1} \land v_{3,1}$$

Da regra de intertravamento E, sabe-se que $F_3 \rightarrow \neg v_{3,1}$, e que $g_{3,1} \rightarrow F_3$ (pois $g_{3,1}$ é um dos disjuntos de $F_3$). Por silogismo hipotético:

$$g_{3,1} \rightarrow \neg v_{3,1} \equiv \neg g_{3,1} \lor \neg v_{3,1}$$

Substituindo o estado de risco:

$$S_{risco,3} \land (\neg g_{3,1} \lor \neg v_{3,1})$$

$$(g_{3,1} \land v_{3,1}) \land (\neg g_{3,1} \lor \neg v_{3,1})$$

Distribuindo $(g_{3,1} \land v_{3,1})$:

$$\big((g_{3,1} \land v_{3,1}) \land \neg g_{3,1}\big) \lor \big((g_{3,1} \land v_{3,1}) \land \neg v_{3,1}\big)$$

$$(Falso \land v_{3,1}) \lor (g_{3,1} \land Falso)$$

$$Falso \lor Falso \equiv \text{FALSO}$$

O estado de risco $S_{risco,3}$ é igualmente uma **contradição** lógica: o SCADA-Core nunca permitirá abastecimento com vazamento de H₂ ativo na área do dispensador.
