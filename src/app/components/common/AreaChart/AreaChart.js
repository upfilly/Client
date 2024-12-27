import React from 'react'
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
Chart.register(...registerables);

const ReportChart = ({areaData}) => {

    const monthNumberToName = (month) => {
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[month - 1];
      };
  const data = {
      labels: areaData && areaData?.headers?.map(header => monthNumberToName(header.month)),
    datasets: [
      {
        label:"Price",
        data: areaData && areaData?.data?.map((item) => item.price),
        background: 'rgb(9,70,121)',
        background: 'linear-gradient(346deg, rgba(9,70,121,1) 0%, rgba(87,78,244,1) 56%, rgba(0,212,255,1) 100%)',
        fill: 'origin',
    },
    ],
};

const options = {
    responsive: true,
    plugins: {
        filler: {
            propagate: true,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};

return (
    <div>
        <Line data={data} options={options} style={{height:"400px", width:"400px"}}/>
    </div>
)
}

export default ReportChart
