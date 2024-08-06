import createSlug from '../../helpers/createSlug';

describe('createSlug', () => {
  test('should create a slug from first name and last name initial', () => {
    expect(createSlug('John', 'Doe')).toBe('john-d');
  });

  test('should handle lowercase input correctly', () => {
    expect(createSlug('jane', 'smith')).toBe('jane-s');
  });

  test('should handle mixed case input correctly', () => {
    expect(createSlug('Alice', 'Johnson')).toBe('alice-j');
  });

  test('should handle empty first name', () => {
    expect(createSlug('', 'Brown')).toBe('-b');
  });

  test('should handle empty last name', () => {
    expect(createSlug('Charlie', '')).toBe('charlie-');
  });

  test('should handle single character first name and last name', () => {
    expect(createSlug('A', 'B')).toBe('a-b');
  });

  test('should handle names with spaces correctly', () => {
    expect(createSlug('Mary Jane', 'Watson')).toBe('mary jane-w');
  });

  test('should handle special characters in names correctly', () => {
    expect(createSlug('Anna-Maria', 'O\'Connor')).toBe('anna-maria-o');
  });
});
