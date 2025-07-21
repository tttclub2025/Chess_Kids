import React from "react";

export default function ExerciseCard({ exercise, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      <img
        src={exercise.imageUrl}
        alt={exercise.title}
        className="card-image"
      />
      <div className="card-content">
        <h3 className="card-title">{exercise.title}</h3>
      </div>
    </div>
  );
}
