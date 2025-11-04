type AbstractCtor<T = any> = abstract new (...args: any[]) => T

export function PartialType<TBase extends AbstractCtor>(Base: TBase) {
    abstract class PartialDto extends (Base as any) { }

    Object.defineProperty(PartialDto, "name", { value: `Partial${Base.name}` });

    // Marker for dto.validator middleware

    (PartialDto as any).__partial__ = true

    return PartialDto as unknown as AbstractCtor<Partial<InstanceType<TBase>>> & { __partial__: true }
}
