import React, { useState, useEffect } from "react";
import ExerciseCard from "../components/ExerciseCard";

export default function LessonPage({ lessonId, onSelectExercise, onBack }) {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    fetch("/api/exercises.json")
      .then((res) => res.json())
      .then((data) => {
        setExercises(data.filter((ex) => ex.lesson_id === lessonId));
      });
  }, [lessonId]);

  return (
    <div>
      <button onClick={onBack} className="back-button">
        ❮ Quay lại
      </button>
      <h2>Chọn một bài tập</h2>
      <div className="card-grid">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onClick={() => onSelectExercise(exercise.id)}
          />
        ))}
      </div>
    </div>
  );
}
