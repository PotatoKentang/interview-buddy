import { Audio } from 'expo-av';
import {create} from 'zustand';

type SoundState = {
  sound: Audio.Sound | null;
  setSound: (sound: Audio.Sound | null) => void;
  stopSound: () => void;
};

const useSoundStore = create<SoundState>((set,get) => ({
  sound: null,
  setSound: (sound) => set({ sound }),
  stopSound: async () => {
    if (get().sound) {
      await get().sound?.stopAsync();
    }
    set({ sound: null });
  },
}));

export default useSoundStore;
