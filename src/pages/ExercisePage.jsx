import React, { useState, useEffect } from "react";
import InteractiveBoard from "../components/InteractiveBoard";

// Thêm prop testPgn
export default function ExercisePage({ exerciseId, testPgn, onBack }) {
  const [exercise, setExercise] = useState(null);
  const [pgnToLoad, setPgnToLoad] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  useEffect(() => {
    // Ưu tiên PGN test nếu nó tồn tại
    if (testPgn) {
      setExercise({ title: "Bài Tập Xem Thử" });
      setPgnToLoad(testPgn);
      setMessage("Bắt đầu bài tập xem thử!");
      setMessageType("info");
    } else if (exerciseId) {
      // Nếu không có PGN test, tải từ file như cũ
      fetch("/api/exercises.json")
        .then((res) => res.json())
        .then((data) => {
          const currentExercise = data.find((ex) => ex.id === exerciseId);
          setExercise(currentExercise);
          setPgnToLoad(currentExercise.pgn);
          setMessage("Bắt đầu! Hãy thực hiện nước đi đúng.");
          setMessageType("info");
        });
    }
  }, [exerciseId, testPgn]);

  const handlePuzzleComplete = () => {
    setMessage("Hoàn thành! Bạn đã giải được câu đố. 🎉");
    setMessageType("end");

    if (exercise && exercise.completionMediaUrl) {
      setTimeout(() => {
        alert(
          `Chúc mừng! Mở ${exercise.mediaType} tại: ${exercise.completionMediaUrl}`
        );
      }, 1000);
    }
  };

  if (!exercise) return <div>Đang tải bài tập...</div>;

  return (
    <div className="exercise-page">
      <button onClick={onBack} className="back-button">
        ❮ Quay lại
      </button>
      <h2>{exercise.title}</h2>

      {/* Chỉ render bàn cờ khi đã có PGN để tải */}
      {pgnToLoad && (
        <InteractiveBoard
          pgn={pgnToLoad}
          onPuzzleComplete={handlePuzzleComplete}
        />
      )}

      <div className={`message ${messageType}`}>{message}</div>
    </div>
  );
}
