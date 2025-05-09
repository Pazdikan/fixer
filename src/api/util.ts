type Taggable = { tags?: string[] };

export interface IUtils {
  /**
   * Checks if an object has a specific tag.
   * @param obj - The taggable object to check.
   * @param tag - The tag to check for.
   * @returns True if the object has the tag, false otherwise.
   */
  hasTag<T extends Taggable>(obj: T, tag: string): boolean;

  /**
   * Adds a tag to an object.
   * @param obj - The taggable object to add the tag to.
   * @param tag - The tag to add.
   * @returns The updated object with the new tag.
   */
  addTag<T extends Taggable>(obj: T, tag: string): T;

  /**
   * Removes a tag from an object.
   * @param obj - The taggable object to remove the tag from.
   * @param tag - The tag to remove.
   * @returns The updated object without the specified tag.
   */
  removeTag<T extends Taggable>(obj: T, tag: string): T;

  /**
   * Formats a time number into a string representation.
   * @param time - The time value to format.
   * @returns The formatted time string.
   */
  formatTime(time: number): string;
}

export class Utils implements IUtils {
  hasTag<T extends Taggable>(obj: T, tag: string): boolean {
    return obj.tags?.includes(tag) ?? false;
  }

  addTag<T extends Taggable>(obj: T, tag: string): T {
    if (this.hasTag(obj, tag)) {
      return obj;
    }

    return {
      ...obj,
      tags: [...(obj.tags || []), tag],
    };
  }

  removeTag<T extends Taggable>(obj: T, tag: string): T {
    return {
      ...obj,
      tags: obj.tags?.filter((t) => t !== tag) ?? [],
    };
  }

  formatTime = (time: number) => {
    const date = new Date(time);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hrs = date.getHours();
    const mins = date.getMinutes();

    return `${year}-${month}-${day} ${hrs}:${mins < 10 ? "0" + mins : mins}`;
  };
}
