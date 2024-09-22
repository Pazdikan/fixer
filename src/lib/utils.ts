import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateCharacter = () => {
  return {
      id: Date.now().toString(),
      name: 'Ben',
      surname: 'Dover ' + new Date().getMilliseconds(),
  };
};