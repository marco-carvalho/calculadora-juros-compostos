import React, { useState } from "react";
import InputComponent from "./components/InputComponent";
import SelectComponent from "./components/SelectComponent";
import moment from "moment";

const CalculadoraJurosCompostos: React.FC = () => {
  const [valorInicial, setValorInicial] = useState<number>(46000);
  const [aporteMensal, setAporteMensal] = useState<number>(4300);
  const [correcaoAnualAporteMensal, setCorrecaoAnualAporteMensal] = useState<number>(0.2);
  const [aporteAnual, setAporteAnual] = useState<number>(50000);
  const [mesAporteAnual, setMesAporteAnual] = useState<number>(2);
  const [correcaoAnualAporteAnual, setCorrecaoAnualAporteAnual] = useState<number>(0.1);
  const [rendimentoMensal, setRendimentoMensal] = useState<number>(0.01);
  const [rendimentoAnual, setRendimentoAnual] = useState<number>(0.12682503013196977);
  const [prazoMensal, setPrazoMensal] = useState<number>(36);
  const [prazoAnual, setPrazoAnual] = useState<number>(3);
  const [aporteAnualHabilitado, setAporteAnualHabilitado] = useState<boolean>(false);
  const [posicoes, setPosicoes] = useState<any[]>([]);

  const formatToCurrency = (value: number | null) => {
    if (!value) {
      return null;
    }
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const getPosicoes = () => {
    const posicoes = [];
    posicoes.push({
      data: new Date(),
      saldoParcial: valorInicial,
      aporteMensal: aporteMensal,
      aporteAnual: 0,
    });
    for (let i = 0; i <= prazoMensal; i++) {
      const posicao: any = {};
      posicao.data = moment(posicoes[i].data).add(1, "M").toDate();
      posicao.saldoParcial = (posicoes[i].saldoParcial + posicoes[i].aporteMensal + (posicoes[i].aporteAnual || 0)) * (1 + rendimentoMensal);
      if (moment(posicoes[i].data).year() === moment(posicao.data).year()) {
        posicao.aporteMensal = posicoes[i].aporteMensal;
      } else {
        posicao.aporteMensal = posicoes[i].aporteMensal * (1 + correcaoAnualAporteMensal);
      }
      if (aporteAnualHabilitado && moment(posicao.data).month() === mesAporteAnual) {
        posicao.aporteAnual = aporteAnual;
      }
      posicoes.push(posicao);
    }
    setPosicoes(posicoes);
  };

  return (
    <div className="container mx-auto">
      <div className="text-center uppercase font-bold text-2xl">Calculadora de Juros Compostos</div>
      <hr />
      <div className="mb-4">
        <InputComponent
          label="Valor Inicial (em R$)"
          value={valorInicial}
          onChange={(e: any) => setValorInicial(Number(e.target.value))}
          type="number"
          placeholder="ex: 15000"
          step="1000"
        />
      </div>
      <div className="flex -mx-2">
        <div className="px-2 mb-4 w-3/4">
          <InputComponent
            label="Aporte Mensal (em R$)"
            value={aporteMensal}
            onChange={(e: any) => setAporteMensal(Number(e.target.value))}
            type="number"
            placeholder="ex: 2200"
            step="100"
          />
        </div>
        <div className="px-2 mb-4 w-1/4">
          <InputComponent
            label="Correção Anual do Aporte Mensal"
            value={correcaoAnualAporteMensal}
            onChange={(e: any) => setCorrecaoAnualAporteMensal(Number(e.target.value))}
            type="number"
            placeholder="ex: 0.1"
            step="0.1"
          />
        </div>
      </div>
      <div className="flex -mx-2">
        <div className="px-2 mb-4 w-1/4">
          <label className="block font-bold md:w-2/3">
            <div>Aporte Anual?</div>
            <input
              className="mr-2"
              type="checkbox"
              checked={aporteAnualHabilitado}
              onChange={() => {
                setAporteAnualHabilitado(!aporteAnualHabilitado);
                setPosicoes([]);
              }}
            />
          </label>
        </div>
        <div className="px-2 mb-4 w-1/4">
          <InputComponent
            label="Aporte Anual (em R$)"
            value={aporteAnual}
            onChange={(e: any) => setAporteAnual(Number(e.target.value))}
            type="number"
            placeholder="ex: 100000"
            disabled={!aporteAnualHabilitado}
            step="1000"
          />
        </div>
        <div className="px-2 mb-4 w-1/4">
          <SelectComponent
            label="Mês do Aporte Anual"
            value={mesAporteAnual}
            onChange={(e: any) => setMesAporteAnual(Number(e.target.value))}
            options={Array.from({ length: 12 }, (_, i) => moment().month(i).format("MMMM"))}
            disabled={!aporteAnualHabilitado}
          />
        </div>
        <div className="px-2 mb-4 w-1/4">
          <InputComponent
            label="Correção Anual do Aporte Anual"
            value={correcaoAnualAporteAnual}
            onChange={(e: any) => setCorrecaoAnualAporteAnual(Number(e.target.value))}
            type="number"
            placeholder="ex: 0.1"
            disabled={!aporteAnualHabilitado}
            step="0.1"
          />
        </div>
      </div>
      <div className="flex -mx-2">
        <div className="px-2 mb-4 w-1/2">
          <InputComponent
            label="Rendimento (mensal)"
            value={rendimentoMensal}
            onChange={(e: any) => {
              const value = Number(e.target.value);
              setRendimentoMensal(value);
              setRendimentoAnual(Math.pow(1 + value, 12) - 1);
            }}
            type="number"
            placeholder="ex: 0.005"
            step="0.001"
          />
        </div>
        <div className="px-2 mb-4 w-1/2">
          <InputComponent
            label="Rendimento (anual)"
            value={rendimentoAnual}
            onChange={(e: any) => {
              const value = Number(e.target.value);
              setRendimentoAnual(value);
              setRendimentoMensal(Math.pow(1 + value, 1 / 12) - 1);
            }}
            type="number"
            placeholder="ex: 0.06"
            step="0.01"
          />
        </div>
      </div>
      <div className="flex -mx-2">
        <div className="px-2 mb-4 w-1/2">
          <InputComponent
            label="Prazo (em meses)"
            value={prazoMensal}
            onChange={(e: any) => {
              const value = Number(e.target.value);
              setPrazoMensal(value);
              setPrazoAnual(Number((value / 12).toFixed(2)));
            }}
            type="number"
            placeholder="ex: 108"
          />
        </div>
        <div className="px-2 mb-4 w-1/2">
          <InputComponent
            label="Prazo (em anos)"
            value={prazoAnual}
            onChange={(e: any) => {
              const value = Number(e.target.value);
              setPrazoAnual(value);
              setPrazoMensal(Number((value * 12).toFixed(0)));
            }}
            type="number"
            placeholder="ex: 9"
          />
        </div>
      </div>
      <div className="flex -mx-2">
        <div className="px-2 mb-4 w-1/2">
          <button
            className="mb-4 bg-green-500 w-full rounded p-1 focus:outline-none hover:bg-green-600"
            onClick={getPosicoes}
          >
            <div className="text-white text-center font-bold">Calcular em Tabela</div>
          </button>
        </div>
        <div className="px-2 mb-4 w-1/2">
          <button
            className="mb-4 bg-orange-500 w-full rounded p-1 opacity-50 cursor-not-allowed focus:outline-none"
          >
            <div className="text-white text-center font-bold">Calcular em Gráfico (em construção)</div>
          </button>
        </div>
      </div>
      {posicoes.length > 0 && (
        <table className="table-auto w-full">
          <thead>
            <tr className="border-b border-black">
              <th className="text-center">Data</th>
              <th className="text-right">Saldo Parcial</th>
              <th className="text-right">Aporte Mensal</th>
              {aporteAnualHabilitado && <th className="text-right">Aporte Anual</th>}
              <th className="text-right">Acumulado</th>
            </tr>
          </thead>
          <tbody>
            {posicoes.map((posicao, index) => (
              <tr
                key={index}
                className={`border-b hover:bg-gray-400 ${index % 2 === 0 ? "bg-gray-200" : "bg-white"}`}
              >
                <td className="text-center lowercase">{moment(posicao.data).format("MMM/YY")}</td>
                <td className="text-right">{formatToCurrency(posicao.saldoParcial)}</td>
                <td className="text-right">{formatToCurrency(posicao.aporteMensal)}</td>
                {aporteAnualHabilitado && <td className="text-right">{formatToCurrency(posicao.aporteAnual)}</td>}
                <td className="text-right">
                  {formatToCurrency(posicao.saldoParcial + posicao.aporteMensal + (posicao.aporteAnual || 0))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CalculadoraJurosCompostos;
