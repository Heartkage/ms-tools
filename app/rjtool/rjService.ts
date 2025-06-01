import { Room } from './rjModel';
import { RJRepository, FirestoreOperationError } from './rjRepository';
import { Unsubscribe } from 'firebase/firestore';

// Service class
export class RJService {
  private static instance: RJService;
  private repository: RJRepository;

  private constructor() {
    this.repository = RJRepository.getInstance();
  }

  public static getInstance(): RJService {
    if (!RJService.instance) {
      RJService.instance = new RJService();
    }
    return RJService.instance;
  }

  // Create a new room
  async createRoom(): Promise<Room> {
    try {
      // Generate a random 6-digit room ID
      const generateRoomId = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
      };

      let roomId = generateRoomId();
      let room = await this.repository.findById(roomId);
      let attempts = 1;
      const MAX_ATTEMPTS = 5;

      // Case 2 & 3: Room exists
      while (room !== null && attempts < MAX_ATTEMPTS) {
        // If room exists but is expired, findById will have deleted it and returned null
        // If room exists and is not expired, generate a new ID and check again
        roomId = generateRoomId();
        room = await this.repository.findById(roomId);
        if (room !== null) attempts++;
      }

      if (attempts >= MAX_ATTEMPTS) {
        throw new Error('Failed to create room after 5 attempts. Please try again.');
      }

      // Case 1: Room doesn't exist (or was expired and deleted)
      return await this.repository.create(roomId);
    } catch (error) {
      throw new FirestoreOperationError('Failed to create room', error);
    }
  }

  // Join an existing room
  async joinRoom(roomId: string): Promise<Room> {
    try {
      const room = await this.repository.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }
      return room;
    } catch (error) {
      if (error instanceof FirestoreOperationError) {
        console.error(`Error joining room (${error.operation}):`, error);
        throw new Error(`Failed to join room: ${error.message}`);
      }
      console.error('Error joining room:', error);
      throw error;
    }
  }

  // Update room state
  async updateRoom(roomId: string, updates: Partial<Room>): Promise<Room> {
    try {
      return await this.repository.update(roomId, updates);
    } catch (error) {
      if (error instanceof FirestoreOperationError) {
        console.error(`Error updating room (${error.operation}):`, error);
        throw new Error(`Failed to update room: ${error.message}`);
      }
      console.error('Error updating room:', error);
      throw error;
    }
  }

  // Subscribe to room updates
  subscribeToRoom(roomId: string, callback: (room: Room) => void): Unsubscribe {
    try {
      return this.repository.subscribeToRoom(roomId, callback);
    } catch (error) {
      if (error instanceof FirestoreOperationError) {
        console.error(`Error subscribing to room (${error.operation}):`, error);
        throw new Error(`Failed to subscribe to room updates: ${error.message}`);
      }
      console.error('Error subscribing to room:', error);
      throw error;
    }
  }
} 