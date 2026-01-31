import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calculate skill level from assessment score
export function calculateSkillLevel(score: number): 'Beginner' | 'Intermediate' | 'Advanced' {
  if (score <= 30) return 'Beginner'
  if (score <= 70) return 'Intermediate'
  return 'Advanced'
}

// Calculate XP needed for next level
export function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

// Calculate total XP needed to reach a level
export function getTotalXPForLevel(level: number): number {
  let total = 0
  for (let i = 1; i < level; i++) {
    total += getXPForLevel(i)
  }
  return total
}

// Check if user should level up
export function shouldLevelUp(currentLevel: number, totalXP: number): boolean {
  const xpNeeded = getTotalXPForLevel(currentLevel + 1)
  return totalXP >= xpNeeded
}

// Calculate daily goal XP based on time commitment
export function getDailyGoalXP(minutes: number): number {
  // Roughly 10 XP per minute of learning
  return minutes * 10
}
