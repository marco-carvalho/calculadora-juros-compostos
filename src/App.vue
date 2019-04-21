<template lang="pug">
.container
  .h1.text-center.text-uppercase Calculadora de Juros Compostos
  hr
  .mb-3
    label.font-weight-bold Valor Inicial (em R$):
    input.form-control(v-model.number="valorInicial" type="number" placeholder="ex: 15000" min="1")
  .row
    .col-lg-8.mb-3
      label.font-weight-bold Aporte Mensal (em R$):
      input.form-control(v-model.number="aporteMensal" type="number" placeholder="ex: 2200" min="1")
    .col-lg-4.mb-3
      label.font-weight-bold Correção Anual do Aporte Mensal (em %):
      input.form-control(v-model.number="correcaoAporteMensal" type="number" placeholder="ex: 10" min="1")
  .row
    .col-lg-4.mb-3
      label.font-weight-bold Aporte Anual (em R$):
      input.form-control(v-model.number="aporteAnual" type="number" placeholder="ex: 100000" min="1")
    .col-lg-4.mb-3
      label.font-weight-bold Mês do Aporte Anual:
      input.form-control(v-model.number="mesAporteAnual" type="number" min="1" max="12")
    .col-lg-4.mb-3
      label.font-weight-bold Correção Anual do Aporte Anual (em %):
      input.form-control(v-model.number="correcaoAporteAnual" type="number" placeholder="ex: 10" min="1" disabled)
  .row
    .col-lg.mb-3
      label.font-weight-bold Rendimento (mensal em %):
      input.form-control(v-model.number="rendimento" type="number" placeholder="ex: 0.5" min="1")
    .col-lg.mb-3
      label.font-weight-bold Rendimento (anual em %):
      input.form-control(@keyup="rendimento = ($event.target.value/12)" type="number" placeholder="ex: 6" min="1")
  .row
    .col-lg.mb-3
      label.font-weight-bold Prazo (em meses):
      input.form-control(v-model.number="prazo" type="number" placeholder="ex: 108" min="1")
    .col-lg.mb-3
      label.font-weight-bold Prazo (em anos):
      input.form-control(@keyup="prazo = ($event.target.value*12).toFixed(0)" type="number" placeholder="ex: 9" min="1")
  .table-responsive
    table.table.table-sm.table-hover.table-striped
      thead
        th.text-center Mês
        th.text-right Saldo Parcial
        th.text-right Aporte Mensal
        th.text-right Aporte Anual
        th.text-right Acumulado
      tbody
        tr(v-for="(posicao, index) in getPosicoes()")
          td.text-center {{$moment(posicao.data).format("MM/YY")}}
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
        data: new Date(),
        saldoParcial: this.valorInicial,
        aporteMensal: 0,
        aporteAnual: 0,
      });
      for(let i = 0; i <= this.prazo; i++) {
        const {data, saldoParcial, aporteMensal, aporteAnual} = posicoes[i];
        const posicao = {};
        posicao.data = this.$moment(data).add(1, "M").toDate();
        posicao.saldoParcial = (saldoParcial + aporteMensal + aporteAnual) * (1+this.rendimento/100);
        posicao.aporteMensal = this.aporteMensal * (this.$moment(data).year() === this.$moment(posicao.data).year() ? 1 : (1+this.correcaoAporteMensal/100));
        posicao.aporteAnual = this.$moment(posicao.data).month() === this.mesAporteAnual-1 ? this.aporteAnual : 0;
        posicoes.push(posicao);
      }
      return posicoes;
    }
  }
}
</script>