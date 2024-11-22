import { api, IAPI } from "@/api/api";

const ID_REGEX = /^[a-zA-Z]+(?:\/[a-zA-Z_]+)*$/;

/**
 * @interface
 * Represents an addon with customizable properties and lifecycle methods.
 */
export interface Addon {
  /**
   * A unique identifier for the addon.
   */
  id: string;

  /**
   * The display name of the addon.
   */
  name: string;

  /**
   * A brief description of what the addon does.
   */
  description: string;

  /**
   * The version of the addon, following semantic versioning (e.g., "1.0.0").
   */
  version: string;

  /**
   * The name of the author of the addon.
   */
  author?: string;

  /**
   * A list of flags associated with the addon.
   */
  flags: Flags[];

  /**
   * A function that is called when the addon is enabled.
   */
  onEnabled?: (api: IAPI) => void;

  /**
   * A function that is called when the addon is disabled.
   */
  onDisabled?: (api: IAPI) => void;

  /**
   * A function that is called on each tick of the game loop.
   */
  onTick?: (api: IAPI) => void;

  /**
   * A function that is called when a game event happens.
   */
  onEvent?: (api: IAPI, event: any) => void;
  // TODO: Define the event type when created
}

/**
 * Enum representing addon flags used to specify addon behavior.
 * @enum {number}
 * @property {number} CORE - Indicates that addon is a core addon. This makes the addon required and cannot be disabled.
 * @property {number} ALLOW_DISABLE_IN_GAME - Indicates that addon can be disabled during gameplay.
 * @property {number} REQUIRES_NEW_SAVE - Indicates that addon requires a new save to take effect.
 */
export enum Flags {
  CORE,
  ALLOW_DISABLE_IN_GAME,
  REQUIRES_NEW_SAVE,
}

/**
 * Manages game addons including registration, enabling/disabling, and loading from external sources.
 */
interface IAddonManager {
  /**
   * Registers a new addon with the manager.
   * @param {Addon} addon - The addon to register
   * @throws {Error} If addon ID is invalid or already registered
   */
  register(addon: Addon): void;

  /**
   * Enables an addon by its ID and calls its onEnabled handler.
   * @param {string} addonID - Unique identifier of the addon
   * @throws {Error} If addon is not found
   */
  enable(addonID: string): void;

  /**
   * Disables an addon by its ID and calls its onDisabled handler.
   * @param {string} addonID - Unique identifier of the addon
   * @throws {Error} If addon is not found or is a core addon
   */
  disable(addonID: string): void;

  /**
   * Checks if an addon is currently enabled.
   * @param {string} addonID - Unique identifier of the addon
   * @returns {boolean} True if addon is enabled, false otherwise
   */
  isEnabled(addonID: string): boolean;

  /**
   * Returns an array of all registered addons.
   * @returns {Addon[]} Array of enabled addon objects
   */
  getRegisteredAddons(): Addon[];

  /**
   * Returns an array of all currently enabled addons.
   * @returns {Addon[]} Array of enabled addon objects
   */
  getEnabledAddons(): Addon[];

  /**
   * Loads and registers an addon from a remote URL.
   * @param {string} url - URL pointing to the addon manifest
   * @throws {Error} If URL is invalid or loading fails
   */
  registerFromURL(url: string): void;
}

export class AddonManager implements IAddonManager {
  private addons: Map<string, Addon> = new Map();
  private enabledAddons: Set<string> = new Set();

  register(addon: Addon) {
    if (!ID_REGEX.test(addon.id)) {
      throw new Error(
        `Invalid addon ID: ${addon.id}\nOnly letters and underscores are allowed.`
      );
    }

    this.addons.set(addon.id, addon);
  }

  enable(addonID: string) {
    const mod = this.addons.get(addonID);

    if (!mod) {
      throw new Error(`Addon not found: ${addonID}`);
    }

    this.enabledAddons.add(addonID);
    mod.onEnabled?.(api);
  }

  disable(addonID: string) {
    const mod = this.addons.get(addonID);

    if (!mod) {
      throw new Error(`Addon not found: ${addonID}`);
    }

    this.enabledAddons.delete(addonID);
    mod.onDisabled?.(api);
  }

  isEnabled(addonID: string): boolean {
    return this.enabledAddons.has(addonID);
  }

  getEnabledAddons(): Addon[] {
    return Array.from(this.enabledAddons).map((id) => this.addons.get(id)!);
  }

  getRegisteredAddons(): Addon[] {
    return Array.from(this.addons.values());
  }

  registerFromURL(url: string) {
    throw new Error("Method not implemented.");

    // the idea is to fetch the built javascript for the addon and enable it.
    // The built js would be something like the base addon - the implemented Addon.
  }
}

export const addonManager = new AddonManager();
