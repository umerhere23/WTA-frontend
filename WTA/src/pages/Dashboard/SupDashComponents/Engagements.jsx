import React, { useEffect, useState } from 'react';
import request from '../../../../api/request';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Engagements = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [engagements, setEngagements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEngagements = async () => {
      setLoading(true);
      try {
        const response = await request({ url: `/supervisors/sup/${user?.id}`, method: 'GET' });
        setEngagements(response.data || []);
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch engagements';
        toast.error(message);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchEngagements();
    }
  }, [user?.id, token]);

  return (
    <div>
      <ToastContainer />
      <h2>Engagements</h2>
      {loading ? (
        <p>Loading engagements...</p>
      ) : engagements.length > 0 ? (
        <ul>
          {engagements.map((engagement) => (
            <li key={engagement?.EngagementID}>
              <h3>Engagement ID: {engagement?.EngagementID}</h3>
              <p>Employee Name: {engagement?.Employee?.FullName}</p>
              <p>Job Title: {engagement?.JobTitle?.Title}</p>
              <p>Department: {engagement?.Department?.DepartmentName}</p>
              <p>Supervisor: {engagement?.Supervisor?.FullName}</p>
              <p>Status: {engagement?.Status}</p>
              <p>Start Date: {engagement?.StartDate}</p>
              <p>End Date: {engagement?.EndDate}</p>
              <p>Supervisor Email: {engagement?.Supervisor?.Email}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No engagements found.</p>
      )}
    </div>
  );
};

export default Engagements;
