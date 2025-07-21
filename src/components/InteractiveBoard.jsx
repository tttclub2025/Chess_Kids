import React, { useState, useEffect, useMemo } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

export default function InteractiveBoard({ pgn, onPuzzleComplete }) {
  const game = useMemo(() => new Chess(), []);

  const pgnMoves = useMemo(() => {
    const tempGame = new Chess();
    if (!pgn || !tempGame.loadPgn(pgn)) return [];
    return tempGame.history();
  }, [pgn]);

  const [fen, setFen] = useState("start");
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

  // --- CÁC STATE MỚI CHO VIỆC NHẤN-CHỌN ---
  const [selectedSquare, setSelectedSquare] = useState(""); // Lưu ô đang được chọn
  const [optionSquares, setOptionSquares] = useState({}); // Lưu các ô gợi ý nước đi

  // Reset bàn cờ khi có PGN mới
  useEffect(() => {
    game.reset();
    setFen(game.fen());
    setCurrentMoveIndex(0);
    setSelectedSquare("");
    setOptionSquares({});
  }, [pgn, game]);

  // Hàm xử lý việc di chuyển quân cờ (dùng cho cả kéo-thả và nhấn-chọn)
  function handleMoveAttempt(source, target) {
    if (currentMoveIndex >= pgnMoves.length) return false;

    const expectedMove = pgnMoves[currentMoveIndex];
    const gameCopy = new Chess(game.fen());
    const moveAttempt = gameCopy.move({
      from: source,
      to: target,
      promotion: "q",
    });

    if (moveAttempt === null) return false;

    if (moveAttempt.san === expectedMove) {
      game.move(moveAttempt.san);
      setFen(game.fen());
      setCurrentMoveIndex((prev) => prev + 1);

      setTimeout(() => makeNextComputerMove(), 500);
      return true;
    }

    return false;
  }

  // Hàm để máy tự đi
  function makeNextComputerMove() {
    if (currentMoveIndex >= pgnMoves.length) {
      if (onPuzzleComplete) onPuzzleComplete();
      return;
    }
    const nextMove = pgnMoves[currentMoveIndex];
    game.move(nextMove);
    setFen(game.fen());
    setCurrentMoveIndex((prev) => prev + 1);
  }

  // === LOGIC CHO CHẾ ĐỘ KÉO-THẢ ===
  function onPieceDrop(sourceSquare, targetSquare) {
    const success = handleMoveAttempt(sourceSquare, targetSquare);
    // Luôn reset lựa chọn sau khi thả quân
    setSelectedSquare("");
    setOptionSquares({});
    return success;
  }

  // === LOGIC CHO CHẾ ĐỘ NHẤN-CHỌN ===
  function onSquareClick(square) {
    // Nếu chưa chọn quân cờ nào
    if (!selectedSquare) {
      const piece = game.get(square);
      // Nếu ô có quân cờ và đến lượt quân đó đi
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        highlightPossibleMoves(square);
      }
      return;
    }

    // Nếu đã chọn một quân cờ -> đây là nước đi tới ô đích
    const success = handleMoveAttempt(selectedSquare, square);

    // Nếu đi sai, và người dùng nhấn vào một ô khác có quân cờ của mình
    // thì chuyển lựa chọn sang quân cờ mới đó
    if (!success) {
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        highlightPossibleMoves(square);
      } else {
        // Nếu không thì hủy lựa chọn
        setSelectedSquare("");
        setOptionSquares({});
      }
    } else {
      // Nếu đi đúng thì hủy lựa chọn
      setSelectedSquare("");
      setOptionSquares({});
    }
  }

  // Hàm để hiển thị gợi ý các nước đi
  function highlightPossibleMoves(square) {
    const moves = game.moves({
      square: square,
      verbose: true,
    });

    if (moves.length === 0) {
      return;
    }

    const newOptions = {};
    moves.forEach((move) => {
      newOptions[move.to] = {
        background: "rgba(255, 255, 0, 0.4)", // Màu vàng cho ô có thể đi
        borderRadius: "50%",
      };
    });
    // Thêm màu cho chính ô đang chọn
    newOptions[square] = { background: "rgba(20, 85, 30, 0.4)" };

    setOptionSquares(newOptions);
  }

  return (
    <div className="interactive-board">
      <Chessboard
        position={fen}
        onPieceDrop={onPieceDrop}
        onSquareClick={onSquareClick} // Thêm sự kiện nhấn vào ô
        customSquareStyles={{
          // Prop để hiển thị gợi ý
          ...optionSquares,
        }}
        boardWidth={Math.min(window.innerWidth - 40, 560)}
      />
    </div>
  );
}
