import { useParams } from 'react-router-dom';

const Course = () => {
  const { id } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Course Details</h1>
      <p>You are viewing course with ID: {id}</p>
      {/* In a real app, you'd fetch and display the course content here */}
    </div>
  );
};

export default Course;
