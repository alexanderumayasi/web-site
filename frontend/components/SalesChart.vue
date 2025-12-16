<template>
  <div class="relative">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  type?: 'line' | 'bar';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'line'
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const createChart = () => {
  if (!chartCanvas.value || !props.data || props.data.length === 0) return;

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;

  // Prepare data
  const labels = props.data.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString('es-PE', { month: 'short', day: 'numeric' });
  });

  const revenues = props.data.map(item => item.revenue);
  const orders = props.data.map(item => item.orders);

  chartInstance = new Chart(ctx, {
    type: props.type,
    data: {
      labels,
      datasets: [
        {
          label: 'Ventas (S/)',
          data: revenues,
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: props.type === 'line' 
            ? 'rgba(99, 102, 241, 0.1)' 
            : 'rgba(99, 102, 241, 0.8)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgb(99, 102, 241)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function(context) {
              const index = context.dataIndex;
              return [
                `Ventas: S/ ${revenues[index].toFixed(2)}`,
                `Pedidos: ${orders[index]}`
              ];
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false,
          },
          ticks: {
            color: '#6B7280',
            font: {
              size: 12,
            },
            callback: function(value) {
              return 'S/ ' + value;
            }
          }
        },
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            color: '#6B7280',
            font: {
              size: 12,
            }
          }
        }
      }
    }
  });
};

onMounted(() => {
  createChart();
});

watch(() => props.data, () => {
  createChart();
}, { deep: true });

watch(() => props.type, () => {
  createChart();
});
</script>
