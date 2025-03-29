'use client'; // Mark as client component

import { useState } from 'react';
import ChessSquare from './ChessSquare';



//  initialboard 
const initialBoard = () => {
  const board = Array(8).fill().map(() => Array(8).fill(null));
  console.log(board);
  
  // Set up pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: 'pawn', color: 'black' };
    board[6][i] = { type: 'pawn', color: 'white' };
  }
  
  // Set up other pieces
  const pieces = [
    ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
    ['rook', 'knight', 'bishop', 'king', 'queen', 'bishop', 'knight', 'rook'] // Corrected queen/king positions
  ];
  
  for (let i = 0; i < 8; i++) {
    board[0][i] = { type: pieces[0][i], color: 'black' };
    board[7][i] = { type: pieces[1][i], color: 'white' };
  }
  
  return board;
};

export default function ChessBoard() {
  const [board, setBoard] = useState(initialBoard());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('white');

  const handleSquareClick = (row, col) => {
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
      
      // Move the piece (very basic movement logic - you'll want to expand this)
      const newBoard = [...board.map(row => [...row])];
      newBoard[row][col] = newBoard[selectedSquare.row][selectedSquare.col];
      newBoard[selectedSquare.row][selectedSquare.col] = null;
      setBoard(newBoard);
      setSelectedSquare(null);
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-xl font-bold mb-4">
        Current Player: <span className={currentPlayer === 'white' ? 'text-white' : 'text-black'}>{currentPlayer}</span>
      </div>
      <div className="grid grid-cols-8 border-2 border-gray-800">
        {board.map((row, rowIndex) => (
          row.map((piece, colIndex) => (
            <ChessSquare
              key={`${rowIndex}-${colIndex}`}
              piece={piece}
              isSelected={selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
              isBlack={(rowIndex + colIndex) % 2 === 1}
            />
          ))
        ))}
      </div>
    </div>
  );
}