import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import config from '../config';
// import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import '../styles/exerciseDetails.css';

const ExerciseDetails = () => {
  const { type } = useParams(); // Get type from route params
  const [exercises, setExercises] = useState([]);
  // const [exerciseType, setExerciseType] = useState(type); // adding this so when forum pops up it doesnt require distance field

  // makes the form visibile or not
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [date, setDate] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  // TO DO
  //alert when deleting an exercise
  // add accept button

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(`${config.baseURL}/exercise/${type}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          console.error('Failed to fetch todos');
        }
        const exercises = await response.json();
        setExercises(exercises);
      } catch (error) {
        console.error(`Error fetching ${type} exercises:`, error);
      }
    };
    fetchExercises();
  }, [type]);

  // Need to create new exercise
  const createNewExercise = async (event) => {
    event.preventDefault();

    if (!date || !duration) {
      alert('Date and duration needs to be filled');
      return;
    }
    try {
      const response = await fetch(`${config.baseURL}/exercise/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          date,
          distance,
          duration,
        }),
      });
      if (!response.ok) {
        console.error('Failed creating new exercise');
      }
      const data = await response.json();
      // update state with the new exercise
      setExercises((prevExercises) => [data.exercise, ...prevExercises]);
      // after we create new exercise we clear the fields and make form invisible.
      setDate('');
      setDistance('');
      setDuration('');
      setIsFormVisible(false); // oonce state is updated we close the form
    } catch (error) {
      console.error(`Error fetching ${type} exercises:`, error);
    }
  };

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div>
      <h1>{type} Exercises</h1>
      <button className='add-button' onClick={toggleForm}>
        Add
      </button>

      {isFormVisible && (
        <div className='form-container'>
          <div className='overlay' onClick={toggleForm}></div>
          <div className='form-content'>
            <form className='add-exercise' onSubmit={createNewExercise}>
              <label>Date: </label>
              <input
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <label> Distance (kms):</label>
              <input
                type='number'
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />
              <label> Duration (mins):</label>
              <input
                type='number'
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <button className='submit-button' type='submit'>
                Submit
              </button>
            </form>
            <button className='close-form' onClick={toggleForm}>
              X
            </button>
          </div>
        </div>
      )}
      <ul>
        {exercises.map((exercise) => (
          <li className='exercise-item' key={exercise._id}>
            <div className='exercise-info'>
              {new Date(exercise.date).toLocaleDateString()} -{' '}
              {exercise.distance || 'N/A'} km, {exercise.duration} mins
            </div>
            <div className='button-container'>
              <button className='update-button'>Update</button>
              <button className='delete-button'>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExerciseDetails;
