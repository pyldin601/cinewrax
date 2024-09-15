import z, { ZodTypeDef } from "zod";

const strNumber = z.preprocess<z.ZodNumber>(Number, z.number());
const strBoolean = z.preprocess<z.ZodBoolean>((v) => String(v).toLowerCase() === "true", z.boolean());

export const getEnvValue = <T>(
  env: { [key: string]: string | undefined },
  name: string,
  zodType: z.ZodType<T, ZodTypeDef, unknown>,
) => {
  const result = zodType.safeParse(env[name]);
  if (!result.success) {
    throw new Error(`Environment variable ${name} value is not compatible with type ${JSON.stringify(zodType)}`);
  }

  return result.data;
};

export const getEnvStringValue = (env: { [key: string]: string | undefined }, name: string, defaultValue?: string) => {
  const type = defaultValue !== undefined ? z.string().default(defaultValue) : z.string();

  return getEnvValue(env, name, type);
};

export const getEnvNumberValue = (env: { [key: string]: string | undefined }, name: string, defaultValue?: number) => {
  const type = defaultValue !== undefined ? strNumber.default(defaultValue) : strNumber;

  return getEnvValue(env, name, type);
};

export const getEnvBoolValue = (env: { [key: string]: string | undefined }, name: string, defaultValue?: boolean) => {
  const type = defaultValue !== undefined ? strBoolean.default(defaultValue) : strBoolean;

  return getEnvValue(env, name, type);
};
