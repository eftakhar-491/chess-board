"use client"; // Mark as client component

import { useState } from "react";
import ChessSquare from "./ChessSquare";

//  initialboard
const initialBoard = () => {
  const board = Array(8)
    .fill()
    .map(() => Array(8).fill(null));
  // console.log(board);

  // Set up pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: "pawn", color: "black" };
    board[6][i] = { type: "pawn", color: "white" };
  }

  // Set up other pieces
  const pieces = [
    ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"],

    ["rook", "knight", "bishop", "king", "queen", "bishop", "knight", "rook"], // Corrected queen/king positions
  ];

  for (let i = 0; i < 8; i++) {
    board[0][i] = { type: pieces[0][i], color: "black" };
    board[7][i] = { type: pieces[1][i], color: "white" };
  }

  return board;
};

const isValidPawnMove = (from, to, board, currentPlayer) => {
  const direction = currentPlayer === "white" ? -1 : 1;
  const startRow = currentPlayer === "white" ? 6 : 1;

  // Normal move (1 square forward)
  if (
    to.row === from.row + direction &&
    to.col === from.col &&
    !board[to.row][to.col]
  ) {
    return true;
  }

  // Double move (2 squares from starting position)
  if (
    from.row === startRow &&
    to.row === from.row + 2 * direction &&
    to.col === from.col &&
    !board[to.row][to.col] &&
    !board[from.row + direction][to.col]
  ) {
    return true;
  }

  // Capture move (diagonal enemy piece)
  if (
    to.row === from.row + direction &&
    Math.abs(to.col - from.col) === 1 &&
    board[to.row][to.col]?.color && // Ensure target is occupied
    board[to.row][to.col].color !== currentPlayer
  ) {
    return true;
  }

  // En passant logic requires additional game state tracking
  // (Would need last move info and pawn position)

  return false;
};
const isValidRookMove = (from, to, board, currentPlayer) => {
  // Must stay in the same row OR column
  if (from.row !== to.row && from.col !== to.col) return false;

  // Can't capture your own pieces
  const targetPiece = board[to.row][to.col];
  if (targetPiece && targetPiece.color === currentPlayer) return false;

  // Check clear path for horizontal moves
  if (from.row === to.row) {
    const minCol = Math.min(from.col, to.col);
    const maxCol = Math.max(from.col, to.col);

    for (let col = minCol + 1; col < maxCol; col++) {
      if (board[from.row][col]) return false;
    }
  }
  // Check clear path for vertical moves
  else {
    const minRow = Math.min(from.row, to.row);
    const maxRow = Math.max(from.row, to.row);

    for (let row = minRow + 1; row < maxRow; row++) {
      if (board[row][from.col]) return false;
    }
  }

  return true;
};
const isValidKnightMove = (from, to, board, currentPlayer) => {
  // Calculate row and column differences
  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);

  // Knight moves in L-shape: (2 squares in one direction + 1 perpendicular)
  if (!((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2))) {
    return false;
  }

  // Check if destination contains own piece
  const targetPiece = board[to.row][to.col];
  if (targetPiece && targetPiece.color === currentPlayer) {
    return false;
  }

  // Knights jump over other pieces - no path checking needed
  return true;
};
const isValidBishopMove = (from, to, board, currentPlayer) => {
  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);

  // Bishop must move diagonally (equal row/col changes)
  if (rowDiff !== colDiff) return false;

  // Can't stay in the same square
  if (rowDiff === 0) return false;

  // Check target square for friendly pieces
  const targetPiece = board[to.row][to.col];
  if (targetPiece?.color === currentPlayer) return false;

  // Determine movement direction
  const rowStep = to.row > from.row ? 1 : -1;
  const colStep = to.col > from.col ? 1 : -1;

  // Check clear path (excludes start/end positions)
  for (let i = 1; i < rowDiff; i++) {
    const checkRow = from.row + rowStep * i;
    const checkCol = from.col + colStep * i;
    if (board[checkRow][checkCol]) return false;
  }

  return true;
};
const isValidKingMove = (from, to, board, currentPlayer) => {
  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);

  // Normal king movement (1 square any direction)
  if (rowDiff <= 1 && colDiff <= 1) {
    // Check for friendly fire
    const targetPiece = board[to.row][to.col];
    if (targetPiece?.color === currentPlayer) return false;
    return true;
  }

  // Castling move (2 squares horizontally)
  if (rowDiff === 0 && colDiff === 2) {
    // Determine castling side
    const isKingside = to.col > from.col;
    const rookCol = isKingside ? 7 : 0;

    // Find rook and validate
    const rook = board[from.row][rookCol];
    if (!rook || rook.type !== "rook" || rook.color !== currentPlayer)
      return false;

    // Check clear path between king and rook
    const [start, end] = [
      Math.min(from.col, rookCol) + 1,
      Math.max(from.col, rookCol) - 1,
    ];
    for (let col = start; col <= end; col++) {
      if (board[from.row][col]) return false;
    }

    // Castling is technically valid (actual legality requires additional checks)
    return true;
  }

  return false;
};
const isValidQueenMove = (from, to, board, currentPlayer) => {
  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);

  // Queen must move straight or diagonally
  if (!(rowDiff === colDiff || rowDiff === 0 || colDiff === 0)) {
    return false;
  }

  // Can't capture own pieces
  const targetPiece = board[to.row][to.col];
  if (targetPiece?.color === currentPlayer) return false;

  // Determine movement direction
  const rowStep = Math.sign(to.row - from.row);
  const colStep = Math.sign(to.col - from.col);

  // Check clear path (excludes start/end positions)
  let currentRow = from.row + rowStep;
  let currentCol = from.col + colStep;

  while (currentRow !== to.row || currentCol !== to.col) {
    if (board[currentRow][currentCol]) return false;
    currentRow += rowStep;
    currentCol += colStep;
  }

  return true;
};
export default function ChessBoard() {
  const [board, setBoard] = useState(initialBoard());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState("white");

  const handleSquareClick = (row, col) => {
    console.log(row, col);
    // If no square is selected and the square has a piece of current player's color
    if (!selectedSquare && board[row][col]?.color === currentPlayer) {
      setSelectedSquare({ row, col });
      return;
    }

    // If a square is already selected
    if (selectedSquare) {
      // If clicking on the same square, deselect it
      if (selectedSquare.row === row && selectedSquare.col === col) {
        setSelectedSquare(null);
        return;
      }

      // If clicking on another piece of the same color, select that piece instead
      if (board[row][col]?.color === currentPlayer) {
        setSelectedSquare({ row, col });
        return;
      }

      const from = selectedSquare;
      const to = { row, col };

      // Validate move based on piece type
      const piece = board[from.row][from.col];
      let isValidMove = false;

      if (piece.type === "pawn") {
        isValidMove = isValidPawnMove(from, to, board, currentPlayer);
      }

      if (piece.type === "rook") {
        isValidMove = isValidRookMove(from, to, board, currentPlayer);
      }
      if (piece.type === "knight") {
        isValidMove = isValidKnightMove(from, to, board, currentPlayer);
      }
      if (piece.type === "bishop") {
        isValidMove = isValidBishopMove(from, to, board, currentPlayer);
      }
      if (piece.type === "king") {
        isValidMove = isValidKingMove(from, to, board, currentPlayer);
      }
      if (piece.type === "queen") {
        isValidMove = isValidQueenMove(from, to, board, currentPlayer);
      }

      // Add validation for other pieces here

      if (isValidMove) {
        // Move the piece
        const newBoard = [...board.map((row) => [...row])];
        newBoard[to.row][to.col] = newBoard[from.row][from.col];
        newBoard[from.row][from.col] = null;
        setBoard(newBoard);
        setSelectedSquare(null);
        setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
      }
    }
  };
  console.log(board);
  return (
    <div className="flex flex-col items-center">
      <div className="text-xl font-bold mb-4">
        Current Player:{" "}
        <span
          className={currentPlayer === "white" ? "text-white" : "text-black"}
        >
          {currentPlayer}
        </span>
      </div>
      <div className="grid grid-cols-8 border-2 border-gray-800">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <ChessSquare
              key={`${rowIndex}-${colIndex}`}
              piece={piece}
              isSelected={
                selectedSquare?.row === rowIndex &&
                selectedSquare?.col === colIndex
              }
              onClick={() => handleSquareClick(rowIndex, colIndex)}
              isBlack={(rowIndex + colIndex) % 2 === 1}
            />
          ))
        )}
      </div>
    </div>
  );
}
