import { dockerfile } from '../src/dockerfile';

describe('getDependencyInstallScripts', () => {
  test('should return nothing if no dependencies', () => {
    dockerfile.dependencies = [];
    expect(dockerfile.getDependencyInstallScripts()).toBe('');
  });
  test('should return a dependency script', () => {
    dockerfile.dependencies = ['imagemagick'];
    expect(dockerfile.getDependencyInstallScripts()).toBe('RUN apt-get install imagemagick\n');
  });
  test('should return a multiple dependency scripts', () => {
    dockerfile.dependencies = ['imagemagick', 'graphicsmagick'];
    expect(dockerfile.getDependencyInstallScripts()).toBe('RUN apt-get install imagemagick\nRUN apt-get install graphicsmagick\n');
  });
});
