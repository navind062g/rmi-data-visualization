import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'rmi-data-visualization';
  @ViewChild('lineChartCanvas') lineChartCanvas: ElementRef | undefined;

  myChart: Chart;
  chartDatasets = [
    {
      data: Array(25).fill(0),
      label: 'Load',
      tension: 0.5,
      stepped: "after"
    }
  ];

  analogChartDatasets =  [
    {
      data: Array(25).fill(0),
      label: 'Load',
      tension: 0.5,
      stepped: "after"
    }
  ];

  digitalChartDatasets = [
    {
      data: Array(25).fill(0),
      label: 'Load',
      tension: 0,
      stepped: "after"
    }
  ];

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
  curveType = '';

  constructor() {}

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
    if(this.curveType === 'digital') 
    {
      this.chartDatasets = this.digitalChartDatasets;
    }
    else {
      this.chartDatasets = this.analogChartDatasets;
    }
    this.chartDatasets[0].data = this.chartDatasets[0].data.map((num, index) => {
      if(index < Number(this.timeAtStartOfLoad) || index > Number(this.timeAtEndOfLoad)) {
        return Number(this.baseLoad);
      }
      return Number(this.loadAtStart);
    });
  }

  updateChartForCurveType() {
    if(this.curveType === 'analog') {
      this.chartDatasets[0].tension = 0.5;
    }
    else {
      this.chartDatasets[0].tension = 0;
    }
  }

  updateHighestPointOfLoad() {
    let highestPointTime = Number(this.timeAthighestPointOfLoad);
    const highestPointLoad = Number(this.highestPointOfLoad);

    this.chartDatasets[0].data[highestPointTime++] = highestPointLoad;
    if(this.curveType === 'digital' && highestPointTime < this.chartDatasets[0].data.length) 
    {
      this.chartDatasets[0].data[highestPointTime] = highestPointLoad;
    }
  }

  onClickGenerateChart() {
    
    this.updateDataWithInitialLoad();
    this.updateHighestPointOfLoad();
    
    //this.chartDatasets[0].data[Number(this.timeAtLowestPointOfLoad)] = Number(this.lowestPointOfLoad);
    
    this.updateChartForCurveType();
    console.log(this.chartOptions);
    this.myChart = new Chart(this.lineChartCanvas?.nativeElement, {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: this.chartDatasets
      },
      options: this.chartOptions
  });
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
}
