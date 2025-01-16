/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import '../styles/medicationsList.css';
import config from '../config';

const MedicationsList = () => {
  const [medications, setMedications] = useState([]);

  const fetchMedications = async () => {
    try {
      const response = await fetch(`${config.baseURL}/medications`); 
      const data = await response.json();
      setMedications(data);
    } catch (error) {
      console.error('Error fetching medications:', error);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  return (
    <div className="medications-list">
      <h1>My Medications</h1>
      <table className="medications-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Purpose</th>
            <th>Dosage</th>
            <th>Frequency</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          {medications.map((med) => (
            <tr key={med._id}>
              <td>{med.medName}</td>
              <td>{med.purpose}</td>
              <td>{med.dosage}</td>
              <td>{med.frequency}</td>
              <td>{new Date(med.startDate).toLocaleDateString()}</td>
              <td>{med.endDate ? new Date(med.endDate).toLocaleDateString() : 'Ongoing'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicationsList;
