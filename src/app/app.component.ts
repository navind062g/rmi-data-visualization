import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartDatasetModel } from './chartdataset.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'rmi-data-visualization';
  @ViewChild('lineChartCanvas') lineChartCanvas: ElementRef | undefined;
  @ViewChild('canvasDiv') canvasDiv: ElementRef | undefined;

  myChart: Chart;
  chartDatasets: ChartDatasetModel[] = [];

  chartLabels = [...Array(25).keys()];
  chartData = {};

  chartOptions = { 
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    layout: {
      padding: {
          left: 50,
          right: 0,
          top: 0,
          bottom: 0
      }
    },
    plugins:  {
      title: {
        display: true,
        text: 'Load Curve'
      }
    }
  };

  highestPointOfLoad = '';
  timeAthighestPointOfLoad = '';
  lowestPointOfLoad = '';
  timeAtLowestPointOfLoad = '';
  baseLoad = '';
  loadAtStart = '';
  timeAtStartOfLoad = '';
  timeAtEndOfLoad = '';
  curveType = 'Analog';

  constructor() {
    Chart.register(...registerables);
    this.chartDatasets.push(new ChartDatasetModel());
  }

  ngAfterViewInit(): void {}

  isToDisableGenerateChart(): boolean {
    if(!this.highestPointOfLoad || this.highestPointOfLoad === '') {
      return true;
    }
    else if(!this.timeAthighestPointOfLoad || this.timeAthighestPointOfLoad === '') {
      return true;
    }
    else if(!this.baseLoad || this.baseLoad === '') {
      return true;
    }

    return false;
  }

  updateDataWithInitialLoad() {
    this.chartDatasets[0].data = this.chartDatasets[0].data.map((num, index) => {
      if(index < Number(this.timeAtStartOfLoad) || index > Number(this.timeAtEndOfLoad)) {
        return Number(this.baseLoad);
      }
      return Number(this.loadAtStart);
    });
  }

  updateChartForCurveType() {
    if(this.curveType === 'analog'|| this.curveType === 'analog2') {
      this.chartDatasets[0].tension = 0.5;
      this.chartDatasets[0].hasOwnProperty('stepped') 
      {
        delete this.chartDatasets[0].stepped;
      }
    }
    else {
      this.chartDatasets[0].tension = 0;
      this.chartDatasets[0].stepped = "after";
    }
    this.chartOptions.plugins.title.text = this.curveType.charAt(0).toUpperCase()+this.curveType.slice(1)+' Load Curve';
  }

  updateHighestPointOfLoad() {
    let highestPointTime = Number(this.timeAthighestPointOfLoad);
    const highestPointLoad = Number(this.highestPointOfLoad);

    this.chartDatasets[0].data[highestPointTime++] = highestPointLoad;
    if(this.curveType === 'digital' && highestPointTime < this.chartDatasets[0].data.length) 
    {
      this.chartDatasets[0].data[highestPointTime] = highestPointLoad;
    }

    if(this.curveType === 'analog2' && Number(this.timeAtLowestPointOfLoad) >= 0) {
      this.chartDatasets[0].data[Number(this.timeAtLowestPointOfLoad)] = Number(this.lowestPointOfLoad);
    }
  }

  onClickGenerateChart() {

    this.updateDataWithInitialLoad();
    this.updateHighestPointOfLoad();    
    this.updateChartForCurveType();

    if(this.myChart != null) {
      this.myChart.destroy();
    }

    this.myChart = new Chart(this.lineChartCanvas?.nativeElement, this.createChartConfig());
}

  onClickGenerateDefaultChart() {
    this.highestPointOfLoad = '1500';
    this.timeAthighestPointOfLoad = '11';
    this.lowestPointOfLoad = '1000';
    this.timeAtLowestPointOfLoad = '14';
    this.baseLoad = '200';
    this.loadAtStart = '800';
    this.timeAtStartOfLoad = '6';
    this.timeAtEndOfLoad = '17';

    this.onClickGenerateChart();
  }

  createChartConfig(): any {
    return {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: this.chartDatasets
      },
      options: this.chartOptions
    };
  }

  onReset() {
    this.myChart.destroy();

    this.highestPointOfLoad = '';
    this.timeAthighestPointOfLoad = '';
    this.lowestPointOfLoad = '';
    this.timeAtLowestPointOfLoad = '';
    this.baseLoad = '';
    this.loadAtStart = '';
    this.timeAtStartOfLoad = '';
    this.timeAtEndOfLoad = '';
    this.curveType = 'Analog';
  }
}
