import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import LessonPage from "./pages/LessonPage";
import ExercisePage from "./pages/ExercisePage";
import "./styles/main.css";

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  // State mới để lưu PGN được tải lên để thử nghiệm
  const [testPgn, setTestPgn] = useState(null);

  const goToLessonPage = (lessonId) => {
    setTestPgn(null); // Xóa PGN test khi chuyển trang
    setSelectedLessonId(lessonId);
    setPage("lesson");
  };

  const goToExercisePage = (exerciseId) => {
    setTestPgn(null);
    setSelectedExerciseId(exerciseId);
    setPage("exercise");
  };

  // Hàm mới để chuyển sang trang bài tập với PGN từ file tải lên
  const goToTestPage = (pgnString) => {
    setTestPgn(pgnString);
    setSelectedExerciseId(null); // Không có exerciseId khi test
    setPage("exercise");
  };

  const goHome = () => {
    setTestPgn(null);
    setPage("home");
    setSelectedLessonId(null);
    setSelectedExerciseId(null);
  };

  const goToLessonsList = () => {
    setTestPgn(null);
    setPage("lesson");
    setSelectedExerciseId(null);
  };

  const renderPage = () => {
    switch (page) {
      case "exercise":
        // Truyền PGN test hoặc exerciseId vào trang bài tập
        return (
          <ExercisePage
            exerciseId={selectedExerciseId}
            testPgn={testPgn}
            onBack={selectedLessonId ? goToLessonsList : goHome}
          />
        );
      case "lesson":
        return (
          <LessonPage
            lessonId={selectedLessonId}
            onSelectExercise={goToExercisePage}
            onBack={goHome}
          />
        );
      default:
        // Truyền hàm goToTestPage xuống HomePage
        return (
          <HomePage onSelectLesson={goToLessonPage} onTestPgn={goToTestPage} />
        );
    }
  };

  return (
    <div className="app">
      <h1 className="app-header">🎓 Học Viện Cờ Vua Nhí</h1>
      {renderPage()}
    </div>
  );
}
