'use client';

import React, { useState, useRef, KeyboardEvent, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RJService } from './rjService'
import { Room, ROWS, COLS } from './rjModel'
import { useLanguage } from '../../contexts/LanguageContext'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import BackToHome from '../../components/BackToHome'
import { copyToClipboard } from '../../lib/utils/clipboard'

// User colors for the 4 players
const USER_COLORS = {
  1: { 
    name: 'pages.rjtool.colors.red',
    bg: 'bg-red-600', 
    hover: 'hover:bg-red-700', 
    text: 'text-red-200',
    inactive: 'bg-red-600/50',
    gradient: 'from-red-600'
  },
  2: { 
    name: 'pages.rjtool.colors.blue',
    bg: 'bg-blue-600', 
    hover: 'hover:bg-blue-700', 
    text: 'text-blue-200',
    inactive: 'bg-blue-600/50',
    gradient: 'from-blue-600'
  },
  3: { 
    name: 'pages.rjtool.colors.yellow',
    bg: 'bg-yellow-600', 
    hover: 'hover:bg-yellow-600', 
    text: 'text-yellow-200',
    inactive: 'bg-yellow-600/50',
    gradient: 'from-yellow-600'
  },
  4: { 
    name: 'pages.rjtool.colors.purple',
    bg: 'bg-purple-600', 
    hover: 'hover:bg-purple-700', 
    text: 'text-purple-200',
    inactive: 'bg-purple-600/50',
    gradient: 'from-purple-600'
  },
};

// Add Alert component
interface AlertProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full border border-gray-700">
        <p className="text-white mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default function RJPQPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorVisible, setErrorVisible] = useState(false);
  // Add alert state
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  let truthTable: number[][] = [];
  const [selectedToggles, setSelectedToggles] = useState<number[][]>(
    Array(10).fill(null).map(() => Array(4).fill(0))
  );
  const [unwantedCells, setUnwantedCells] = useState<number[][]>(
    Array(10).fill(null).map(() => Array(4).fill(0))
  );
  const [currentUser, setCurrentUser] = useState<number | null>(null); // Track current user (1-4) or null if not selected
  const [showCopied, setShowCopied] = useState(false);
  const [showConfirmBack, setShowConfirmBack] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmSwap, setShowConfirmSwap] = useState(false);
  const [swapInfo, setSwapInfo] = useState<{ row: number; col: number } | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const rjService = RJService.getInstance();
  const [room, setRoom] = useState<Room | null>(null);

  // Add alert handler
  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
    setAlertMessage(null);
  };

  // Convert room data to 2D arrays
  const convertRoomToArrays = (roomData: Room): { toggles: number[][], unwanted: number[][] } => {
    // Initialize 2D arrays
    const toggles2D = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    const unwanted2D = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    
    // Process each player's data
    for (let playerNum = 1; playerNum <= 4; playerNum++) {
      const playerData = roomData[`player${playerNum}`];
      
      // Convert player's 1D arrays to 2D
      for (let row = 0; row < ROWS; row++) {
        // Get the column index this player selected for this row
        const selectedCol = playerData.selectedToggles[row];
        if (selectedCol > 0) {  // If player selected a column
          toggles2D[row][selectedCol - 1] = playerNum;
        }
        
        // For unwanted cells, each row has a 4-bit digit representing unwanted columns
        const unwantedBits = playerData.unwantedCells[row];
        for (let col = 0; col < COLS; col++) {
          if ((unwantedBits & (1 << col)) !== 0) {
            unwanted2D[row][col] |= (1 << (playerNum - 1));
          }
        }
      }
    }
    
    return { toggles: toggles2D, unwanted: unwanted2D };
  };

  // Convert 2D arrays back to 1D for storage
  const convertArraysToPlayerData = (toggles2D: number[][], unwanted2D: number[][]): { selectedToggles: number[], unwantedCells: number[] } => {
    const selectedToggles = Array(ROWS).fill(0);
    const unwantedCells = Array(ROWS).fill(0);
    
    // Convert current player's data back to 1D
    for (let row = 0; row < ROWS; row++) {
      // Find which column is selected by current player in this row
      const selectedCol = toggles2D[row].findIndex(toggle => toggle === currentUser);
      selectedToggles[row] = selectedCol === -1 ? 0 : selectedCol + 1; // Convert to 1-based index, or 0 if not found
      
      // Convert unwanted cells for this row
      let unwantedBits = 0;
      for (let col = 0; col < COLS; col++) {
        if ((unwanted2D[row][col] & (1 << (currentUser - 1))) !== 0) {
          unwantedBits |= (1 << col);
        }
      }
      unwantedCells[row] = unwantedBits;
    }
    
    return { selectedToggles, unwantedCells };
  };

  // Helper function to update room data
  const updateRoomData = async (newToggles: number[][], newUnwanted: number[][]) => {
    if (!room || currentUser === null) return;
    
    try {
      const { selectedToggles, unwantedCells } = convertArraysToPlayerData(newToggles, newUnwanted);
      
      // Only update current player's data
      await rjService.updateRoom(room.id, {
        [`player${currentUser}`]: {
          selectedToggles,
          unwantedCells
        }
      });
    } catch (err) {
      showAlert(t('pages.rjtool.errors.roomRemoved'));
      router.push('/rjtool');
    }
  };

  // Helper function to reset all player data
  const resetRoomData = async () => {
    if (!room) return;
    
    try {
      // Create empty player data
      const emptyPlayerData = {
        selectedToggles: Array(ROWS).fill(0),
        unwantedCells: Array(ROWS).fill(0)
      };
      
      // Create empty room data with all players reset
      const emptyRoomData = {
        player1: emptyPlayerData,
        player2: emptyPlayerData,
        player3: emptyPlayerData,
        player4: emptyPlayerData
      };
      
      // Update room with all players reset
      await rjService.updateRoom(room.id, emptyRoomData);
    } catch (err) {
      showAlert(t('pages.rjtool.errors.roomRemoved'));
      router.push('/rjtool');
    }
  };

  const handleReset = async () => {
    if (!room) return;

    const emptyToggles = Array(10).fill(null).map(() => Array(4).fill(0));
    const emptyUnwanted = Array(10).fill(null).map(() => Array(4).fill(0));
    
    setSelectedToggles(emptyToggles);
    setUnwantedCells(emptyUnwanted);
    await resetRoomData();
  };

  // Check if we're in a room
  const roomId = searchParams.get('room');

  // Sync room data
  useEffect(() => {
    if (roomId) {
      let unsubscribe: (() => void) | undefined;

      const setupRoom = async () => {
        try {
          // Reset current user to null (not selected)
          setCurrentUser(null);
          
          // Initial room fetch
          const roomData = await rjService.joinRoom(roomId);
          setRoom(roomData);
          
          // Convert room data to 2D arrays
          const { toggles, unwanted } = convertRoomToArrays(roomData);
          setSelectedToggles(toggles);
          setUnwantedCells(unwanted);

          // Set up real-time listener
          unsubscribe = rjService.subscribeToRoom(roomId, (updatedRoom) => {
            if (!updatedRoom) {
              showAlert(t('pages.rjtool.errors.roomRemoved'));
              router.push('/rjtool');
              return;
            }
            
            setRoom(updatedRoom);
            
            // Convert room data to 2D arrays
            const { toggles, unwanted } = convertRoomToArrays(updatedRoom);
            setSelectedToggles(toggles);
            setUnwantedCells(unwanted);
          });
        } catch (err) {
          showAlert(t('pages.rjtool.errors.roomRemoved'));
          router.push('/rjtool');
        }
      };

      setupRoom();

      // Cleanup subscription on unmount or when roomId changes
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [roomId]);

  // Handle error visibility
  useEffect(() => {
    if (error) {
      setErrorVisible(true);
      const timer = setTimeout(() => {
        setErrorVisible(false);
        setTimeout(() => setError(null), 300); // Remove error after fade out
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleInput = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    // Auto-focus next input
    const total = digits.length - 1;
    if (value) {
      if (index < total) {
        inputRefs.current[index + 1]?.focus();
      } else if (index === total) {
        // Blur focus on last input to minimize keyboard
        inputRefs.current[index]?.blur();
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d*$/.test(pastedData)) return;

    const newDigits = [...digits];
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setDigits(newDigits);
  };

  const handleCreateRoom = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const newRoom = await rjService.createRoom();
      router.push(`/rjtool?room=${newRoom.id}`);
    } catch (err) {
      setError(t('pages.rjtool.errors.createRoomFailed'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const roomId = digits.join('');
      if (roomId.length !== 6) {
        setError(t('pages.rjtool.errors.invalidRoomCode'));
        return;
      }
      const room = await rjService.joinRoom(roomId);
      router.push(`/rjtool?room=${room.id}`);
    } catch (err) {
      setError(t('pages.rjtool.errors.joinRoomFailed'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareRoom = async () => {
    const roomUrl = `${window.location.origin}/rjtool?room=${roomId}`;
    try {
      await copyToClipboard(roomUrl);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  // Helper functions for bit operations
  const isUnwantedByUser = (cellValue: number, user: number): boolean => {
    return (cellValue & (1 << (user - 1))) !== 0;
  };

  const setUnwantedByUser = (cellValue: number, user: number): number => {
    return cellValue | (1 << (user - 1));
  };

  const unsetUnwantedByUser = (cellValue: number, user: number): number => {
    return cellValue & ~(1 << (user - 1));
  };

  const handleMarkUnwanted = async (row: number, col: number) => {
    if (currentUser === null) {
      showAlert(t('pages.rjtool.errors.selectColorFirst'));
      return;
    }

    if (!room) return;

    const newUnwantedCells = [...unwantedCells];
    const currentValue = newUnwantedCells[row][col];
    
    if (isUnwantedByUser(currentValue, currentUser)) {
      // Remove current user from unwanted list
      newUnwantedCells[row][col] = unsetUnwantedByUser(currentValue, currentUser);
    } else {
      // Add current user to unwanted list
      newUnwantedCells[row][col] = setUnwantedByUser(currentValue, currentUser);
    }
    
    setUnwantedCells(newUnwantedCells);
    await updateRoomData(selectedToggles, newUnwantedCells);
  };

  const handleMarkSelected = async (row: number, col: number) => {
    if (!room || currentUser === null) return;
    const currentlySelected = selectedToggles[row][col] === currentUser;
    // Mark the selected cell for current user
    const newToggles = selectedToggles.map((r, rowIndex) => 
      rowIndex === row 
        ? r.map((t, colIndex) => {
            if (colIndex === col) return currentlySelected ? 0 : currentUser;  // Set selected cell to current user
            if (t === currentUser) return 0;          // Clear other selections by current user
            return t;                                 // Preserve other users' selections
          })
        : r
    );
    setSelectedToggles(newToggles);
    await updateRoomData(newToggles, unwantedCells);
  };

  const handleToggle = (row: number, col: number) => {
    if (currentUser === null) {
      showAlert(t('pages.rjtool.errors.selectColorFirst'));
      return;
    }

    // If the cell is unwanted by current user, toggle it back to unselected state
    if (isUnwantedByUser(unwantedCells[row][col], currentUser)) {
      handleMarkUnwanted(row, col);
      return;
    }

    // If the clicked toggle is already selected by current user, deselect it
    if (selectedToggles[row][col] === currentUser) {
      handleMarkSelected(row, col);
      return;
    }

    // If the target spot is selected by another user, show swap confirmation
    if (selectedToggles[row][col] !== 0 && selectedToggles[row][col] !== currentUser) {
      setSwapInfo({ row, col });
      setShowConfirmSwap(true);
      return;
    }

    // If the target spot is empty (0), allow the selection
    if (selectedToggles[row][col] === 0) {      
      // Then set the new selection
      handleMarkSelected(row, col);
      return;
    }
  };

  const handleSwap = async () => {
    if (!swapInfo || !room || currentUser === null) return;

    const { row, col } = swapInfo;
    const otherUser = selectedToggles[row][col];
    
    // Find current user's toggle in this row
    const currentUserCol = selectedToggles[row].findIndex(toggle => toggle === currentUser);
    
    const newToggles = selectedToggles.map((r, rowIndex) => {
      if (rowIndex !== row) return r;
      
      return r.map((t, colIndex) => {
        if (colIndex === col) return currentUser;
        if (colIndex === currentUserCol) return otherUser;
        return t;
      });
    });

    try {
      // Create empty arrays for both players
      const currentUserToggles = Array(ROWS).fill(0);
      const currentUserUnwanted = Array(ROWS).fill(0);
      const otherUserToggles = Array(ROWS).fill(0);
      const otherUserUnwanted = Array(ROWS).fill(0);

      // Convert the new toggle state to player data format for both players
      for (let row = 0; row < ROWS; row++) {
        // Find which column is selected by each user in this row
        const currentUserSelectedCol = newToggles[row].findIndex(toggle => toggle === currentUser);
        const otherUserSelectedCol = newToggles[row].findIndex(toggle => toggle === otherUser);
        
        currentUserToggles[row] = currentUserSelectedCol === -1 ? 0 : currentUserSelectedCol + 1;
        otherUserToggles[row] = otherUserSelectedCol === -1 ? 0 : otherUserSelectedCol + 1;

        // Convert unwanted cells for this row
        let currentUserUnwantedBits = 0;
        let otherUserUnwantedBits = 0;
        for (let col = 0; col < COLS; col++) {
          if ((unwantedCells[row][col] & (1 << (currentUser - 1))) !== 0) {
            currentUserUnwantedBits |= (1 << col);
          }
          if ((unwantedCells[row][col] & (1 << (otherUser - 1))) !== 0) {
            // Remove the unwanted cell for other user in the updated row because it might be wrong
            if (row !== swapInfo.row) {
              otherUserUnwantedBits |= (1 << col);
            }
          }
        }
        currentUserUnwanted[row] = currentUserUnwantedBits;
        otherUserUnwanted[row] = otherUserUnwantedBits;
      }

      // Update both players' data in a single operation
      await rjService.updateRoom(room.id, {
        [`player${currentUser}`]: {
          selectedToggles: currentUserToggles,
          unwantedCells: currentUserUnwanted
        },
        [`player${otherUser}`]: {
          selectedToggles: otherUserToggles,
          unwantedCells: otherUserUnwanted
        }
      });

      setSelectedToggles(newToggles);
      setShowConfirmSwap(false);
      setSwapInfo(null);
    } catch (err) {
      showAlert(t('pages.rjtool.errors.roomRemoved'));
      router.push('/rjtool');
    }
  };

  const handleBack = () => {
    setShowConfirmBack(true);
  };

  const handleConfirmBack = () => {
    router.push('/rjtool');
  };

  const calculateProbability = (row: number, col: number) => {
    const rowToggles = selectedToggles[row];
    // When no one has selected O or X button, do not display any probability
    const selectedCount = rowToggles.filter(toggle => toggle !== 0).length;
    const unwantedUsers = unwantedCells[row];
    if (selectedCount === 0 && unwantedUsers.every(col => col === 0)) return 0;
    
    // Check if current user already has a selection in this row
    const hasSelectionInRow = rowToggles.some(toggle => toggle === currentUser);
    if (hasSelectionInRow) return 0;

    // If the user has marked the cell as unwanted, then the probability is 0
    const isUnwantedCell = isUnwantedByUser(unwantedUsers[col], currentUser);
    if (isUnwantedCell) return 0;

    // Get all possible permutations
    const permutations = getTruthTable();
    
    // Filter permutations based on current row state only
    const validPermutations = permutations.filter(perm => {
      // Check if this permutation is possible given current selections in this row
      for (let c = 0; c < rowToggles.length; c++) {
        const selectedUser = rowToggles[c];
        if (selectedUser !== 0) {
          // If a user has selected this position, check if it matches the permutation
          if (perm[c] !== selectedUser) {
            return false;
          }
        }
      }
      
      // Check if this permutation is possible given unwanted cells in this row
      for (let c = 0; c < unwantedUsers.length; c++) {
        const cellUnwanted = unwantedUsers[c];
        if (cellUnwanted !== 0) {
          // If a position is unwanted by a user, check if the permutation doesn't place that user there
          if (isUnwantedByUser(cellUnwanted, perm[c])) {
            return false;
          }
        }
      }
      
      return true;
    });

    if (validPermutations.length === 0) return 0;

    // Count how many valid permutations have the current user in the target position
    const matchingPermutations = validPermutations.filter(perm => 
      perm[col] === currentUser
    );

    // Calculate probability
    return matchingPermutations.length / validPermutations.length;
  };

  const getTruthTable = () => {
    const generatePermutations = (digits: number[]): number[][] => {
      if (digits.length === 1) {
        return [digits];
      }

      const result: number[][] = [];
      for (let i = 0; i < digits.length; i++) {
        const currentDigit = digits[i];
        const remainingDigits = [...digits.slice(0, i), ...digits.slice(i + 1)];
        const subPermutations = generatePermutations(remainingDigits);
        
        for (const subPerm of subPermutations) {
          result.push([currentDigit, ...subPerm]);
        }
      }
      return result;
    };

    // If the truth table has already been generated, return it
    if (truthTable.length > 0) return truthTable;

    const digits = [1, 2, 3, 4];
    truthTable = generatePermutations(digits);
    return truthTable;
  }

  if (roomId) {
    return (
      <main className="min-h-screen p-4 sm:p-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="relative mb-4">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all transform hover:scale-105 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                {t('pages.rjtool.room.back')}
              </button>

              <button
                onClick={handleShareRoom}
                className={`inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all transform hover:scale-105 active:scale-95 ${
                  showCopied 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                {showCopied ? t('pages.rjtool.room.copied') : t('pages.rjtool.room.share')}
              </button>
            </div>

            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                {t('pages.rjtool.room.title', { id: roomId })}
              </h1>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-2xl mx-auto border border-gray-700">
            {/* Color Legend */}
            <div className="flex justify-center items-center gap-4 mb-8">
              {Object.entries(USER_COLORS).map(([userNum, colors]) => {
                const isCurrentUser = Number(userNum) === currentUser;
                
                return (
                  <button
                    key={userNum}
                    onClick={() => setCurrentUser(Number(userNum))}
                    className={`w-4 sm:w-8 h-4 sm:h-8 rounded-lg transition-all transform ${
                      isCurrentUser ? 'ring-2 ring-white scale-110' : ''
                    } ${isCurrentUser ? colors.bg : colors.inactive} hover:scale-110 cursor-pointer`}
                    title={t('pages.rjtool.room.colorTooltip', { number: userNum })}
                  />
                );
              })}
              <div className="h-8 w-px bg-gray-700 mx-2" />
              <button
                onClick={() => setShowConfirmReset(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-all transform hover:scale-105 active:scale-95"
                title={t('pages.rjtool.room.reset')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                {t('pages.rjtool.room.reset')}
              </button>
            </div>

            <div className="space-y-7 max-w-[280px] mx-auto">
              {selectedToggles.map((row, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-4">
                  <span className="w-8 text-right text-gray-400 font-medium">
                    {10 - rowIndex}
                  </span>
                  <div className="flex gap-2">
                    {row.map((isSelected, colIndex) => {
                      const userNumber = selectedToggles[rowIndex][colIndex];
                      const isCurrentUser = userNumber === currentUser;
                      const colorClass = userNumber 
                        ? USER_COLORS[userNumber as keyof typeof USER_COLORS] 
                        : { bg: 'bg-gray-700', hover: 'hover:bg-gray-600', text: 'text-gray-400' };
                      
                      // Calculate probability for empty spots
                      const probability = userNumber === 0 ? calculateProbability(rowIndex, colIndex) : 0;
                      const probabilityPercent = Math.round(probability * 100);
                      
                      const unwantedUsers = unwantedCells[rowIndex][colIndex];
                      const isUnwanted = isUnwantedByUser(unwantedUsers[colIndex], currentUser);
                      
                      // Check if current user has any selection in this row
                      const hasSelectionInRow = row.some(toggle => toggle === currentUser);
                      
                      return (
                        <div key={colIndex} className="relative">
                          <button
                            onClick={() => handleToggle(rowIndex, colIndex)}
                            className={`w-12 h-8 rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center relative overflow-hidden
                              ${isCurrentUser ? colorClass.bg : colorClass.bg}
                              ${isCurrentUser ? colorClass.hover : colorClass.hover}
                            `}
                          >
                            {userNumber === 0 && probability > 0 && (
                              <div 
                                className={`absolute inset-x-0 bottom-0 ${USER_COLORS[currentUser as keyof typeof USER_COLORS].bg}`}
                                style={{ 
                                  height: `${probabilityPercent}%`,
                                  opacity: 0.3
                                }}
                              />
                            )}
                            {userNumber === 0 && !hasSelectionInRow && isUnwantedByUser(unwantedCells[rowIndex][colIndex], currentUser) && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-red-500 text-xl font-bold">✕</span>
                              </div>
                            )}
                            <span className={`text-sm font-medium ${colorClass.text} relative z-10`}>
                              {colIndex + 1}
                            </span>
                          </button>
                          {userNumber === 0 && !hasSelectionInRow && !isUnwantedByUser(unwantedCells[rowIndex][colIndex], currentUser) && (
                            // Show X button only for last row (index 9) or when previous row is selected
                            (rowIndex === 9 || selectedToggles[rowIndex + 1].some(toggle => toggle === currentUser)) && (
                              <div className="absolute -top-6 left-0 right-0 flex justify-center">
                                <button
                                  onClick={() => handleMarkUnwanted(rowIndex, colIndex)}
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-gray-700 text-gray-400 hover:bg-gray-600 transition-all transform hover:scale-110 active:scale-95"
                                >
                                  ✕
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confirmation Dialogs */}
          {showConfirmBack && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">{t('pages.rjtool.confirmations.leaveRoom.title')}</h3>
                <p className="text-gray-300 mb-6">{t('pages.rjtool.confirmations.leaveRoom.message')}</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowConfirmBack(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                  >
                    {t('pages.rjtool.confirmations.cancel')}
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirmBack(false);
                      handleConfirmBack();
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                  >
                    {t('pages.rjtool.confirmations.leaveRoom.confirm')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showConfirmReset && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">{t('pages.rjtool.confirmations.resetGrid.title')}</h3>
                <p className="text-gray-300 mb-6">{t('pages.rjtool.confirmations.resetGrid.message')}</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                  >
                    {t('pages.rjtool.confirmations.cancel')}
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirmReset(false);
                      handleReset();
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                  >
                    {t('pages.rjtool.confirmations.resetGrid.confirm')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showConfirmSwap && swapInfo && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">{t('pages.rjtool.confirmations.swapCell.title')}</h3>
                <p className="text-gray-300 mb-6">
                  {t('pages.rjtool.confirmations.swapCell.message', { 
                    color: t(USER_COLORS[selectedToggles[swapInfo.row][swapInfo.col] as keyof typeof USER_COLORS].name)
                  })}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowConfirmSwap(false);
                      setSwapInfo(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                  >
                    {t('pages.rjtool.confirmations.cancel')}
                  </button>
                  <button
                    onClick={handleSwap}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                  >
                    {t('pages.rjtool.confirmations.swapCell.confirm')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Alert component */}
      <Alert
        message={alertMessage || ''}
        isVisible={alertVisible}
        onClose={hideAlert}
      />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <BackToHome />
          <LanguageSwitcher />
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 text-white">
          {t('pages.rjtool.title')}
        </h1>

        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md mx-auto border border-gray-700">
          {error && (
            <div 
              className={`mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm transition-opacity duration-300 ${
                errorVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {error}
            </div>
          )}

          {/* Create Room Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
              <span className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-400 text-lg">+</span>
              </span>
              {t('pages.rjtool.createRoom.title')}
            </h2>
            <button 
              onClick={handleCreateRoom}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('pages.rjtool.loading') : t('pages.rjtool.createRoom.button')}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">or</span>
            </div>
          </div>

          {/* Join Room Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <span className="w-8 h-8 bg-green-900 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-400 text-lg">→</span>
                </span>
                {t('pages.rjtool.joinRoom.title')}
              </h2>
              <button
                onClick={() => setDigits(['', '', '', '', '', ''])}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-all transform hover:scale-105 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                {t('pages.rjtool.room.reset')}
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleInput(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    placeholder={t('pages.rjtool.joinRoom.placeholder')}
                    className="w-10 sm:w-12 h-10 sm:h-12 text-center text-xl font-semibold bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  />
                ))}
              </div>
              <button 
                onClick={handleJoinRoom}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('pages.rjtool.loading') : t('pages.rjtool.joinRoom.button')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Alert component */}
      <Alert
        message={alertMessage || ''}
        isVisible={alertVisible}
        onClose={hideAlert}
      />
    </main>
  );
} 