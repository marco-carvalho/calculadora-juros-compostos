<template lang="pug">
.container.mx-auto
  .text-center.uppercase.font-bold.font-2xl Calculadora de Juros Compostos
  hr
  .mb-4
    label.block.font-bold Valor Inicial (em R$):
    input.h-6.border-b.border-green-500.w-full(
      v-model.number="valorInicial"
      type="number"
      placeholder="ex: 15000"
      class="focus:outline-none"
    )
  .flex.-mx-2
    .px-2.mb-4(class="w-2/3")
      label.block.font-bold Aporte Mensal (em R$):
      input.h-6.border-b.border-green-500.w-full(
        v-model.number="aporteMensal"
        type="number"
        placeholder="ex: 2200"
        class="focus:outline-none"
      )
    .px-2.mb-4(class="w-1/3")
      label.block.font-bold Correção Anual do Aporte Mensal:
      input.h-6.border-b.border-green-500.w-full(
        type="number"
        placeholder="ex: 0.1"
        v-model.number="correcaoAnualAporteMensal"
        class="focus:outline-none"
      )
  .flex.-mx-2
    .px-2.mb-4(class="w-1/3")
      label.block.font-bold Aporte Anual (em R$):
      input.h-6.border-b.border-green-500.w-full(
        type="number"
        placeholder="ex: 100000"
        v-model.number="aporteAnual"
        class="focus:outline-none"
      )
    .px-2.mb-4(class="w-1/3")
      label.block.font-bold Mês do Aporte Anual:
      select.h-6.border-b.border-green-500.w-full.bg-white(
        v-model.number="mesAporteAnual"
        class="focus:outline-none"
      )
        option(
          v-for="(i, index) in Array.apply(0, Array(12)).map((_,i) => $moment().month(i).format('MMMM'))"
          :value="index"
        ) {{i}}
    .px-2.mb-4(class="w-1/3")
      label.block.font-bold Correção Anual do Aporte Anual:
      input.h-6.border-b.border-green-500.w-full(
        type="number"
        placeholder="ex: 0.1"
        disabled
        v-model.number="correcaoAnualAporteAnual"
        class="focus:outline-none"
      )
  .flex.-mx-2
    .px-2.mb-4(class="w-1/2")
      label.block.font-bold Rendimento (mensal):
      input.h-6.border-b.border-green-500.w-full(
        type="number"
        placeholder="ex: 0.005"
        v-model.number="rendimentoMensal" @input="rendimentoAnual = Math.pow(1+Number($event.target.value), 12)-1"
        class="focus:outline-none"
      )
    .px-2.mb-4(class="w-1/2")
      label.block.font-bold Rendimento (anual):
      input.h-6.border-b.border-green-500.w-full(
        type="number"
        placeholder="ex: 0.06"
        v-model.number="rendimentoAnual" @input="rendimentoMensal = Math.pow(1+Number($event.target.value), 1/12)-1"
        class="focus:outline-none"
      )
  .flex.-mx-2
    .px-2.mb-4(class="w-1/2")
      label.block.font-bold Prazo (em meses):
      input.h-6.border-b.border-green-500.w-full(
        type="number"
        placeholder="ex: 108"
        v-model.number="prazoMensal"
        @input="prazoAnual = ($event.target.value/12).toFixed(2)"
        class="focus:outline-none"
      )
    .px-2.mb-4(class="w-1/2")
      label.block.font-bold Prazo (em anos):
      input.h-6.border-b.border-green-500.w-full(
        v-model.number="prazoAnual"
        @input="prazoMensal = ($event.target.value*12).toFixed(0)"
        type="number"
        placeholder="ex: 9"
        class="focus:outline-none"
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
        th.text-right Aporte Anual
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
        td.text-right {{formatToCurrency(posicao.aporteAnual)}}
        td.text-right {{formatToCurrency(posicao.saldoParcial + posicao.aporteMensal + posicao.aporteAnual)}}
</template>

<script>
export default {
  data() {
    return {
      posicoes: [],
      valorInicial: 15000,
      aporteMensal: 2200,
      correcaoAnualAporteMensal: 0.1,
      aporteAnual: 50000,
      mesAporteAnual: 2,
      correcaoAnualAporteAnual: 0.1,
      rendimentoMensal: 0.004867550565343048,
      rendimentoAnual: 0.06,
      prazoMensal: 2*12,
      prazoAnual: 2,
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
        const {data, saldoParcial, aporteMensal, aporteAnual} = posicoes[i];
        const posicao = {};
        posicao.data = this.$moment(data).add(1, "M").toDate();
        posicao.saldoParcial = (saldoParcial + aporteMensal + aporteAnual) * (1+this.rendimentoMensal);
        const newLocal = this.$moment(data).year() === this.$moment(posicao.data).year()
          ? 1
          : 1 + this.correcaoAnualAporteMensal;
        posicao.aporteMensal = aporteMensal * newLocal;
        posicao.aporteAnual = this.$moment(posicao.data).month() === this.mesAporteAnual
          ? this.aporteAnual
          : 0.00;
        posicoes.push(posicao);
      }
      this.posicoes = posicoes;
    }
  }
}
</script>