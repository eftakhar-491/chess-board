export const getValidMoves = (board, piece, fromRow, fromCol, enPassantTarget, castlingAvailability) => {
  const validMoves = [];
  const color = piece.color;
  const opponentColor = color === 'white' ? 'black' : 'white';
  
  switch (piece.type) {
      case 'pawn':
          const direction = color === 'white' ? -1 : 1;
          const startRow = color === 'white' ? 6 : 1;
          
          // Forward moves
          if (!board[fromRow + direction][fromCol]) {
              validMoves.push({ row: fromRow + direction, col: fromCol });
              
              // Double move from starting position
              if (fromRow === startRow && !board[fromRow + 2 * direction][fromCol]) {
                  validMoves.push({ row: fromRow + 2 * direction, col: fromCol });
              }
          }
          
          // Captures
          for (const colOffset of [-1, 1]) {
              const captureCol = fromCol + colOffset;
              if (captureCol >= 0 && captureCol <= 7) {
                  const captureRow = fromRow + direction;
                  
                  // Normal capture
                  if (board[captureRow][captureCol]?.color === opponentColor) {
                      validMoves.push({ row: captureRow, col: captureCol });
                  }
                  
                  // En passant
                  if (enPassantTarget && 
                      captureRow === enPassantTarget.row && 
                      captureCol === enPassantTarget.col) {
                      validMoves.push({ 
                          row: captureRow, 
                          col: captureCol,
                          isEnPassant: true 
                      });
                  }
              }
          }
          break;

      case 'knight':
          const knightMoves = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
          for (const [rowOffset, colOffset] of knightMoves) {
              const targetRow = fromRow + rowOffset;
              const targetCol = fromCol + colOffset;
              
              if (targetRow >= 0 && targetRow < 8 && targetCol >= 0 && targetCol < 8) {
                  const targetPiece = board[targetRow][targetCol];
                  if (!targetPiece || targetPiece.color === opponentColor) {
                      validMoves.push({ row: targetRow, col: targetCol });
                  }
              }
          }
          break;

      case 'bishop':
          const bishopDirections = [[1,1],[1,-1],[-1,1],[-1,-1]];
          slidingMoves(board, fromRow, fromCol, bishopDirections, color, validMoves);
          break;

      case 'rook':
          const rookDirections = [[1,0],[-1,0],[0,1],[0,-1]];
          slidingMoves(board, fromRow, fromCol, rookDirections, color, validMoves);
          break;

      case 'queen':
          const queenDirections = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
          slidingMoves(board, fromRow, fromCol, queenDirections, color, validMoves);
          break;

      case 'king':
          // Normal moves
          const kingMoves = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
          for (const [rowOffset, colOffset] of kingMoves) {
              const targetRow = fromRow + rowOffset;
              const targetCol = fromCol + colOffset;
              
              if (targetRow >= 0 && targetRow < 8 && targetCol >= 0 && targetCol < 8) {
                  const targetPiece = board[targetRow][targetCol];
                  if (!targetPiece || targetPiece.color === opponentColor) {
                      validMoves.push({ row: targetRow, col: targetCol });
                  }
              }
          }
          
          // Castling
          if (!piece.hasMoved) {
              // Kingside
              if (castlingAvailability[color].kingside && 
                  !board[fromRow][5] && !board[fromRow][6] &&
                  board[fromRow][7]?.type === 'rook' && !board[fromRow][7].hasMoved) {
                  validMoves.push({
                      row: fromRow,
                      col: 6,
                      isCastle: true,
                      rookFrom: { row: fromRow, col: 7 },
                      rookTo: { row: fromRow, col: 5 }
                  });
              }
              
              // Queenside
              if (castlingAvailability[color].queenside && 
                  !board[fromRow][1] && !board[fromRow][2] && !board[fromRow][3] &&
                  board[fromRow][0]?.type === 'rook' && !board[fromRow][0].hasMoved) {
                  validMoves.push({
                      row: fromRow,
                      col: 2,
                      isCastle: true,
                      rookFrom: { row: fromRow, col: 0 },
                      rookTo: { row: fromRow, col: 3 }
                  });
              }
          }
          break;
  }
  
  return validMoves;
};

// Helper function for sliding pieces (rook, bishop, queen)
const slidingMoves = (board, fromRow, fromCol, directions, color, validMoves) => {
  const opponentColor = color === 'white' ? 'black' : 'white';
  
  for (const [rowDir, colDir] of directions) {
      for (let i = 1; i < 8; i++) {
          const targetRow = fromRow + i * rowDir;
          const targetCol = fromCol + i * colDir;
          
          if (targetRow < 0 || targetRow > 7 || targetCol < 0 || targetCol > 7) break;
          
          const targetPiece = board[targetRow][targetCol];
          if (!targetPiece) {
              validMoves.push({ row: targetRow, col: targetCol });
          } else {
              if (targetPiece.color === opponentColor) {
                  validMoves.push({ row: targetRow, col: targetCol });
              }
              break;
          }
      }
  }
};

export const isSquareUnderAttack = (board, row, col, attackingColor) => {
  // Check pawn attacks
  const pawnDirection = attackingColor === 'white' ? -1 : 1;
  for (const colOffset of [-1, 1]) {
      const pawnRow = row - pawnDirection;
      const pawnCol = col + colOffset;
      if (pawnRow >= 0 && pawnRow < 8 && pawnCol >= 0 && pawnCol < 8) {
          const piece = board[pawnRow][pawnCol];
          if (piece?.type === 'pawn' && piece.color === attackingColor) {
              return true;
          }
      }
  }

  // Check knight attacks
  const knightMoves = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
  for (const [r, c] of knightMoves) {
      const knightRow = row + r;
      const knightCol = col + c;
      if (knightRow >= 0 && knightRow < 8 && knightCol >= 0 && knightCol < 8) {
          const piece = board[knightRow][knightCol];
          if (piece?.type === 'knight' && piece.color === attackingColor) {
              return true;
          }
      }
  }

  // Check sliding pieces (rook, bishop, queen, king)
  const directions = [
      [1,0],[-1,0],[0,1],[0,-1],  // Rook/queen
      [1,1],[1,-1],[-1,1],[-1,-1]   // Bishop/queen
  ];
  
  for (const [dr, dc] of directions) {
      for (let i = 1; i < 8; i++) {
          const targetRow = row + i * dr;
          const targetCol = col + i * dc;
          
          if (targetRow < 0 || targetRow > 7 || targetCol < 0 || targetCol > 7) break;
          
          const piece = board[targetRow][targetCol];
          if (!piece) continue;
          
          if (piece.color === attackingColor) {
              // King check (only adjacent squares)
              if (i === 1 && piece.type === 'king') return true;
              
              // Other pieces
              if ((dr === 0 || dc === 0) && (piece.type === 'rook' || piece.type === 'queen')) {
                  return true;
              }
              if ((dr !== 0 && dc !== 0) && (piece.type === 'bishop' || piece.type === 'queen')) {
                  return true;
              }
          }
          break;
      }
  }

  return false;
};

export const filterValidMoves = (board, piece, fromRow, fromCol, currentPlayer, enPassantTarget, castlingAvailability) => {
  const allMoves = getValidMoves(board, piece, fromRow, fromCol, enPassantTarget, castlingAvailability);
  const validMoves = [];
  const opponentColor = currentPlayer === 'white' ? 'black' : 'white';
  
  for (const move of allMoves) {
      const tempBoard = JSON.parse(JSON.stringify(board));
      
      // Execute the move
      tempBoard[move.row][move.col] = tempBoard[fromRow][fromCol];
      tempBoard[fromRow][fromCol] = null;
      
      // Handle special moves
      if (move.isEnPassant) {
          tempBoard[fromRow][move.col] = null; // Remove captured pawn
      } else if (move.isCastle) {
          // Move the rook
          tempBoard[move.rookTo.row][move.rookTo.col] = tempBoard[move.rookFrom.row][move.rookFrom.col];
          tempBoard[move.rookFrom.row][move.rookFrom.col] = null;
      }
      
      // Find king position (might have moved)
      let kingPos = null;
      if (piece.type === 'king') {
          kingPos = { row: move.row, col: move.col };
      } else {
          kingPos = findKingPosition(tempBoard, currentPlayer);
      }
      
      if (kingPos && !isSquareUnderAttack(tempBoard, kingPos.row, kingPos.col, opponentColor)) {
          validMoves.push(move);
      }
  }
  
  return validMoves;
};

const findKingPosition = (board, color) => {
  for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
          const piece = board[row][col];
          if (piece?.type === 'king' && piece.color === color) {
              return { row, col };
          }
      }
  }
  return null;
};

export const isInCheck = (board, color) => {
  const kingPos = findKingPosition(board, color);
  if (!kingPos) return false;
  return isSquareUnderAttack(board, kingPos.row, kingPos.col, color === 'white' ? 'black' : 'white');
};

export const isCheckmate = (board, color) => {
  if (!isInCheck(board, color)) return false;
  
  // Check if any move can get out of check
  for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
          const piece = board[row][col];
          if (piece?.color === color) {
              const moves = filterValidMoves(
                  board, 
                  piece, 
                  row, 
                  col, 
                  color,
                  null, // enPassantTarget
                  { white: { kingside: true, queenside: true }, black: { kingside: true, queenside: true } }
              );
              if (moves.length > 0) return false;
          }
      }
  }
  
  return true;
};

export const isStalemate = (board, color) => {
  if (isInCheck(board, color)) return false;
  
  // Check if any legal move exists
  for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
          const piece = board[row][col];
          if (piece?.color === color) {
              const moves = filterValidMoves(
                  board, 
                  piece, 
                  row, 
                  col, 
                  color,
                  null, // enPassantTarget
                  { white: { kingside: true, queenside: true }, black: { kingside: true, queenside: true } }
              );
              if (moves.length > 0) return false;
          }
      }
  }
  
  return true;
};