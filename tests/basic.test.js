/**
 * Teste simples da estrutura básica
 * Verifica se o ambiente de testes está configurado
 */

describe('Test Environment', () => {
  test('should have DOM environment available', () => {
    expect(document).toBeDefined();
    expect(window).toBeDefined();
  });

  test('should be able to create DOM elements', () => {
    const div = document.createElement('div');
    div.id = 'test';
    div.textContent = 'Test Content';
    
    document.body.appendChild(div);
    
    const found = document.getElementById('test');
    expect(found).toBeTruthy();
    expect(found.textContent).toBe('Test Content');
  });
  test('should have mocked location', () => {
    expect(window.location).toBeDefined();
    expect(window.location.href).toBeDefined();
  });

  test('should have basic Jest functions', () => {
    expect(jest.fn).toBeDefined();
    expect(jest.spyOn).toBeDefined();
  });
});
