"use client"; // Mark as client component

import { useContext, useEffect, useState } from "react";
import ChessSquare from "./ChessSquare";
import { AuthContext } from "@/provider/AuthProvider";
import { useParams } from "next/navigation";
import { getDatabase, ref, onValue, remove, set } from "firebase/database";
//  initialboard
const initialBoard = async () => {
  // const [board, setBoard] = useState([]);
  const { id } = useParams();

  const { getData, user, resetEmail } = useContext(AuthContext);

  const x = resetEmail(`${user?.email}`);
  const y = resetEmail(`${id.split("%40").join("@")}`);
  const boardData = await getData(`chess/${y}_${x}`);
  // console.log("boardData", boardData);

  return boardData;
  // // ---------------
  // let boardData;
  // async function xyz(p1, p2) {
  //   console.log(p1, p2);
  //   const boardData = await getData(`chess/${p2}_${p1}`);
  //   console.log("boardData", boardData);

  //   return boardData;
  // }
  //  xyz (x,y).then((data) => {
  //   console.log(data)
  //  })

  // // useEffect(() => {
  // //   (async () => {
  // //     setBoard(await xyz(x, y));
  // //   })();
  // // }, [boardData]);
  // return await xyz(x, y).then((data) => data[0]?.board);
  // // console.log(boardData);
  // // console.log(board[0]?.board);
  // return board[0]?.board;
  // if (1) {
  //   const board = Array(8)
  //     .fill()
  //     .map(() => Array(8).fill(null));
  //   // console.log(board);

  //   // Set up pawns
  //   for (let i = 0; i < 8; i++) {
  //     board[1][i] = { type: "pawn", color: "black" };
  //     board[6][i] = { type: "pawn", color: "white" };
  //   }

  //   // Set up other pieces
  //   const pieces = [
  //     ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"],

  //     ["rook", "knight", "bishop", "king", "queen", "bishop", "knight", "rook"], // Corrected queen/king positions
  //   ];

  //   for (let i = 0; i < 8; i++) {
  //     board[0][i] = { type: pieces[0][i], color: "black" };
  //     board[7][i] = { type: pieces[1][i], color: "white" };
  //   }

  //   return board;
  // } else {
  // }
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
// check or checkmate detected ---------------------------------------------

// Helper function to find the king's position
const findKing = (board, color) => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece?.type === "king" && piece.color === color) {
        return { row, col };
      }
    }
  }
  throw new Error("King not found on board");
};

// Check if a square is under attack
const isSquareUnderAttack = (position, board, currentPlayer) => {
  const enemyColor = currentPlayer === "white" ? "black" : "white";

  // Check all enemy pieces
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece || piece.color !== enemyColor) continue;

      const from = { row, col };

      // Special handling for pawn attacks
      if (piece.type === "pawn") {
        const dir = enemyColor === "white" ? -1 : 1;
        if (position.row === row + dir && Math.abs(position.col - col) === 1) {
          return true;
        }
        continue;
      }

      // Check other pieces using their move validation
      switch (piece.type) {
        case "knight":
          if (isValidKnightMove(from, position, board, enemyColor)) return true;
          break;
        case "bishop":
          if (isValidBishopMove(from, position, board, enemyColor)) return true;
          break;
        case "rook":
          if (isValidRookMove(from, position, board, enemyColor)) return true;
          break;
        case "queen":
          if (isValidQueenMove(from, position, board, enemyColor)) return true;
          break;
        case "king":
          if (
            Math.abs(row - position.row) <= 1 &&
            Math.abs(col - position.col) <= 1
          )
            return true;
          break;
      }
    }
  }
  return false;
};

// Check if king is in check
const isKingInCheck = (board, currentPlayer) => {
  const kingPos = findKing(board, currentPlayer);
  return isSquareUnderAttack(kingPos, board, currentPlayer);
};

// Check if checkmate
const isCheckmate = (board, currentPlayer) => {
  if (!isKingInCheck(board, currentPlayer)) return false;

  // Check if king can move to any safe square
  const kingPos = findKing(board, currentPlayer);
  for (let row = kingPos.row - 1; row <= kingPos.row + 1; row++) {
    for (let col = kingPos.col - 1; col <= kingPos.col + 1; col++) {
      if (row < 0 || row > 7 || col < 0 || col > 7) continue;
      if (row === kingPos.row && col === kingPos.col) continue;

      // Simulate move
      const tempBoard = JSON.parse(JSON.stringify(board));
      tempBoard[kingPos.row][kingPos.col] = null;
      tempBoard[row][col] = { type: "king", color: currentPlayer };

      if (!isSquareUnderAttack({ row, col }, tempBoard, currentPlayer)) {
        return false;
      }
    }
  }

  // Find all attackers
  const attackers = [];
  const enemyColor = currentPlayer === "white" ? "black" : "white";
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (
        piece?.color === enemyColor &&
        isValidMoveForPiece({ row, col }, kingPos, board, enemyColor)
      ) {
        attackers.push({ row, col });
      }
    }
  }

  // If multiple attackers, only king can move
  if (attackers.length > 1) return true;

  // Check if attack can be blocked or captured
  const attacker = attackers[0];
  const attackerType = board[attacker.row][attacker.col].type;

  // Can attacker be captured?
  if (canBeCaptured(attacker, board, currentPlayer)) return false;

  // Can attack path be blocked?
  if (["rook", "bishop", "queen"].includes(attackerType)) {
    const path = getAttackPath(kingPos, attacker);
    for (const square of path) {
      if (canBeBlocked(square, board, currentPlayer)) return false;
    }
  }

  return true;
};

const getAttackPath = (kingPos, attackerPos) => {
  const path = [];
  const rowStep = Math.sign(attackerPos.row - kingPos.row);
  const colStep = Math.sign(attackerPos.col - kingPos.col);

  let currentRow = kingPos.row + rowStep;
  let currentCol = kingPos.col + colStep;

  while (currentRow !== attackerPos.row || currentCol !== attackerPos.col) {
    path.push({ row: currentRow, col: currentCol });
    currentRow += rowStep;
    currentCol += colStep;
  }
  return path;
};

const canBeCaptured = (target, board, currentPlayer) => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece?.color === currentPlayer) {
        const from = { row, col };
        if (isValidMoveForPiece(from, target, board, currentPlayer)) {
          // Simulate the capture and check king safety
          const tempBoard = JSON.parse(JSON.stringify(board));
          tempBoard[target.row][target.col] = { ...piece };
          tempBoard[row][col] = null;
          if (!isKingInCheck(tempBoard, currentPlayer)) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

const canBeBlocked = (blockSquare, board, currentPlayer) => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece?.color === currentPlayer && piece.type !== "king") {
        const from = { row, col };
        if (isValidMoveForPiece(from, blockSquare, board, currentPlayer)) {
          // Simulate the block and check king safety
          const tempBoard = JSON.parse(JSON.stringify(board));
          tempBoard[blockSquare.row][blockSquare.col] = { ...piece };
          tempBoard[row][col] = null;
          if (!isKingInCheck(tempBoard, currentPlayer)) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

const isValidMoveForPiece = (from, to, board, color) => {
  const piece = board[from.row][from.col];
  if (!piece) return false;
  switch (piece.type) {
    case "pawn":
      return isValidPawnMove(from, to, board, color);
    case "knight":
      return isValidKnightMove(from, to, board, color);
    case "bishop":
      return isValidBishopMove(from, to, board, color);
    case "rook":
      return isValidRookMove(from, to, board, color);
    case "queen":
      return isValidQueenMove(from, to, board, color);
    case "king":
      return isValidKingMove(from, to, board, color);
    default:
      return false;
  }
};

export default function ChessBoard() {
  const { id } = useParams(); //mynser email set korte hobe

  const [board, setBoard] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState("white");
  const { getData, user, resetEmail, postData } = useContext(AuthContext);
  const xxx = resetEmail(`${user?.email}`);
  const yyy = resetEmail(id.split("%40").join("@"));
  console.log(yyy);
  let x, y;
  if (yyy.slice(-5) === "ADMIN") {
    y = yyy;
    x = xxx;
  } else {
    y = xxx + "ADMIN";
    x = yyy;
  }
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        // const xxx = resetEmail(`${user?.email}`);
        // const yyy = resetEmail(id.split("%40").join("@"));
        // let x, y;
        // if (yyy.slice(-5) === "ADMIN") {
        //   y = yyy;
        //   x = xxx;
        // } else {
        //   y = xxx + "ADMIN";
        //   x = yyy;
        // }

        const boardData = await getData(`chess/${x}_${y}`);
        console.log("boardData", boardData);
        // Update state with boardData here

        const aa = boardData[0]?.board?.map((item) => (item == 0 ? 0 : item));
        setBoard(aa);
        setCurrentPlayer(boardData[0]?.currentPlayer);
        console.log(aa);
      } catch (error) {
        console.error("Error fetching board:", error);
      }
    };
    fetchBoard();
  }, [user]);

  useEffect(() => {
    // const x = resetEmail(`${user?.email}`);
    // const y = resetEmail(id.split("%40").join("@"));

    const db = getDatabase(); // Initialize Firebase database
    const boardRef = ref(db, `chess/${x}_${y}`); // Reference to the board path

    // Listen for changes in the database
    onValue(boardRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        console.log(entries);
        if (entries.length > 0) {
          setCurrentPlayer(entries[0]?.currentPlayer);
          setBoard(entries[0]?.board); // Update the board state with the new data
        } else {
          console.warn("No entries found in the data.");
        }
      } else {
        console.warn("Snapshot data is undefined.");
      }
    });

    // Fetch initial board data

    // Cleanup listener on unmount
    return () => {
      // You may need to detach the listener if necessary
    };
  }, [user, x, y]);

  const handleSquareClick = (row, col) => {
    if (!selectedSquare && board[row][col]?.color === currentPlayer) {
      setSelectedSquare({ row, col });
      return;
    }

    if (selectedSquare) {
      if (selectedSquare.row === row && selectedSquare.col === col) {
        setSelectedSquare(null);
        return;
      }

      if (board[row][col]?.color === currentPlayer) {
        setSelectedSquare({ row, col });
        return;
      }

      const from = selectedSquare;
      const to = { row, col };
      const piece = board[from.row][from.col];
      let isValidMove = false;

      switch (piece.type) {
        case "pawn":
          isValidMove = isValidPawnMove(from, to, board, currentPlayer);
          break;
        case "rook":
          isValidMove = isValidRookMove(from, to, board, currentPlayer);
          break;
        case "knight":
          isValidMove = isValidKnightMove(from, to, board, currentPlayer);
          break;
        case "bishop":
          isValidMove = isValidBishopMove(from, to, board, currentPlayer);
          break;
        case "king":
          isValidMove = isValidKingMove(from, to, board, currentPlayer);
          break;
        case "queen":
          isValidMove = isValidQueenMove(from, to, board, currentPlayer);
          break;
        default:
          break;
      }

      if (isValidMove) {
        const newBoard = [...board.map((row) => [...row])];
        newBoard[to.row][to.col] = newBoard[from.row][from.col];
        // newBoard[from.row][from.col] = null;
        newBoard[from.row][from.col] = 0;

        // Check if move leaves current player's king in check
        if (isKingInCheck(newBoard, currentPlayer)) {
          alert("Cannot move into check!");
          return;
        }

        // setBoard(newBoard);

        setSelectedSquare(null);

        // Check opponent's status
        const opponent = currentPlayer === "white" ? "black" : "white";
        if (isKingInCheck(newBoard, opponent)) {
          alert("Check!");
          if (isCheckmate(newBoard, opponent)) {
            alert("Checkmate!");
          }
        }

        // setCurrentPlayer(opponent);

        const x = resetEmail(`${user?.email}`);
        const y = resetEmail(id.split("%40").join("@"));
        const db = getDatabase();
        const dataRef = ref(db, `chess/${x}_${y}`);
        remove(dataRef);

        postData(`chess/${x}_${y}`, {
          board: newBoard,
          currentPlayer: opponent,
        });
      }
    }
  };
  // console.log(board);
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
        {board?.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <ChessSquare
              key={`${rowIndex}-${colIndex}`}
              piece={piece == 0 ? null : piece}
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
