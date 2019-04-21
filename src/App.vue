<template lang="pug">
.container
  .h1.text-center.text-uppercase Calculadora de Juros Compostos
  hr
  .mb-3
    label.font-weight-bold Valor Inicial (em R$):
    input.form-control(v-model.number="valorInicial" type="number" placeholder="ex: 15000")
  .row
    .col-lg-8.mb-3
      label.font-weight-bold Aporte Mensal (em R$):
      input.form-control(v-model.number="aporteMensal" type="number" placeholder="ex: 2200")
    .col-lg-4.mb-3
      label.font-weight-bold Correção Anual do Aporte Mensal:
      input.form-control(v-model.number="correcaoAnualAporteMensal" type="number" placeholder="ex: 0.1")
  .row
    .col-lg-4.mb-3
      label.font-weight-bold Aporte Anual (em R$):
      input.form-control(v-model.number="aporteAnual" type="number" placeholder="ex: 100000")
    .col-lg-4.mb-3
      label.font-weight-bold Mês do Aporte Anual:
      select.form-control(v-model.number="mesAporteAnual")
        option(v-for="(i, index) in Array.apply(0, Array(12)).map((_,i) => $moment().month(i).format('MMMM'))" :value="index") {{i}}
    .col-lg-4.mb-3
      label.font-weight-bold Correção Anual do Aporte Anual:
      input.form-control(v-model.number="correcaoAnualAporteAnual" type="number" placeholder="ex: 0.1" disabled)
  .row
    .col-lg.mb-3
      label.font-weight-bold Rendimento (mensal):
      input.form-control(v-model.number="rendimentoMensal" @input="rendimentoAnual = Math.pow(1+Number($event.target.value), 12)-1"  type="number" placeholder="ex: 0.005")
    .col-lg.mb-3
      label.font-weight-bold Rendimento (anual):
      input.form-control(v-model.number="rendimentoAnual" @input="rendimentoMensal = Math.pow(1+Number($event.target.value), 1/12)-1" type="number" placeholder="ex: 0.06")
  .row
    .col-lg.mb-3
      label.font-weight-bold Prazo (em meses):
      input.form-control(v-model.number="prazo" type="number" placeholder="ex: 108")
    .col-lg.mb-3
      label.font-weight-bold Prazo (em anos):
      input.form-control(@input="prazo = ($event.target.value*12).toFixed(0)" type="number" placeholder="ex: 9")
  button.btn.btn-success.btn-block.btn-sm.mb-3(@click="getPosicoes")
    .font-weight-bold Calcular
  .table-responsive(v-if="posicoes ? posicoes.length : posicoes")
    table.table.table-sm.table-hover.table-striped
      thead
        th.text-center Mês
        th.text-right Diferença D0/D-30
        th.text-right Saldo Parcial
        th.text-right Aporte Mensal
        th.text-right Aporte Anual
        th.text-right Acumulado
      tbody
        tr(v-for="(posicao, index) in posicoes")
          td.text-center {{$moment(posicao.data).format("MM/YY")}}
          td.text-right {{posicoes[index-1] ? ((posicao.saldoParcial/posicoes[index-1].saldoParcial-1)*100).toFixed(4) + '%' : null}} 
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
      prazo: 2*12,
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
      for(let i = 0; i <= this.prazo; i++) {
        const {data, saldoParcial, aporteMensal, aporteAnual} = posicoes[i];
        const posicao = {};
        posicao.data = this.$moment(data).add(1, "M").toDate();
        posicao.saldoParcial = (saldoParcial + aporteMensal + aporteAnual) * (1+this.rendimentoMensal);
        posicao.aporteMensal = aporteMensal * (this.$moment(data).year() === this.$moment(posicao.data).year()
          ? 1 
          : (1+this.correcaoAnualAporteMensal)
        );
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