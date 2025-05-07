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
