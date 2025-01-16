import React from 'react';

function UpdateExerciseForm({
  date,
  distance,
  duration,
  setDate,
  setDistance,
  setDuration,
  onSubmit,
}) {
  //   console.log('Rendering Form with Date: ', date); //testing
  return (
    <form className='update-exercise' onSubmit={onSubmit}>
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
        Update
      </button>
    </form>
  );
}

export default UpdateExerciseForm;
