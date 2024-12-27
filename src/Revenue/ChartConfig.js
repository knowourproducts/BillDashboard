import { Chart as ChartJS } from 'chart.js';
import { BarController, CategoryScale, LinearScale, Title } from 'chart.js';

// Register required scales and controllers
ChartJS.register(BarController, CategoryScale, LinearScale, Title);

const chartConfig = {
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
  },
};

export default chartConfig;
