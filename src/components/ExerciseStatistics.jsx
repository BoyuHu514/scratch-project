import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import config from '../config';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors
} from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, Colors);

//Creates a state variable to store exercises grouped by type
const ExerciseStatistics = () => {
  const [exercisesByType, setExercisesByType] = useState({});
  //Creates state for the chart data with initial empty values
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',  // Running
        'rgba(75, 192, 192, 0.8)',  // Walking
        'rgba(255, 206, 86, 0.8)',  // Cycling
        'rgba(255, 99, 132, 0.8)',  // Swimming
        'rgba(153, 102, 255, 0.8)', // Bodybuilding
        'rgba(255, 159, 64, 0.8)',  // Other
      ]
    }]
  });

  //Uses useEffect to fetch data when component mounts
  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        // Creates an array of promises to fetch data for each exercise type
        const exercisePromises = ['Running', 'Walking', 'Cycling', 'Swimming', 'Bodybuilding', 'Other'].map(async (type) => {
          //Makes API call for each exercise type
          const response = await fetch(`${config.baseURL}/exercise/${type}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            // Authorization: `Bearer ${token}`,
            },
          });
        if (!response.ok) {
          console.error(`Failed to fetch exercises ${type}`);
          return {type, exercises: [] };
        }

        const exercises = await response.json();
        return { type, exercises };
      });
       //Waits for all exercise type requests to complete
        const allExercises = await Promise.all(exercisePromises);
        console.log('All exercises array:', allExercises);

        // Convert array to object for easier access
        const exercisesByTypeMap = allExercises.reduce((acc, { type, exercises }) => {
          if (exercises.length > 0) {
            acc[type] = exercises;
          }
          return acc;
        }, {});
        // Updates the state with processed exercise data
        setExercisesByType(exercisesByTypeMap);

        // Update chart data with exercise counts
        setChartData(prevData => ({
          labels: Object.keys(exercisesByTypeMap),
          datasets: [{
            ...prevData.datasets[0],
            data: Object.values(exercisesByTypeMap).map(exercises => exercises.length)
          }]
        }));

        console.log('Processed exercise data:', exercisesByTypeMap);
      } catch (error) {
        console.error('Error fetching exercise data:', error);
      }
    };

    fetchExerciseData();
  }, []);
  
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          align: 'right',
          labels: {
            padding: 20,
            font: {
              size: 16
            }
          }
        },
        title: {
          display: true,
          text: 'Exercise Distribution',
          font: {
            size: 16
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const type = context.label;
              const exercises = exercisesByType[type] || [];
              const latestExercise = exercises[0];
              
              if (!latestExercise) return `${type}: ${context.formattedValue}`;
  
              const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration, 0);
              const avgDuration = (totalDuration / exercises.length).toFixed(1);
              const date = new Date(latestExercise.date).toLocaleDateString();
              const lines = [
                `${type}: ${exercises.length} exercises`,
              `Average Duration: ${avgDuration} minutes`,
              `Latest on: ${date}`,
              `Total Duration: ${totalDuration} minutes`
              ];
              
              return lines;
            }
          }
        }
      }
    }
  
    return (
      <div className="standard-container">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="w-80 h-80">
            <Doughnut data={chartData} options={options} />
          </div>
        </div>
      </div>
    );
  };
  
  export default ExerciseStatistics;