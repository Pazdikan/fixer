type Taggable = { tags?: string[] };

export class Utils {
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
}
