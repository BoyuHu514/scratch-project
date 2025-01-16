/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import '../styles/tabs.css';
import ExerciseList from './exerciseList';
import ExerciseStatistics from './ExerciseStatistics';
import MedicationsList from './medicationsList';

export default function Tabs() {
  const [active, setActive] = useState('tab-1');

  const handleClick = (event) => {
    setActive(event.target.id);
  };

  return (
    <div>
      <div className='container'>
        <div className='tabs'>
          <button
            className={`tab-button ${active === 'tab-1' ? 'active' : ''}`}
            id='tab-1'
            onClick={handleClick}
          >
            Exercises
          </button>
          <button
            className={`tab-button ${active === 'tab-2' ? 'active' : ''}`}
            id='tab-2'
            onClick={handleClick}
          >
            Medications
          </button>
          <button
            className={`tab-button ${active === 'tab-3' ? 'active' : ''}`}
            id='tab-3'
            onClick={handleClick}
          >
            User Statistics
          </button>
        </div>
        <div className='tabs-content'>
          <div className={`tab-page ${active === 'tab-1' ? 'active' : ''}`}>
            <ExerciseList />
          </div>
          <div className={`tab-page ${active === 'tab-2' ? 'active' : ''}`}>
            <MedicationsList />
          </div>

          <div className={`tab-page ${active === 'tab-3' ? 'active' : ''}`}>
            <h2>User Statistics</h2>
            <ExerciseStatistics />
            <p>
              View your overall health statistics and analyze trends over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
