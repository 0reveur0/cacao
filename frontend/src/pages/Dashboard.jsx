
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const WelcomeMessage = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  color: var(--primary-color);
`;

const Section = styled.section`
  background-color: var(--soft-ui-color);
  padding: 2rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  box-shadow: 0 8px 25px rgba(0,0,0,0.05);
`;

const SectionTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  color: var(--primary-color);
  border-bottom: 2px solid var(--accent-color);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  margin-top: 0;
`;

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TaskItem = styled.li`
  background-color: var(--background-color);
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  color: var(--secondary-color);
`;

const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const CourseCard = styled(Link)`
  background: linear-gradient(145deg, var(--soft-ui-color), var(--background-color));
  border-radius: 20px;
  padding: 2rem;
  text-decoration: none;
  color: var(--primary-color);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(74, 44, 42, 0.2);
  }
`;

const CourseTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  margin-top: 0;
`;

const CourseDescription = styled.p`
  color: var(--secondary-color);
`;

const Dashboard = ({ user }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/courses', {
          headers: { 'x-auth-token': token },
        });
        if (!response.ok) {
          throw new Error('Could not fetch courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <DashboardContainer>
      <Header>
        <WelcomeMessage>Welcome, {user?.email}</WelcomeMessage>
      </Header>

      <Section>
        <SectionTitle>Today's Brew</SectionTitle>
        <TaskList>
          <TaskItem>Review Chapter 3 of Artisan Coffee Making</TaskItem>
          <TaskItem>Submit profile video for Latte Art 101</TaskItem>
          <TaskItem>Join the 'Study Lounge' discussion at 4 PM</TaskItem>
        </TaskList>
      </Section>

      <Section>
        <SectionTitle>Learning Menu</SectionTitle>
        <CourseGrid>
          {courses.map((course) => (
            <CourseCard key={course.id} to={`/course/${course.id}`}>
              <CourseTitle>{course.name}</CourseTitle>
              <CourseDescription>{course.description}</CourseDescription>
            </CourseCard>
          ))}
        </CourseGrid>
      </Section>

      <Section>
        <SectionTitle>Study Lounge</SectionTitle>
        <p>A place for discussions and collaboration. Coming soon!</p>
      </Section>

      <Section>
        <SectionTitle>Assignments Tray</SectionTitle>
        <p>All your assignments in one place. Coming soon!</p>
      </Section>

      <Section>
        <SectionTitle>Cacao Notes</SectionTitle>
        <p>Your personal notebook. Coming soon!</p>
      </Section>

    </DashboardContainer>
  );
};

export default Dashboard;
