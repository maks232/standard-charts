import { DefaultBarChart } from './chart/bar/variant/DefaultBarChart';
import { DefaultColumnChart } from './chart/column/variant/DefaultColumnChart';
import { StackColumnChart } from './chart/column/variant/StackColumnChart';
import { ReScale } from './chart/ReScale';
import { Scale } from './chart/Scale';
import { ChartType, ColumnChartVariant } from './types/ChartType';

export default function StandardCharts(charts) {
  if (!Array.isArray(charts)) {
    charts = [charts];
  }

  let scales = [];
  let minScale = Number.MAX_VALUE;

  for (let i = 0; i < charts.length; i++) {
    const { chartType, chartVariant, data, height, width } = charts[i];

    let scale = { scale: 1 };

    let oldRescale = 0;
    let reScale = 1;

    while (oldRescale != reScale) {
      oldRescale = reScale;
      switch (chartType) {
        case ChartType.COLUMN:
          switch (chartVariant) {
            case ColumnChartVariant.STACK:
              reScale = 1;
              scale = Scale.StackColum(charts[i], reScale * height);
              break;
            default:
              reScale = ReScale.DefaultColumn(charts[i], reScale * scale.scale);
              scale = Scale.DefaultColumn(charts[i], reScale * height);
          }
          break;
        case ChartType.BAR:
          switch (chartVariant) {
            default:
              reScale = 1;
              scale = Scale.DefaultBar(charts[i], reScale * height);
          }
          break;
      }
      console.log('ITERATION', oldRescale, reScale);
    }

    console.log('finished');

    scale.reScale = reScale;
    scales.push(scale);

    if (scales[i].scale < minScale) {
      minScale = scales[i].scale;
    }
  }

  let renderedCharts = [];

  for (let i = 0; i < charts.length; i++) {
    const chart = charts[i];
    const { chartType, chartVariant } = chart;

    const chartSpecificScale = scales[i];

    switch (chartType) {
      case ChartType.COLUMN:
        switch (chartVariant) {
          case ColumnChartVariant.STACK:
            renderedCharts.push(
              StackColumnChart(chart, {
                ...chartSpecificScale,
                scale: minScale,
              })
            );
            break;
          default:
            renderedCharts.push(
              DefaultColumnChart(chart, {
                ...chartSpecificScale,
                scale: minScale,
              })
            );
        }
        break;
      case ChartType.BAR:
        switch (chartVariant) {
          default:
            renderedCharts.push(
              DefaultBarChart(chart, {
                ...chartSpecificScale,
                scale: minScale,
              })
            );
        }
        break;
    }
  }

  return renderedCharts;
}
