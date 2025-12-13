import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/*.ts'],
  external: ['react', 'react/jsx-runtime'],
  dts: true,
  shims: true,
  exports: true
})