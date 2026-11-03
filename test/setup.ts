import { vi, type Mock } from 'vitest';
import type { LovelaceCard } from '../src/types.js';
import type { LovelaceHelpers } from '../src/tankerkoenig-card.js';

// A class, since the card constructs it with `new`.
class ResizeObserverMock {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock);
// Mock for window.customCards
if (typeof window !== 'undefined') {
  window.customCards = [];
}

// Mock for Home Assistant helpers
interface TestWindow extends Window {
  loadCardHelpers: Mock<() => Promise<LovelaceHelpers>>;
}

const testWindow = window as unknown as TestWindow;
testWindow.loadCardHelpers = vi.fn().mockResolvedValue({
  createCardElement: vi.fn().mockResolvedValue({
    constructor: { getConfigElement: vi.fn().mockResolvedValue(undefined) },
  } as unknown as LovelaceCard),
});
