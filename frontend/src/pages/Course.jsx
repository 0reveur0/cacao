
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const CourseContainer = styled.div`
  padding: 2rem;
  max-width: 960px;
  margin: 0 auto;
`;

const CourseHeader = styled.div`
  background: var(--soft-ui-color);
  padding: 3rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  text-align: center;
`;

const CourseTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  color: var(--primary-color);
  margin: 0;
`;

const CourseDescription = styled.p`
  color: var(--secondary-color);
  font-size: 1.1rem;
`;

const SectionTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  color: var(--primary-color);
  border-bottom: 2px solid var(--accent-color);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
`;

const AssignmentCard = styled.div`
  background: var(--background-color);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border-left: 5px solid var(--secondary-color);
`;

const AssignmentTitle = styled.h3`
  margin-top: 0;
  color: var(--primary-color);
`;

const Course = ({ user }) => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [courseRes, assignmentsRes] = await Promise.all([
          fetch(`/api/courses/${courseId}`, { headers: { 'x-auth-token': token } }),
          fetch(`/api/assignments/course/${courseId}`, {
            headers: { 'x-auth-token': token },
          }),
        ]);

        if (!courseRes.ok || !assignmentsRes.ok) {
          throw new Error('Could not fetch course data');
        }

        const courseData = await courseRes.json();
        const assignmentsData = await assignmentsRes.json();

        setCourse(courseData);
        setAssignments(assignmentsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourseData();
  }, [courseId]);

  return (
    <CourseContainer>
      {course ? (
        <>
          <CourseHeader>
            <CourseTitle>{course.name}</CourseTitle>
            <CourseDescription>{course.description}</CourseDescription>
          </CourseHeader>

          <SectionTitle>Assignments</SectionTitle>
          
          {assignments.map((assignment) => (
            <AssignmentCard key={assignment.id}>
              <AssignmentTitle>{assignment.title}</AssignmentTitle>
              <p>{assignment.description}</p>
              {/* Further details or submission status */}
            </AssignmentCard>
          ))}
        </>
      ) : (
        <p>Loading course...</p>
      )}
    </CourseContainer>
  );
};

export default Course;
