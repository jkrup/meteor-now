import { getFolderName } from '../constants';

describe('constants test', () => {
  test('it should correctly get the projects name (mac)', async () => {
    const folderName = getFolderName('/some/fake/path/to/a/folder', false);
    expect(folderName).toBe('folder');
  });

  test('it should correctly get the projects name (win)', async () => {
    const folderName = getFolderName('\\some\\fake\\path\\to\\a\\folder', true);
    expect(folderName).toBe('folder');
  });
});
