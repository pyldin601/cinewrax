export function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Environment variable ${name} should be defined.`);
  }

  return value;
}
