const startBtn = document.querySelector('#startBtn');

const adjustFloat = (arrayData) => {
  return arrayData.map((value) => +value.toFixed(4));
}

const getOptimizedData = async () => {
  const url = 'http://localhost:8000/api/optimize';
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.current_best || !data.global_best || !data.epoch) {
      throw new Error('Unexpected API response');
    }

    return data;
  } catch (error) {
    console.error('Error fetching optimized data:', error.message);
    throw error;
  }
}

const setChart = (type = 'line') => {
  return {
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#03CEA4'],
    series: [
      {
        name: name,
        data: []
      },
    ],
    stroke: {
      width: [4, 4]
    },
    plotOptions: {
      bar: {
        columnWidth: '20%'
      }
    },
    xaxis: {
      categories: [],
    },
    noData: {
      text: 'No Data yet'
    }
  }
}

let chartBox1 = new ApexCharts(document.querySelector('#chartBox1'), setChart());
let chartBox2 = new ApexCharts(document.querySelector('#chartBox2'), setChart());

chartBox1.render();
chartBox2.render();

const visualize = async () => {
  try {
    const optimizedData = await getOptimizedData();

    chartBox1.updateSeries([{
      data: adjustFloat(optimizedData.current_best),
    }]);

    chartBox1.updateOptions({
      xaxis: {
        categories: optimizedData.epoch,
      },
    });

    chartBox2.updateSeries([{
      data: adjustFloat(optimizedData.global_best),
    }]);

    chartBox2.updateOptions({
      xaxis: {
        categories: optimizedData.epoch,
      },
    });
  } catch (error) {
    console.log('Error rendering chart:', error.message);
  }
};

startBtn.addEventListener('click', () => {
  visualize();
});