import { createContext, MutableRefObject, ReactNode, useMemo, useReducer, useRef } from "react";
import { OverlayProvider } from "react-aria";
import { Modal, ModalProps } from "src/components/Modal/Modal";
import { SuperDrawer } from "src/components/SuperDrawer/SuperDrawer";
import { ContentStack } from "src/components/SuperDrawer/useSuperDrawer";
import { CheckFn } from "src/types";
import { EmptyRef } from "src/utils/index";

/** The internal state of our Beam context; see useModal and useSuperDrawer for the public APIs. */
export interface BeamContextState {
  modalState: MutableRefObject<ModalProps | undefined>;
  modalCanCloseChecks: MutableRefObject<CheckFn[]>;
  /** The div for ModalBody to portal into; note this can't be a ref b/c Modal hasn't set the ref at the time ModalBody renders. */
  modalBodyDiv: HTMLDivElement;
  /** The div for ModalFooter to portal into. */
  modalFooterDiv: HTMLDivElement;
  /** SuperDrawer contentStack, i.e. the main/non-detail content + 0-N detail contents. */
  drawerContentStack: MutableRefObject<readonly ContentStack[]>;
  /** Checks when closing SuperDrawer, for the main/non-detail drawer content. */
  drawerCanCloseChecks: MutableRefObject<CheckFn[]>;
  /** Checks when closing SuperDrawer Details, a double array to keep per-detail lists. */
  drawerCanCloseDetailsChecks: MutableRefObject<CheckFn[][]>;
}

/** This is only exported internally, for useModal and useSuperDrawer, it's not a public API. */
export const BeamContext = createContext<BeamContextState>({
  modalState: new EmptyRef(),
  modalCanCloseChecks: new EmptyRef(),
  modalBodyDiv: undefined!,
  modalFooterDiv: undefined!,
  drawerContentStack: new EmptyRef(),
  drawerCanCloseChecks: new EmptyRef(),
  drawerCanCloseDetailsChecks: new EmptyRef(),
});

export function BeamProvider({ children }: { children: ReactNode }) {
  // We want the identity of these to be stable, b/c they end up being used as dependencies
  // in both useModal's and useSuperDrawer's return values, which means the end-application's
  // dependencies as well, i.e. things like GridTable rowStyles will memoize on openInDrawer.
  // So we use refs + a tick.
  const [, tick] = useReducer((prev) => prev + 1, 0);
  const modalRef = useRef<ModalProps | undefined>();
  const modalBodyDiv = useMemo(() => document.createElement("div"), []);
  const modalCanCloseChecksRef = useRef<CheckFn[]>([]);
  const modalFooterDiv = useMemo(() => document.createElement("div"), []);
  const drawerContentStackRef = useRef<ContentStack[]>([]);
  const drawerCanCloseChecks = useRef<CheckFn[]>([]);
  const drawerCanCloseDetailsChecks = useRef<CheckFn[][]>([]);

  // We essentially expose the refs, but with our own getters/setters so that we can
  // have the setters call `tick` to re-render this Provider
  const context = useMemo<BeamContextState>(() => {
    return {
      // These two keys need to trigger re-renders on change
      modalState: new PretendRefThatTicks(modalRef, tick),
      drawerContentStack: new PretendRefThatTicks(drawerContentStackRef, tick),
      // The rest we don't need to re-render when these are mutated, so just expose as-is
      modalCanCloseChecks: modalCanCloseChecksRef,
      modalBodyDiv,
      modalFooterDiv,
      drawerCanCloseChecks,
      drawerCanCloseDetailsChecks,
    };
  }, [modalBodyDiv, modalFooterDiv]);

  return (
    <BeamContext.Provider value={{ ...context }}>
      {/* OverlayProvider is required for Modals generated via React-Aria */}
      <OverlayProvider>
        {children}
        {/*If the drawer is open, assume it will show modal content internally. */}
        {modalRef.current && drawerContentStackRef.current.length === 0 && <Modal {...modalRef.current} />}
      </OverlayProvider>
      <SuperDrawer />
    </BeamContext.Provider>
  );
}

/** Looks like a ref, but invokes a re-render on set (w/o changing the setter identity). */
class PretendRefThatTicks<T> implements MutableRefObject<T> {
  constructor(private ref: MutableRefObject<T>, private tick: () => void) {}
  get current(): T {
    return this.ref.current;
  }
  set current(value) {
    this.ref.current = value;
    this.tick();
  }
}
