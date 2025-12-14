export function PartialType(Base) {
    class PartialDto extends Base {
    }
    Object.defineProperty(PartialDto, "name", { value: `Partial${Base.name}` });
    // Marker for dto.validator middleware
    PartialDto.__partial__ = true;
    return PartialDto;
}
