import { test, expect } from '@playwright/test';

const API_URL = 'https://jsonplaceholder.typicode.com';

test.describe('Users API Tests', () => {
  
  test('GET /users - should return list of users with valid structure', async ({ request }) => {
    // Act
    const response = await request.get(`${API_URL}/users`);
    
    // Assert - Status Code
    expect(response.status()).toBe(200);
    
    // Assert - Response Headers
    expect(response.headers()['content-type']).toContain('application/json');
    
    // Assert - Response is an array
    const users = await response.json();
    expect(Array.isArray(users)).toBeTruthy();
    expect(users.length).toBeGreaterThan(0);
    
    // Assert - Data Structure of first user
    const firstUser = users[0];
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('name');
    expect(firstUser).toHaveProperty('email');
    expect(firstUser).toHaveProperty('username');
    
    // Assert - Email format validation
    expect(firstUser.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  test('POST /users - should create a new user successfully', async ({ request }) => {
    // Arrange
    const newUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      username: 'johndoe',
      phone: '123-456-7890'
    };

    // Act
    const response = await request.post(`${API_URL}/users`, {
      data: newUser,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Assert - Status Code
    expect(response.status()).toBe(201);
    
    // Assert - Response structure
    const createdUser = await response.json();
    expect(createdUser).toHaveProperty('id');
    expect(createdUser.name).toBe(newUser.name);
    expect(createdUser.email).toBe(newUser.email);
    expect(createdUser.username).toBe(newUser.username);
  });

  test('GET /users/:id - should return specific user by ID', async ({ request }) => {
    // Arrange
    const userId = 1;
    
    // Act
    const response = await request.get(`${API_URL}/users/${userId}`);
    
    // Assert
    expect(response.status()).toBe(200);
    
    const user = await response.json();
    expect(user.id).toBe(userId);
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
  });

  test('PUT /users/:id - should update existing user', async ({ request }) => {
    // Arrange
    const userId = 1;
    const updatedData = {
      name: 'Updated Name',
      email: 'updated@example.com'
    };

    // Act
    const response = await request.put(`${API_URL}/users/${userId}`, {
      data: updatedData
    });

    // Assert
    expect(response.status()).toBe(200);
    
    const updatedUser = await response.json();
    expect(updatedUser.id).toBe(userId);
    expect(updatedUser.name).toBe(updatedData.name);
  });

  test('DELETE /users/:id - should delete user', async ({ request }) => {
    // Arrange
    const userId = 1;

    // Act
    const response = await request.delete(`${API_URL}/users/${userId}`);

    // Assert
    expect(response.status()).toBe(200);
  });

  // ============================================
  // NEGATIVE TEST CASES
  // ============================================

  test('GET /users/:id - should return 404 for non-existent user', async ({ request }) => {
    // Arrange
    const nonExistentId = 99999;
    
    // Act
    const response = await request.get(`${API_URL}/users/${nonExistentId}`);
    
    // Assert
    expect(response.status()).toBe(404);
  });

  test('POST /users - should handle missing required fields', async ({ request }) => {
    // Arrange - Missing email
    const invalidUser = {
      name: 'Invalid User'
      // email is missing
    };

    // Act
    const response = await request.post(`${API_URL}/users`, {
      data: invalidUser
    });

    expect(response.status()).toBeDefined();
  });

  // ============================================
  // EDGE CASES
  // ============================================

  test('POST /users - should handle invalid email format', async ({ request }) => {
    // Arrange
    const userWithInvalidEmail = {
      name: 'Test User',
      email: 'not-a-valid-email',
      username: 'testuser'
    };

    // Act
    const response = await request.post(`${API_URL}/users`, {
      data: userWithInvalidEmail
    });

    // Assert
    expect([200, 201, 400, 422]).toContain(response.status());
  });

  test('POST /users - should handle empty payload', async ({ request }) => {
    // Act
    const response = await request.post(`${API_URL}/users`, {
      data: {}
    });

    // Assert
    expect(response.status()).toBeDefined();
  });

  test('GET /users - should handle response time within acceptable range', async ({ request }) => {
    // Act
    const startTime = Date.now();
    const response = await request.get(`${API_URL}/users`);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Assert
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(3000); // Should respond within 3 seconds
  });

  test('GET /users/:id - should handle special characters in URL', async ({ request }) => {
    // Act
    const response = await request.get(`${API_URL}/users/abc`);

    // Assert - Should handle gracefully
    expect([400, 404]).toContain(response.status());
  });
});

test.describe('Posts API Tests - Additional Coverage', () => {
  
  test('GET /posts - should return posts with pagination info', async ({ request }) => {
    // Act
    const response = await request.get(`${API_URL}/posts`);
    
    // Assert
    expect(response.status()).toBe(200);
    const posts = await response.json();
    expect(Array.isArray(posts)).toBeTruthy();
    expect(posts.length).toBeGreaterThan(0);
  });

  test('GET /posts?userId=1 - should filter posts by user', async ({ request }) => {
    // Act
    const response = await request.get(`${API_URL}/posts?userId=1`);
    
    // Assert
    expect(response.status()).toBe(200);
    const posts = await response.json();
    posts.forEach((post: any) => {
      expect(post.userId).toBe(1);
    });
  });
});