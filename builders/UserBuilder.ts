/**
 * Builder pattern for creating test user objects
 
 */
export class UserBuilder {
  private name: string = 'Test User';
  private email: string = `test-${Date.now()}@example.com`;
  private password: string = 'Password123!';
  private role: string = 'user';
  private active: boolean = true;

  /**
   * Set the user's name
   */
  withName(name: string): this {
    this.name = name;
    return this;
  }

  /**
   * Set the user's email
   */
  withEmail(email: string): this {
    this.email = email;
    return this;
  }

  /**
   * Set the user's password
   */
  withPassword(password: string): this {
    this.password = password;
    return this;
  }

  /**
   * Set the user's role
   */
  withRole(role: string): this {
    this.role = role;
    return this;
  }

  /**
   * Set the user's active status
   */
  withActiveStatus(active: boolean): this {
    this.active = active;
    return this;
  }

  /**
   * Build and return the user object
   */
  build() {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
      active: this.active
    };
  }

  /**
   * Quick builder for admin users
   */
  static admin(): UserBuilder {
    return new UserBuilder()
      .withRole('admin')
      .withName('Admin User');
  }

  /**
   * Quick builder for regular users
   */
  static regular(): UserBuilder {
    return new UserBuilder()
      .withRole('user')
      .withName('Regular User');
  }
}