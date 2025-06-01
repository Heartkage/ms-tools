// Constants
export const ROWS = 10;
export const COLS = 4;

// Types
export interface PlayerData {
  selectedToggles: number[];  // 1D array of length 10
  unwantedCells: number[];    // 1D array of length 10
}

export interface Room {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  player1: PlayerData;
  player2: PlayerData;
  player3: PlayerData;
  player4: PlayerData;
}

// Validation functions
export const validateRoomId = (id: string): boolean => {
  return /^\d{6}$/.test(id);
};

const validatePlayerData = (data: PlayerData): boolean => {
  return (
    Array.isArray(data.selectedToggles) &&
    data.selectedToggles.length === ROWS &&
    data.selectedToggles.every(cell => typeof cell === 'number' && cell >= 0 && cell <= 4) &&
    Array.isArray(data.unwantedCells) &&
    data.unwantedCells.length === ROWS &&
    data.unwantedCells.every(cell => typeof cell === 'number' && cell >= 0 && cell <= 15)
  );
};

export const validateRoom = (room: Room): boolean => {
  return (
    validateRoomId(room.id) &&
    room.createdAt instanceof Date &&
    room.updatedAt instanceof Date &&
    validatePlayerData(room.player1) &&
    validatePlayerData(room.player2) &&
    validatePlayerData(room.player3) &&
    validatePlayerData(room.player4)
  );
}; 