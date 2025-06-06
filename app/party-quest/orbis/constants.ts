// Constants for Orbis Party Quest

interface RoomConfig {
  nameKey: string;
  page: string;
  players: number;
  jobs?: string[];
  types?: string[];
  skills?: string[];
}

export const roomConfig: Record<string, RoomConfig> = {
  'onTheWayUp': { 
    nameKey: 'pages.orbisPQ.rooms.onTheWayUp.title', 
    page: 'on-the-way-up',
    players: 2,
    jobs: ['jobs.classes.any']
  },
  'walkway': { 
    nameKey: 'pages.orbisPQ.rooms.walkway.title', 
    page: 'walkway',
    players: 1,
    types: ['jobs.types.weaponAttack', 'jobs.types.aoe']
  },
  'lounge': { 
    nameKey: 'pages.orbisPQ.rooms.lounge.title', 
    page: 'lounge',
    players: 2,
    types: ['jobs.types.weaponAttack', 'jobs.types.magicAttack'],
    skills: ['jobs.skills.haste']
  },
  'storage': { 
    nameKey: 'pages.orbisPQ.rooms.storage.title', 
    page: 'storage',
    players: 1,
    jobs: ['jobs.classes.thief'],
    skills: ['jobs.skills.haste']
  },
  'sealed': { 
    nameKey: 'pages.orbisPQ.rooms.sealed.title', 
    page: 'sealed',
    players: 4,
    jobs: ['jobs.classes.any']
  },
  'garden': { 
    nameKey: 'pages.orbisPQ.rooms.garden.title', 
    page: 'garden',
    players: 6,
    jobs: ['jobs.classes.any'],
    types: ['jobs.types.highDamage']
  },
  'entrance': { 
    nameKey: 'pages.orbisPQ.rooms.entrance.title', 
    page: 'entrance',
    players: 6,
    jobs: ['jobs.classes.any'],
    skills: ['jobs.skills.haste']
  },
  'lobby': { 
    nameKey: 'pages.orbisPQ.rooms.lobby.title', 
    page: 'lobby',
    players: 1,
    jobs: ['jobs.classes.gunslinger', 'jobs.classes.mage'],
    skills: ['jobs.skills.teleport']
  }
}; 