import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const ProjectsByUser = () => {
  const { userData } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!userData || !userData.userId || !userData.role) {
        setError('Please log in to view projects.');
        setLoading(false);
        return;
      }

      let endpoint = '';
      if (userData.role === 'admin') {
        endpoint = 'http://localhost:3007/project/';
      } else {
        endpoint = `http://localhost:3007/project/user/${userData.userId}`;
      }

      try {
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Projects</h2>
      <ul>
        {projects.map(p => (
          <li key={p.projectId}>{p.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsByUser;
