<template lang="pug">
.container.mx-auto
  .text-center.uppercase.font-bold.text-2xl Calculadora de Juros Compostos
  hr
  .mb-4
    InputComponent(
      label="Valor Inicial (em R$)"
      v-model.number="valorInicial"
      type="number"
      placeholder="ex: 15000"
      step="1000"
    )
  .flex.-mx-2
    .px-2.mb-4(class="w-3/4")
      InputComponent(
        label="Aporte Mensal (em R$)"
        v-model.number="aporteMensal"
        type="number"
        placeholder="ex: 2200"
        step="100"
      )
    .px-2.mb-4(class="w-1/4")
      InputComponent(
        label="Correção Anual do Aporte Mensal"
        v-model.number="correcaoAnualAporteMensal"
        type="number"
        placeholder="ex: 0.1"
        step="0.1"
      )
  .flex.-mx-2
    .px-2.mb-4(class="w-1/4")
      label.block.font-bold(
        class="md:w-2/3"
      )
        div Aporte Anual?
        input.mr-2(
          type="checkbox"
          v-model="aporteAnualHabilitado"
          @click="posicoes = []"
        )
    .px-2.mb-4(class="w-1/4")
      InputComponent(
        label="Aporte Anual (em R$)"
        v-model.number="aporteAnual"
        type="number"
        placeholder="ex: 100000"
        :disabled="!aporteAnualHabilitado"
        step="1000"
      )
    .px-2.mb-4(class="w-1/4")
      SelectComponent(
        label="Mês do Aporte Anual"
        v-model.number="mesAporteAnual"
        :options="Array.apply(0, Array(12)).map((_,i) => $moment().month(i).format('MMMM'))"
        :disabled="!aporteAnualHabilitado"
      )
    .px-2.mb-4(class="w-1/4")
      InputComponent(
        label="Correção Anual do Aporte Anual"
        v-model.number="correcaoAnualAporteAnual"
        type="number"
        placeholder="ex: 0.1"
        :disabled="!aporteAnualHabilitado"
        step="0.1"
      )
  .flex.-mx-2
    .px-2.mb-4(class="w-1/2")
      InputComponent(
        label="Rendimento (mensal)"
        v-model.number="rendimentoMensal"
        type="number"
        placeholder="ex: 0.005"
        step="0.001"
        @input="rendimentoAnual = Math.pow(1+Number(rendimentoMensal), 12)-1"
      )
    .px-2.mb-4(class="w-1/2")
      InputComponent(
        label="Rendimento (anual)"
        v-model.number="rendimentoAnual"
        type="number"
        placeholder="ex: 0.06"
        step="0.01"
        @input="rendimentoMensal = Math.pow(1+Number(rendimentoAnual), 1/12)-1"
      )
  .flex.-mx-2
    .px-2.mb-4(class="w-1/2")
      InputComponent(
        label="Prazo (em meses)"
        v-model.number="prazoMensal"
        type="number"
        placeholder="ex: 108"
        @input="prazoAnual = (prazoMensal/12).toFixed(2)"
      )
    .px-2.mb-4(class="w-1/2")
      InputComponent(
        label="Prazo (em anos)"
        v-model.number="prazoAnual"
        type="number"
        placeholder="ex: 9"
        @input="prazoMensal = (prazoAnual*12).toFixed(0)"
      )
  button.mb-4.bg-green-500.w-full.rounded.p-1(
    class="focus:outline-none hover:bg-green-600"
    @click="getPosicoes"
  )
    .text-white.text-center.font-bold Calcular
  table.table-auto.w-full(v-if="posicoes ? posicoes.length : posicoes")
    thead
      tr.border-b.border-black
        th.text-center Mês
        th.text-right Saldo Parcial
        th.text-right Aporte Mensal
        th.text-right(v-if="aporteAnualHabilitado") Aporte Anual
        th.text-right Acumulado
    tbody
      tr.border-b(
        v-for="(posicao, index) in posicoes"
        class="hover:bg-gray-400"
        :class="index % 2 == 0 ? 'bg-gray-200' : 'bg-white'"
      )
        td.text-center.lowercase {{$moment(posicao.data).format("MMM/YY")}}
        td.text-right {{formatToCurrency(posicao.saldoParcial)}}
        td.text-right {{formatToCurrency(posicao.aporteMensal)}}
        td.text-right(v-if="aporteAnualHabilitado") {{formatToCurrency(posicao.aporteAnual)}}
        td.text-right {{formatToCurrency(posicao.saldoParcial + posicao.aporteMensal + posicao.aporteAnual)}}
</template>

<script>
import InputComponent from "@/components/InputComponent"
import SelectComponent from "@/components/SelectComponent"

export default {
  data() {
    return {
      posicoes: [],
      valorInicial: 46000,
      aporteMensal: 4300,
      correcaoAnualAporteMensal: 0.2,
      aporteAnual: 50000,
      mesAporteAnual: 2,
      correcaoAnualAporteAnual: 0.1,
      rendimentoMensal: 0.01,
      rendimentoAnual: 0.12682503013196977,
      prazoMensal: 36,
      prazoAnual: 3,
      aporteAnualHabilitado: false,
    }
  },
  methods: {
    formatToCurrency(value) {
      if(!value) {
        return;
      }
      return value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    },
    getPosicoes() {
      const posicoes = [];
      posicoes.push({
        data: new Date(),
        saldoParcial: this.valorInicial,
        aporteMensal: this.aporteMensal,
        aporteAnual: 0,
      });
      for(let i = 0; i <= this.prazoMensal; i++) {
        const posicao = {};
        const {data, saldoParcial, aporteMensal, aporteAnual} = posicoes[i];
        posicao.data = this.$moment(data).add(1, "M").toDate();
        posicao.saldoParcial = (saldoParcial + aporteMensal + aporteAnual) * (1+this.rendimentoMensal);
        const newLocal = this.$moment(data).year() === this.$moment(posicao.data).year()
          ? 1
          : 1 + this.correcaoAnualAporteMensal;
        posicao.aporteMensal = aporteMensal * newLocal;
        posicao.aporteAnual = this.aporteAnualHabilitado && this.$moment(posicao.data).month() === this.mesAporteAnual
          ? this.aporteAnual
          : 0.00;
        posicoes.push(posicao);
      }
      this.posicoes = posicoes;
    }
  },
  components: {
    InputComponent,
    SelectComponent,
  }
}
</script>