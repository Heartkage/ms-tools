import { Room, validateRoom, validateRoomId, PlayerData, ROWS } from './rjModel';
import { db } from '../../lib/firebase/firestore';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  Unsubscribe,
  FirestoreError,
  deleteDoc
} from 'firebase/firestore';

// Custom error class for Firestore operations
export class FirestoreOperationError extends Error {
  constructor(
    message: string,
    public readonly operation: 'create' | 'read' | 'update' | 'subscribe',
    public readonly originalError?: FirestoreError
  ) {
    super(message);
    this.name = 'FirestoreOperationError';
  }
}

export class RJRepository {
  private static instance: RJRepository;
  private readonly COLLECTION_NAME = 'rooms';
  private readonly OPERATION_TIMEOUT = 10000; // 10 seconds timeout
  private readonly ROOM_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

  private constructor() {}

  public static getInstance(): RJRepository {
    if (!RJRepository.instance) {
      RJRepository.instance = new RJRepository();
    }
    return RJRepository.instance;
  }

  // Helper function to create a timeout promise
  private createTimeoutPromise(operation: string): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new FirestoreOperationError(
          `Operation timed out after ${this.OPERATION_TIMEOUT}ms`,
          operation as 'create' | 'read' | 'update' | 'subscribe'
        ));
      }, this.OPERATION_TIMEOUT);
    });
  }

  // Helper function to wrap Firestore operations with timeout
  private async withTimeout<T>(
    operation: 'create' | 'read' | 'update' | 'subscribe',
    promise: Promise<T>
  ): Promise<T> {
    try {
      return await Promise.race([
        promise,
        this.createTimeoutPromise(operation)
      ]);
    } catch (error) {
      if (error instanceof FirestoreOperationError) {
        throw error;
      }
      throw new FirestoreOperationError(
        `Firestore ${operation} operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        operation,
        error instanceof FirestoreError ? error : undefined
      );
    }
  }

  // Helper function to convert Firestore data to Room
  private convertFirestoreDataToRoom(data: any): Room {
    if (!data) {
      throw new Error('Invalid room data: data is null or undefined');
    }

    const now = new Date();
    return {
      ...data,
      createdAt: data.createdAt && data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate() 
        : now,
      updatedAt: data.updatedAt && data.updatedAt instanceof Timestamp 
        ? data.updatedAt.toDate() 
        : now
    } as Room;
  }

  // Create empty player data
  private createEmptyPlayerData(): PlayerData {
    return {
      selectedToggles: Array(ROWS).fill(0),
      unwantedCells: Array(ROWS).fill(0)
    };
  }

  // Create a new room
  async create(roomId: string): Promise<Room> {
    const now = new Date();
    const room: Room = {
      id: roomId,
      createdAt: now,
      updatedAt: now,
      player1: this.createEmptyPlayerData(),
      player2: this.createEmptyPlayerData(),
      player3: this.createEmptyPlayerData(),
      player4: this.createEmptyPlayerData()
    };

    if (!validateRoom(room)) {
      throw new Error('Invalid room data');
    }

    // Convert dates to Firestore timestamps
    const roomData = {
      ...room,
      createdAt: now,
      updatedAt: now
    };

    // Save to Firestore with timeout
    await this.withTimeout('create', setDoc(doc(db, this.COLLECTION_NAME, room.id), roomData));
    return room;
  }

  // Find room by ID
  async findById(id: string): Promise<Room | null> {
    if (!validateRoomId(id)) {
      throw new Error('Invalid room ID');
    }

    const docRef = doc(db, this.COLLECTION_NAME, id);
    
    // Get document with timeout
    const docSnap = await this.withTimeout('read', getDoc(docRef));

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    const room = this.convertFirestoreDataToRoom(data);

    // Check if room has expired
    const now = new Date();
    const timeSinceLastUpdate = now.getTime() - room.updatedAt.getTime();
    if (timeSinceLastUpdate > this.ROOM_EXPIRATION_TIME) {
      // Delete expired room
      await this.withTimeout('update', deleteDoc(docRef));
      return null;
    }

    return room;
  }

  // Update room
  async update(id: string, updates: Partial<Room>): Promise<Room> {
    const room = await this.findById(id);
    if (!room) {
      throw new Error('Room not found');
    }

    const updatedRoom = {
      ...room,
      ...updates,
      updatedAt: new Date()
    };

    if (!validateRoom(updatedRoom)) {
      throw new Error('Invalid room data');
    }

    // Convert dates to Firestore timestamps
    const roomData = {
      ...updates,
      updatedAt: new Date()
    };

    // Update in Firestore with timeout
    await this.withTimeout('update', updateDoc(doc(db, this.COLLECTION_NAME, id), roomData));
    return updatedRoom;
  }

  // Subscribe to room updates
  subscribeToRoom(id: string, callback: (room: Room | null) => void): Unsubscribe {
    if (!validateRoomId(id)) {
      throw new Error('Invalid room ID');
    }

    const docRef = doc(db, this.COLLECTION_NAME, id);
    
    // Set up error handling for the subscription
    const unsubscribe = onSnapshot(
      docRef,
      (doc) => {
        if (!doc.exists()) {
          callback(null); // Notify client that room doesn't exist
          unsubscribe(); // Stop listening for updates
          return;
        }

        const data = doc.data();
        const room = this.convertFirestoreDataToRoom(data);
        callback(room);
      },
      (error) => {
        // Handle subscription errors
        console.error('Subscription error:', error);
        callback(null); // Notify client of error
        unsubscribe(); // Stop listening for updates
        throw new FirestoreOperationError(
          'Failed to subscribe to room updates',
          'subscribe',
          error
        );
      }
    );

    return unsubscribe;
  }
} 