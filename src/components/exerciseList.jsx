/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import config from '../config';
import { useNavigate } from 'react-router-dom';
import ExerciseCard from './exerciseCard';
import '../styles/exerciseList.css';

const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);
  const fetchExercise = async () => {
    // //getting token
    // const token = localStorage.getItem('token');
    console.log('in fetch data');
    try {
      const response = await fetch(`${config.baseURL}/exercise`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          //   Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        console.error('Failed to fetch todos');
      }
      const exercises = await response.json();
      setExercises(exercises);
      console.log(exercises);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchExercise();
  }, []);

  return (
    <div className="standard-container">
      <h1>My Exercises</h1>
      <div className='card-container'>
        {exercises.map((exercise) => (
          <ExerciseCard
            className='card'
            key={exercise._id}
            exercise={exercise}
          />
        ))}
      </div>
    </div>
  );
};

export default ExerciseList;
