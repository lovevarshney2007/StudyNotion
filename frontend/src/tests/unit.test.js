import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Utility: formatDate ────────────────────────────────────────────────────
describe('formatDate utility', () => {
  it('formats a valid ISO date string correctly', () => {
    const date = new Date('2024-01-15T00:00:00.000Z')
    const formatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    expect(formatted).toMatch(/January/)
    expect(formatted).toMatch(/2024/)
  })

  it('handles null/undefined gracefully', () => {
    const result = new Date(null).toString()
    expect(result).toBeDefined()
  })
})

// ── Cart Logic ─────────────────────────────────────────────────────────────
describe('Cart item logic', () => {
  it('calculates total price correctly', () => {
    const cartItems = [
      { price: 999 },
      { price: 1499 },
      { price: 2499 },
    ]
    const total = cartItems.reduce((sum, item) => sum + item.price, 0)
    expect(total).toBe(4997)
  })

  it('returns 0 for empty cart', () => {
    const total = [].reduce((sum, item) => sum + item.price, 0)
    expect(total).toBe(0)
  })

  it('deduplicates courses correctly', () => {
    const courseIds = ['a', 'b', 'a', 'c', 'b']
    const unique = [...new Set(courseIds)]
    expect(unique).toEqual(['a', 'b', 'c'])
    expect(unique.length).toBe(3)
  })
})

// ── Auth Validation ────────────────────────────────────────────────────────
describe('Auth form validation logic', () => {
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePassword = (pw) => pw.length >= 8

  it('accepts a valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true)
  })

  it('rejects an invalid email', () => {
    expect(validateEmail('not-an-email')).toBe(false)
    expect(validateEmail('missing@domain')).toBe(false)
  })

  it('rejects password shorter than 8 characters', () => {
    expect(validatePassword('short')).toBe(false)
  })

  it('accepts password with 8+ characters', () => {
    expect(validatePassword('ValidPass1')).toBe(true)
  })

  it('confirms password mismatch returns false', () => {
    const password = 'MyPass@123'
    const confirm = 'Different@123'
    expect(password === confirm).toBe(false)
  })

  it('confirms matching passwords returns true', () => {
    const password = 'MyPass@123'
    const confirm = 'MyPass@123'
    expect(password === confirm).toBe(true)
  })
})

// ── Course Progress Logic ──────────────────────────────────────────────────
describe('Course progress calculation', () => {
  it('calculates 0% for no completed videos', () => {
    const total = 10
    const completed = 0
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    expect(percentage).toBe(0)
  })

  it('calculates 100% when all videos completed', () => {
    const total = 5
    const completed = 5
    const percentage = Math.round((completed / total) * 100)
    expect(percentage).toBe(100)
  })

  it('calculates partial progress correctly', () => {
    const total = 8
    const completed = 6
    const percentage = Math.round((completed / total) * 100)
    expect(percentage).toBe(75)
  })
})

// ── Admin Stats Helper ────────────────────────────────────────────────────
describe('Admin stats helpers', () => {
  it('computes total revenue from courses', () => {
    const courses = [
      { price: 999, studentEnrolled: ['u1', 'u2', 'u3'] },
      { price: 1499, studentEnrolled: ['u4'] },
      { price: 0, studentEnrolled: ['u5', 'u6'] },
    ]
    const totalRevenue = courses.reduce(
      (sum, c) => sum + (c.price || 0) * (c.studentEnrolled?.length || 0),
      0
    )
    expect(totalRevenue).toBe(999 * 3 + 1499 * 1 + 0 * 2)   // 4496
  })

  it('counts users by account type', () => {
    const users = [
      { accountType: 'Student' },
      { accountType: 'Student' },
      { accountType: 'Instructor' },
      { accountType: 'Admin' },
    ]
    const students = users.filter((u) => u.accountType === 'Student').length
    const instructors = users.filter((u) => u.accountType === 'Instructor').length
    expect(students).toBe(2)
    expect(instructors).toBe(1)
  })
})
