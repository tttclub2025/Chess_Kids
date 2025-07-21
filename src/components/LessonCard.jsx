import React from "react";

export default function LessonCard({ lesson, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      <img src={lesson.imageUrl} alt={lesson.title} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{lesson.title}</h3>
        <p className="card-description">{lesson.description}</p>
      </div>
    </div>
  );
}
