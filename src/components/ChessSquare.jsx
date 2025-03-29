'use client';

const pieceSymbols = {
  pawn: { white: '♙', black: '♟' },
  rook: { white: '♖', black: '♜' },
  knight: { white: '♘', black: '♞' },
  bishop: { white: '♗', black: '♝' },
  queen: { white: '♕', black: '♛' },
  king: { white: '♔', black: '♚' }
};

export default function ChessSquare({ piece, isSelected, isValidMove, onClick, isBlack }) {
  return (
    <div
      className={`w-16 h-16 flex items-center justify-center text-4xl cursor-pointer
        ${isBlack ? 'bg-gray-600' : 'bg-gray-300'}
        ${isSelected ? 'ring-4 ring-yellow-400' : ''}
        ${isValidMove ? (piece ? 'bg-red-300' : 'bg-green-300') : ''}
      `}
      onClick={onClick}
    >
      {piece && (
        <span className={piece.color === 'white' ? 'text-white' : 'text-black'}>
          {pieceSymbols[piece.type][piece.color]}
        </span>
      )}
      {isValidMove && !piece && (
        <div className="w-4 h-4 rounded-full bg-green-500 opacity-70"></div>
      )}
    </div>
  );
}