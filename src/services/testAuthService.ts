// Temporary test auth service - bypasses database
export class TestAuthService {
  static async login(email: string, password: string) {
    // Hardcoded test credentials
    const testUsers = [
      { id: '1', email: 'admin@exam.com', password: 'admin123', name: 'Admin', role: 'admin' },
      { id: '2', email: 'student@test.com', password: 'password123', name: 'Test Student', role: 'student' }
    ];

    const user = testUsers.find(u => u.email === email && u.password === password);

    if (user) {
      return { user, error: null };
    } else {
      return { user: null, error: 'Invalid email or password' };
    }
  }

  static async register(email: string, password: string, name: string) {
    // For testing, just return success
    return {
      user: { id: '3', email, name, password, role: 'student' },
      error: null
    };
  }
}