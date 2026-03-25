import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';

// ─── Auth Route Tests ──────────────────────────────────────────────────────────
// These tests call the actual API endpoints.
// Set BASE_URL to your running server (e.g. http://localhost:4000).
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:4000';

async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
}

async function get(path, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${BASE_URL}${path}`, { headers });
  return { status: res.status, body: await res.json() };
}

// ── Signup ──────────────────────────────────────────────────────────────────
describe('POST /api/v1/auth/signup', () => {
  it('should return 400 when required fields are missing', async () => {
    const { status, body } = await post('/api/v1/auth/signup', {
      email: 'test@example.com',
    });
    assert.equal(status, 400);
    assert.equal(body.success, false);
  });

  it('should return 400 when passwords do not match', async () => {
    const { status, body } = await post('/api/v1/auth/signup', {
      firstName: 'Test',
      lastName: 'User',
      email: `test_${Date.now()}@example.com`,
      password: 'Password@123',
      confirmPassword: 'WrongPassword@123',
      accountType: 'Student',
    });
    assert.equal(status, 400);
    assert.equal(body.success, false);
  });
});

// ── Login ───────────────────────────────────────────────────────────────────
describe('POST /api/v1/auth/login', () => {
  it('should return 400 when credentials are missing', async () => {
    const { status, body } = await post('/api/v1/auth/login', {});
    assert.equal(status, 400);
    assert.equal(body.success, false);
  });

  it('should return 401 for invalid credentials', async () => {
    const { status, body } = await post('/api/v1/auth/login', {
      email: 'nonexistent@example.com',
      password: 'WrongPass@123',
    });
    assert.ok(status === 401 || status === 404);
    assert.equal(body.success, false);
  });
});

// ── OTP Verify ─────────────────────────────────────────────────────────────
describe('POST /api/v1/auth/verify-otp', () => {
  it('should return 400 for invalid or expired OTP', async () => {
    const { status, body } = await post('/api/v1/auth/verifyOTP', {
      email: 'test@example.com',
      otp: '000000',
    });
    assert.ok(status === 400 || status === 404);
    assert.equal(body.success, false);
  });
});

// ── Forgot Password ────────────────────────────────────────────────────────
describe('POST /api/v1/auth/reset-password-token', () => {
  it('should return 400 for unregistered email', async () => {
    const { status, body } = await post('/api/v1/auth/reset-password-token', {
      email: 'nobody@example.com',
    });
    assert.ok(status === 400 || status === 404);
    assert.equal(body.success, false);
  });
});

// ── Protected route without token ──────────────────────────────────────────
describe('Protected Routes (no token)', () => {
  it('should reject profile access without token', async () => {
    const { status, body } = await get('/api/v1/profile/getUserDetails');
    assert.equal(status, 401);
    assert.equal(body.success, false);
  });

  it('should reject admin stats without token', async () => {
    const { status, body } = await get('/api/v1/admin/stats');
    assert.equal(status, 401);
    assert.equal(body.success, false);
  });
});

// ── Courses ────────────────────────────────────────────────────────────────
describe('GET /api/v1/course/getAllCourses', () => {
  it('should return 200 and an array of courses', async () => {
    const { status, body } = await get('/api/v1/course/getAllCourses');
    assert.equal(status, 200);
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
  });
});

describe('GET /api/v1/course/getAverageRating', () => {
  it('should return 200', async () => {
    const { status, body } = await get('/api/v1/course/getAverageRating');
    assert.equal(status, 200);
  });
});
