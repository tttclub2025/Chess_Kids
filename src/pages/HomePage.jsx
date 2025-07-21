import React, { useRef } from "react";
import LessonCard from "../components/LessonCard";

// Thêm prop onTestPgn
export default function HomePage({ onSelectLesson, onTestPgn }) {
  const [lessons, setLessons] = React.useState([]);
  // Dùng useRef để tham chiếu đến input file ẩn
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    fetch("/api/lessons.json")
      .then((res) => res.json())
      .then((data) => setLessons(data));
  }, []);

  // Hàm xử lý khi người dùng chọn file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const pgnContent = e.target.result;
      // Gọi hàm onTestPgn từ App.jsx với nội dung PGN
      onTestPgn(pgnContent);
    };
    reader.readAsText(file);
  };

  // Hàm xử lý khi nhấn nút tải file
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      {/* Nút tải PGN mới */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".pgn"
        onChange={handleFileChange}
      />
      <button
        onClick={handleUploadClick}
        className="back-button"
        style={{ backgroundColor: "#28a745", color: "white" }}
      >
        Tải PGN Thử Nghiệm
      </button>

      <h2>Chọn một bài học để bắt đầu!</h2>
      <div className="card-grid">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onClick={() => onSelectLesson(lesson.id)}
          />
        ))}
      </div>
    </div>
  );
}
