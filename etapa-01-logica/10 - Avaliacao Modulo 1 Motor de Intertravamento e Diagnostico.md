# Aula 10: Avaliação Integrada do Módulo 1 — Motor de Intertravamento e Diagnóstico

## 1. Escopo e Diretrizes do Desafio de Engenharia

Nesta avaliação integradora, consolido os conceitos do **Módulo 1: Lógica Formal & Sistemas Especialistas**, demonstrando o funcionamento conjunto do:
1. Catálogo e telemetria de *Tags* ISA-5.1 (PT, TT, AT, XV, ESD, HS), com conversão de leituras físicas em proposições lógicas a partir dos limiares definidos na Aula 02 (Mapeamento de Variáveis de Processo).
2. Base de conhecimento especialista (Aula 08) e motor de inferência *Forward Chaining* (Aula 09) para isolamento de causa-raiz.
3. Motor de intertravamento consolidado num único ciclo de varredura (*scan cycle*), avaliando simultaneamente os Setores 100 (Armazenamento), 200 (Condicionamento) e 300 (Dispensação) da Estação de Reabastecimento de Hidrogênio.

---

## 2. Entregável da Aula 10

* **SCADA-Core Módulo 1 Integrado:** Script executável validando os intertravamentos e diagnósticos da Estação de Reabastecimento de Hidrogênio, através da classe `SCADACoreModulo1`, que integra:
  * `MapeadorProposicional` — converte telemetria bruta (ex: `PT-103 = 1050.0`) em fatos binários (`p1_3 = True`) segundo os limiares de cada tanque/setor.
  * `BaseConhecimento` — as 14 regras de produção definidas na Aula 08.
  * `MotorInferencia` — encadeamento *Forward Chaining* até o ponto fixo.
  * `processar_ciclo_scan` — recebe a telemetria de um ciclo de varredura e retorna o estado de trip geral (`Trip_Ativo`), os fatos de campo ativos e os diagnósticos inferidos (causa-raiz).

* **Suíte de testes de estresse validada:**
  1. **Cenário de falha:** Tanque de Alta Pressão em sobrepressão com válvula de entrada aberta (`PT-103 = 1050 bar`, `XV-103` aberta) → motor detecta `Trip_Ativo = True` e isola corretamente a causa-raiz `TRIP_TANQUE_ALTA`, passando por `SOBREPRESSAO_TANQUE_ALTA` na trilha de inferência.
  2. **Cenário de operação normal:** Abastecimento em andamento atingindo o setpoint do veículo (`PT-301 = 705 bar`) → motor confirma `Trip_Ativo = False` e infere corretamente `ABASTECIMENTO_CONCLUIDO`, sem disparar nenhum trip espúrio.
