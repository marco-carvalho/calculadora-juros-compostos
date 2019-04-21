<template lang="pug">
.container
  h1.text-center Calculadora de Juros Compostos
  .form-group
    label.font-weight-bold Valor Inicial:
    input.form-control(v-model.number="valorInicial" type="number" placeholder="ex: 15000")
  .row.form-group
    .col-6
      label.font-weight-bold Aporte Mensal:
      input.form-control(v-model.number="aporteMensal" type="number" placeholder="ex: 2200")
    .col
      label.font-weight-bold Aporte Anual:
      input.form-control(v-model.number="aporteAnual" type="number" placeholder="ex: 100000")
    .col
      label.font-weight-bold Mês do Aporte:
      input.form-control(v-model.number="mesAporteAnual" type="number" min="1" max="12")
  .form-group
    label.font-weight-bold Taxa Mensal (em %):
    input.form-control(v-model.number="taxaMensal" type="number" placeholder="ex: 0.5")
  .form-group
    label.font-weight-bold Prazo (em meses):
    input.form-control(v-model.number="prazo" type="number" placeholder="ex: 108" min="1")
  .table-responsive
    table.table.table-sm.table-hover
      thead
        th.text-center Mês
        th.text-center Saldo Parcial
        th.text-center Aporte Mensal
        th.text-center Aporte Anual
        th.text-center Acumulado
      tbody
        tr(v-for="(posicao, index) in getPosicoes()")
          td.text-center {{posicao.mes}}
          td.text-right {{formatToCurrency(posicao.saldoParcial)}}
          td.text-right {{formatToCurrency(posicao.aporteMensal)}}
          td.text-right {{formatToCurrency(posicao.aporteAnual)}}
          td.text-right {{formatToCurrency(posicao.saldoParcial + posicao.aporteMensal + posicao.aporteAnual)}}
</template>

<script>
export default {
  data() {
    return {
      valorInicial: 15000,
      aporteMensal: 2200,
      correcaoAporteMensal: 10,
      aporteAnual: 50000,
      mesAporteAnual: 2,
      correcaoAporteAnual: 10,
      rendimento: 0.5,
      prazo: 2*12,
    }
  },
  methods: {
    formatToCurrency(value) {
      return value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    },
    getPosicoes() {
      const posicoes = [];
      posicoes.push({
        mes: this.$moment().format('MM/YY'),
        saldoParcial: this.valorInicial,
        aporteMensal: 0,
        aporteAnual: 0,
      });
      for(let mes = this.$moment().add(1, 'months'); mes <= this.$moment().add(this.prazo, 'months'); mes.add(1, 'months')) {
        posicoes.push({
          mes: mes.format('MM/YY'),
          saldoParcial: (posicoes[posicoes.length-1].saldoParcial + posicoes[posicoes.length-1].aporteMensal + posicoes[posicoes.length-1].aporteAnual)  * (1+(this.taxaMensal/100)),
          aporteMensal: this.aporteMensal,
          aporteAnual: mes.format("M") == this.mesAporteAnual && mes.format("Y") != this.$moment().format("Y") ? this.aporteAnual : 0,
        })
      }
      return posicoes;
    }
  }
}
</script>