import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Award } from 'lucide-react';

// কাস্টম প্লাগইন: বারের উপরে ভোটের সংখ্যা দেখানোর জন্য
const datalabelsPlugin = {
  id: 'datalabels',
  afterDatasetsDraw(chart) {
    const { ctx, data, scales: { y } } = chart;
    ctx.save();
    
    data.datasets[0].data.forEach((datapoint, index) => {
      const { x, y: barY, width } = chart.getDatasetMeta(0).data[index].getProps(['x', 'y', 'width']);
      
      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(datapoint.toLocaleString(), x, barY - 5);
    });
  }
};

// কাস্টম প্লাগইন: বারের উপরে পার্টির লোগো দেখানোর জন্য (Rounded)
const logoPlugin = {
    id: 'logoPlugin',
    afterDraw(chart) {
        const { ctx, data } = chart;
        
        chart.getDatasetMeta(0).data.forEach((datapoint, index) => {
            const logo = new Image();
            logo.src = data.datasets[0].logos[index];
            
            logo.onload = () => {
                const bar = chart.getDatasetMeta(0).data[index];
                const x = bar.x;
                const y = bar.y;
                const imageSize = 30;
                const imageX = x - imageSize / 2;
                const imageY = y - 55;

                ctx.save();
                ctx.beginPath();
                ctx.arc(x, imageY + imageSize / 2, imageSize / 2, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();

                ctx.drawImage(logo, imageX, imageY, imageSize, imageSize);
                ctx.restore();
            };
        });
    }
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  datalabelsPlugin,
  logoPlugin
);

// একটি নতুন prop `showChartOnly` যোগ করা হয়েছে
const ResultsChart = ({ results, showChartOnly = false }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!results || results.length === 0) {
    return <p className="text-slate-400 text-center">No voting data available yet.</p>;
  }

  const sortedResults = [...results].sort((a, b) => b.voteCount - a.voteCount);

  const chartData = {
    labels: sortedResults.map(r => r.party),
    datasets: [
      {
        label: 'Total Votes',
        data: sortedResults.map(r => r.voteCount),
        logos: sortedResults.map(r => r.logoUrl),
        backgroundColor: 'rgba(22, 163, 74, 0.5)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 60,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      title: {
        display: true,
        text: 'Live Election Vote Results',
        color: '#e2e8f0',
        font: { size: isMobile ? 18 : 24, weight: 'bold' },
        padding: { top: 10, bottom: 80 }
      },
    },
    scales: {
      x: {
        ticks: { 
            color: '#94a3b8', 
            font: { size: 14, weight: 'bold' },
            display: !isMobile
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { 
            color: '#94a3b8',
            display: !isMobile
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  return (
    <div>
      {/* শুধুমাত্র `showChartOnly` false হলেই কার্ডগুলি দেখাবে */}
      {!showChartOnly && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {sortedResults.map((result, index) => (
            <div 
              key={result._id} 
              className={`rounded-2xl p-5 text-center transition-all duration-300 ${index === 0 ? 'bg-green-500/10 ring-2 ring-green-400' : 'bg-white/5 ring-1 ring-white/10'}`}
            >
              {index === 0 && (
                  <div className="flex items-center justify-center gap-2 mb-3 text-sm font-semibold text-green-300">
                      <Award className="h-5 w-5" />
                      <span>Leading</span>
                  </div>
              )}
              <img 
                src={result.logoUrl}
                alt={`${result.party} Logo`}
                className="w-20 h-20 rounded-full mx-auto object-contain bg-slate-900/50 p-1 ring-2 ring-white/20 mb-3"
              />
              <h4 className="text-lg font-bold text-white">{result.name}</h4>
              <p className="text-slate-400 text-sm mb-3">{result.party}</p>
              <div className="text-3xl font-bold text-white">
                {result.voteCount.toLocaleString()}
              </div>
              <p className="text-xs text-slate-300">Total Votes</p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 backdrop-blur-xl">
          <div style={{ height: '500px' }}>
            <Bar options={chartOptions} data={chartData} />
          </div>
      </div>
    </div>
  );
};

export default ResultsChart;