import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../config';
import '../styles/exerciseDetails.css';
import AddExerciseForm from './addExerciseForm';
import UpdateExerciseForm from './updateExerciseForm';

const ExerciseDetails = () => {
  const { type } = useParams(); // Get type from route params
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);

  // makes the form visible or not
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [date, setDate] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  // create state that updates
  const [exerciseToUpdate, setExerciseToUpdate] = useState(null);
  // checking if we are updating or not
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const token = localStorage.getItem('token');

  // Makes form visible or invisible depending on the action
  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
    setIsUpdateMode(false);
    setExerciseToUpdate(null);
  };

  // Handling click for when it's update. Here it will change update mode to true
  const handleUpdateClick = (exercise) => {
    setExerciseToUpdate(exercise);

    const formattedDate = new Date(exercise.date).toISOString().split('T')[0];
    setDate(formattedDate);
    setDistance(exercise.distance);
    setDuration(exercise.duration);
    setIsUpdateMode(true);
    setIsFormVisible(true);
  };

  // Fetch exercises from the server
  const fetchExercises = async () => {
    try {
      if (!token) {
        console.error('No token found. Redirecting to login.');
        navigate('/login');
        return;
      }

      const response = await fetch(`${config.baseURL}/exercise/${type}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch exercises.');
        return;
      }

      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error(`Error fetching ${type} exercises:`, error);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [type, token, navigate]);

  const createNewExercise = async (event) => {
    event.preventDefault();

    if (!date || !duration) {
      alert('Date and duration need to be filled');
      return;
    }

    try {
      const response = await fetch(`${config.baseURL}/exercise/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, date, distance, duration }),
      });

      if (!response.ok) {
        console.error('Failed creating new exercise');
        return;
      }

      const data = await response.json();
      setExercises((prevExercises) => [data.exercise, ...prevExercises]); // Update state with the new exercise
      setDate('');
      setDistance('');
      setDuration('');
      setIsFormVisible(false); // Once state is updated we close the form
    } catch (error) {
      console.error(`Error creating ${type} exercise:`, error);
    }
  };

  const updateExercise = async (event) => {
    event.preventDefault();

    if (!date || !duration) {
      alert('Date and duration need to be filled');
      return;
    }

    try {
      const response = await fetch(
        `${config.baseURL}/exercise/${exerciseToUpdate._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type,
            date,
            distance,
            duration,
          }),
        }
      );

      if (!response.ok) {
        console.error('Failed updating exercise');
        return;
      }

      // Fetch the latest data after update
      await fetchExercises();

      // Clear form and close it
      setDate('');
      setDistance('');
      setDuration('');
      setIsFormVisible(false);
      setIsUpdateMode(false);
    } catch (error) {
      console.error(`Error updating ${type} exercise:`, error);
    }
  };

  const deleteExercise = async (exerciseId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this exercise?'
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${config.baseURL}/exercise/${exerciseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Failed deleting exercise');
        return;
      }

      setExercises((prevExercises) =>
        prevExercises.filter((exercise) => exercise._id !== exerciseId)
      );
    } catch (error) {
      console.error(`Error deleting ${type} exercise:`, error);
    }
  };

  return (
    <div>
      <header className='exercise-header'>
        <h1 className='exercise-title'>{type} Exercises</h1>
        <button className='add-button' onClick={toggleForm}>
          Add
        </button>
      </header>
      {isFormVisible && (
        <div className='form-container'>
          <div className='overlay' onClick={toggleForm}></div>
          <div className='form-content'>
            {isUpdateMode ? (
              <UpdateExerciseForm
                date={date}
                distance={distance}
                duration={duration}
                setDate={setDate}
                setDistance={setDistance}
                setDuration={setDuration}
                onSubmit={updateExercise}
              />
            ) : (
              <AddExerciseForm
                date={date}
                distance={distance}
                duration={duration}
                setDate={setDate}
                setDistance={setDistance}
                setDuration={setDuration}
                onSubmit={createNewExercise}
              />
            )}
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
              <button
                className='update-button'
                onClick={() => handleUpdateClick(exercise)}
              >
                Update
              </button>
              <button
                className='delete-button'
                onClick={() => deleteExercise(exercise._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExerciseDetails;
