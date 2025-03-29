export const getValidMoves = (board, piece, fromRow, fromCol) => {
    const validMoves = [];
    
    switch (piece.type) {
      case 'pawn':
        // Pawns move differently based on color
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;
        
        // Move forward one square
        if (board[fromRow + direction]?.[fromCol] === null) {
          validMoves.push({ row: fromRow + direction, col: fromCol });
          
          // Move forward two squares from starting position
          if (fromRow === startRow && board[fromRow + 2 * direction]?.[fromCol] === null) {
            validMoves.push({ row: fromRow + 2 * direction, col: fromCol });
          }
        }
        
        // Capture diagonally
        [-1, 1].forEach(colOffset => {
          const targetRow = fromRow + direction;
          const targetCol = fromCol + colOffset;
          const targetPiece = board[targetRow]?.[targetCol];
          
          if (targetPiece && targetPiece.color !== piece.color) {
            validMoves.push({ row: targetRow, col: targetCol });
          }
        });
        break;
  
      case 'rook':
        // Horizontal and vertical movement
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([rowDir, colDir]) => {
          for (let i = 1; i < 8; i++) {
            const targetRow = fromRow + i * rowDir;
            const targetCol = fromCol + i * colDir;
            
            // Stop if out of bounds
            if (targetRow < 0 || targetRow > 7 || targetCol < 0 || targetCol > 7) break;
            
            const targetPiece = board[targetRow][targetCol];
            
            if (targetPiece === null) {
              validMoves.push({ row: targetRow, col: targetCol });
            } else {
              if (targetPiece.color !== piece.color) {
                validMoves.push({ row: targetRow, col: targetCol });
              }
              break; 
            }
          }
        });
        break;
  
      case 'knight':
        // L-shaped movement
        [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]].forEach(([rowOffset, colOffset]) => {
          const targetRow = fromRow + rowOffset;
          const targetCol = fromCol + colOffset;
          
          if (targetRow >= 0 && targetRow < 8 && targetCol >= 0 && targetCol < 8) {
            const targetPiece = board[targetRow][targetCol];
            if (targetPiece === null || targetPiece.color !== piece.color) {
              validMoves.push({ row: targetRow, col: targetCol });
            }
          }
        });
        break;
  
      case 'bishop':
        // Diagonal movement
        [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([rowDir, colDir]) => {
          for (let i = 1; i < 8; i++) {
            const targetRow = fromRow + i * rowDir;
            const targetCol = fromCol + i * colDir;
            
            // Stop if out of bounds
            if (targetRow < 0 || targetRow > 7 || targetCol < 0 || targetCol > 7) break;
            
            const targetPiece = board[targetRow][targetCol];
            
            if (targetPiece === null) {
              validMoves.push({ row: targetRow, col: targetCol });
            } else {
              if (targetPiece.color !== piece.color) {
                validMoves.push({ row: targetRow, col: targetCol });
              }
              break; 
            }
          }
        });
        break;
  
      case 'queen':
        // Combine rook and bishop movements
        [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([rowDir, colDir]) => {
          for (let i = 1; i < 8; i++) {
            const targetRow = fromRow + i * rowDir;
            const targetCol = fromCol + i * colDir;
            
            // Stop if out of bounds
            if (targetRow < 0 || targetRow > 7 || targetCol < 0 || targetCol > 7) break;
            
            const targetPiece = board[targetRow][targetCol];
            
            if (targetPiece === null) {
              validMoves.push({ row: targetRow, col: targetCol });
            } else {
              if (targetPiece.color !== piece.color) {
                validMoves.push({ row: targetRow, col: targetCol });
              }
              break;
            }
          }
        });
        break;
  
      case 'king':
        // One square in any direction
        [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([rowOffset, colOffset]) => {
          const targetRow = fromRow + rowOffset;
          const targetCol = fromCol + colOffset;
          
          if (targetRow >= 0 && targetRow < 8 && targetCol >= 0 && targetCol < 8) {
            const targetPiece = board[targetRow][targetCol];
            if (targetPiece === null || targetPiece.color !== piece.color) {
              validMoves.push({ row: targetRow, col: targetCol });
            }
          }
        });
        break;
    }
  
    return validMoves;
  };