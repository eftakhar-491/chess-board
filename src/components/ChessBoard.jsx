'use client';
import { useState } from 'react';
import ChessSquare from './ChessSquare';
import { 
  getValidMoves,
  isInCheck,
  isCheckmate,
  filterValidMoves,
  isStalemate
} from '@/lib/chessRules';

const initialBoard = () => {
  const board = Array(8).fill().map(() => Array(8).fill(null));
  
  // Set up pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: 'pawn', color: 'black' };
    board[6][i] = { type: 'pawn', color: 'white' };
  }
  
  // Set up other pieces
  const pieces = [
    ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
    ['rook', 'knight', 'bishop', 'king', 'queen', 'bishop', 'knight', 'rook']
  ];
  
  for (let i = 0; i < 8; i++) {
    board[0][i] = { type: pieces[0][i], color: 'black', hasMoved: false };
    board[7][i] = { type: pieces[1][i], color: 'white', hasMoved: false };
  }
  
  return board;
};

export default function ChessBoard() {
  const [board, setBoard] = useState(initialBoard());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [gameStatus, setGameStatus] = useState('ongoing');
  const [enPassantTarget, setEnPassantTarget] = useState(null);
  const [castlingAvailability, setCastlingAvailability] = useState({
    white: { kingside: true, queenside: true },
    black: { kingside: true, queenside: true }
  });

  const handleSquareClick = (row, col) => {
    if (gameStatus !== 'ongoing') return;

    // If no square is selected and clicking on current player's piece
    if (!selectedSquare && board[row][col]?.color === currentPlayer) {
      setSelectedSquare({ row, col });
      const moves = filterValidMoves(
        board, 
        board[row][col], 
        row, 
        col, 
        currentPlayer,
        enPassantTarget,
        castlingAvailability
      );
      setValidMoves(moves);
      return;
    }

    // If square is already selected
    if (selectedSquare) {
      // Clicking same square deselects it
      if (selectedSquare.row === row && selectedSquare.col === col) {
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }

      // Check if move is valid
      const move = validMoves.find(m => m.row === row && m.col === col);
      if (move) {
        executeMove(move);
      } else if (board[row][col]?.color === currentPlayer) {
        // Select different piece
        setSelectedSquare({ row, col });
        const moves = filterValidMoves(
          board, 
          board[row][col], 
          row, 
          col, 
          currentPlayer,
          enPassantTarget,
          castlingAvailability
        );
        setValidMoves(moves);
      }
    }
  };

  const executeMove = (move) => {
    const { row: toRow, col: toCol } = move;
    const { row: fromRow, col: fromCol } = selectedSquare;
    const piece = board[fromRow][fromCol];
    
    const newBoard = board.map(r => [...r]);
    const newCastlingAvailability = JSON.parse(JSON.stringify(castlingAvailability));
    let newEnPassantTarget = null;

    // Handle special moves
    if (move.isEnPassant) {
      // Remove the captured pawn
      newBoard[fromRow][toCol] = null;
    } else if (move.isCastle) {
      // Move the rook
      newBoard[move.rookTo.row][move.rookTo.col] = newBoard[move.rookFrom.row][move.rookFrom.col];
      newBoard[move.rookFrom.row][move.rookFrom.col] = null;
    }

    // Move the piece
    newBoard[toRow][toCol] = { ...piece, hasMoved: true };
    newBoard[fromRow][fromCol] = null;

    // Update castling availability
    if (piece.type === 'king') {
      newCastlingAvailability[piece.color] = { kingside: false, queenside: false };
    } else if (piece.type === 'rook') {
      if (fromCol === 0) { // Queenside rook
        newCastlingAvailability[piece.color].queenside = false;
      } else if (fromCol === 7) { // Kingside rook
        newCastlingAvailability[piece.color].kingside = false;
      }
    }

    // Set en passant target if pawn moved two squares
    if (piece.type === 'pawn' && Math.abs(toRow - fromRow) === 2) {
      newEnPassantTarget = { row: fromRow + (toRow - fromRow)/2, col: fromCol };
    }

    // Check for pawn promotion
    if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
      // Auto-promote to queen for simplicity
      newBoard[toRow][toCol].type = 'queen';
    }

    setBoard(newBoard);
    setSelectedSquare(null);
    setValidMoves([]);
    setEnPassantTarget(newEnPassantTarget);
    setCastlingAvailability(newCastlingAvailability);

    // Check game status after move
    const nextPlayer = currentPlayer === 'white' ? 'black' : 'white';
    
    if (isCheckmate(newBoard, nextPlayer)) {
      setGameStatus('checkmate');
    } else if (isStalemate(newBoard, nextPlayer)) {
      setGameStatus('stalemate');
    } else {
      setCurrentPlayer(nextPlayer);
    }
  };

  const resetGame = () => {
    setBoard(initialBoard());
    setSelectedSquare(null);
    setValidMoves([]);
    setCurrentPlayer('white');
    setGameStatus('ongoing');
    setEnPassantTarget(null);
    setCastlingAvailability({
      white: { kingside: true, queenside: true },
      black: { kingside: true, queenside: true }
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-xl font-bold">
        Current Player: <span className={currentPlayer === 'white' ? 'text-white' : 'text-black'}>
          {currentPlayer}
        </span>
        {isInCheck(board, currentPlayer) && (
          <span className="text-red-600 ml-4">CHECK!</span>
        )}
      </div>

      {gameStatus === 'checkmate' && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <strong>Checkmate!</strong> {currentPlayer === 'white' ? 'Black' : 'White'} wins!
        </div>
      )}

      {gameStatus === 'stalemate' && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          <strong>Stalemate!</strong> Game ended in a draw.
        </div>
      )}

      <div className="grid grid-cols-8 border-2 border-gray-800">
        {board.map((row, rowIndex) => (
          row.map((piece, colIndex) => (
            <ChessSquare
              key={`${rowIndex}-${colIndex}`}
              piece={piece}
              isSelected={selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex}
              isValidMove={validMoves.some(move => move.row === rowIndex && move.col === colIndex)}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
              isBlack={(rowIndex + colIndex) % 2 === 1}
            />
          ))
        ))}
      </div>

      {(gameStatus === 'checkmate' || gameStatus === 'stalemate') && (
        <button
          onClick={resetGame}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          New Game
        </button>
      )}
    </div>
  );
}