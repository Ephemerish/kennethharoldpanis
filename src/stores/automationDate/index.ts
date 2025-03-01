import { create } from "zustand";
import { StoreState, StoreActions } from "./types";
import { defaultState } from "./defaults";
import createActions from "./actions";

const useAutomationDateStore = create<StoreState & StoreActions>((set) => ({
  ...defaultState,
  ...createActions(set),
}));

export default useAutomationDateStore;
