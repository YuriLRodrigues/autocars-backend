import { validateUsername } from './validate-username';

describe('Validate Username - Function', () => {
  it('should be able to return the username validated if the user already follows the standars', () => {
    const output = validateUsername('yuri12teste_rodrigues');

    expect(output).toEqual('yuri12teste_rodrigues');
  });

  it('should be able to return new username if the user does not follows the standards', () => {
    const output = validateUsername('Yuri$12Teste-_.Rodrigues#?;');

    expect(output).toEqual('yuri12Teste_.Rodrigues');
  });
});
