/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import '../styles/exerciseCard.css';
import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const ExerciseCard = ({ exercise, onMoreInformation }) => {
  const { type, distance, duration, date, caloriesBurned, _id } =
    exercise.latestExercise;
  console.log({ type, distance, duration, date, caloriesBurned, _id });
  const navigate = useNavigate();

  return (
    <Card className='exercise-card'>
      <Card.Body>
        <Card.Title>{type}</Card.Title>
      </Card.Body>
      <ListGroup className='list-group-flush'>
        <ListGroup.Item>
          <strong>Distance:</strong> {distance ? `${distance} km` : 'N/A'}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Duration:</strong> {duration} mins
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Date:</strong> {new Date(date).toLocaleDateString()}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Calories Burned:</strong>{' '}
          {caloriesBurned ? `${caloriesBurned} kcal` : 'N/A'}
        </ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Button
          className='update-btn'
          onClick={() => navigate(`/details/${type}`)}
          style={{ marginRight: '10px' }}
        >
          More Information
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ExerciseCard;
