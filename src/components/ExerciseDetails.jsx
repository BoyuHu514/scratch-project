import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import config from '../config';
import '../styles/exerciseDetails.css';
import AddExerciseForm from './addExerciseForm';
import UpdateExerciseForm from './updateExerciseForm';

const ExerciseDetails = () => {
  const { type } = useParams(); // Get type from route params
  const [exercises, setExercises] = useState([]);

  // makes the form visibile or not
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [date, setDate] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  // create state that updates
  const [exerciseToUpdate, setExerciseToUpdate] = useState(null);
  // checking if we are updating or not
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  // makes form visibile or invisible depending on the action you are doing
  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
    setIsUpdateMode(false);
    setExerciseToUpdate(null);
  };

  // handling click for when its update. Here it will change update mode to true
  const handleUpdateClick = (exercise) => {
    setExerciseToUpdate(exercise);

    // console.log('Original Date:', exercise.date);
    const formattedDate = new Date(exercise.date).toISOString().split('T')[0];
    // console.log('Formatted Date for input:', formattedDate);
    setDate(formattedDate);
    setDistance(exercise.distance);
    setDuration(exercise.duration);
    setIsUpdateMode(true);
    setIsFormVisible(true);
  };

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
        // console.log(exercises); /// test
        setExercises(exercises);
      } catch (error) {
        console.error(`Error fetching ${type} exercises:`, error);
      }
    };
    fetchExercises();
  }, [type, exercises]); // needed to add exercises in dependency array in order to show new changes when we update

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
      setIsFormVisible(false); // once state is updated we close the form
    } catch (error) {
      console.error(`Error fetching ${type} exercises:`, error);
    }
  };

  // Update already existing exercise
  const updateExercise = async (event) => {
    event.preventDefault();
    // console.log('Updating Exercise:', { date, distance, duration });
    if (!date || !duration) {
      alert('Date and duration needs to be filled');
      return;
    }

    // use PUT method to our backend
    try {
      const response = await fetch(
        `${config.baseURL}/exercise/${exerciseToUpdate._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
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
      }

      const updatedExercise = await response.json();
      // need to set the exercise
      setExercises((prevExercises) =>
        prevExercises.map((exercise) =>
          exercise._id === exerciseToUpdate._id ? updatedExercise : exercise
        )
      );
      setDate('');
      setDistance('');
      setDuration('');
      setIsFormVisible(false);
      setIsUpdateMode(false);
    } catch (error) {
      console.error(`Error updating ${type} exercises:`, error);
    }
  };

  const deleteExercise = async (exerciseId) => {
    const confirmed = window.confirm(
      'Are you sure you want to do delete this exercise?'
    );

    // if user doesn't confirm then return
    if (!confirmed) return;

    try {
      const response = await fetch(`${config.baseURL}/exercise/${exerciseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('failed deleting exercise');
      }

      setExercises((prevExercises) => {
        return prevExercises.filter((exercise) => exercise._id !== exerciseId);
      });
    } catch (error) {
      console.error('Error in deleting exercise', error);
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
        {exercises.map((exercise, index) => (
          <li className='exercise-item' key={exercise._id || index}>
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
