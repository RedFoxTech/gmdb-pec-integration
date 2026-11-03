import { Box } from "@mui/material";
import { Autocomplete, Button, Chip, Text } from "@/components/common";
import typography from "@/shared/theme/typography-theme";
import { useMemo, useState } from "react";
import { useTag } from "@/hooks";
import { SelectOption } from "@/domain/entities/common";

export type TagSectionProps = {
  tags: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
};

const TagSection: React.FC<TagSectionProps> = ({ tags, onAdd, onRemove }) => {
  const [newTag, setNewTag] = useState<string>("");
  const [customTag, setCustomTag] = useState("");

  const { tags: allTags } = useTag({
    getTagsOptions: {
      enabled: true,
    },
  });

  const handleAdd = () => {
    const value = newTag || customTag;
    if (
      value.length > 0 &&
      !tags.some((tag) => tag.toUpperCase() === value.toUpperCase())
    ) {
      onAdd(value);
      setNewTag("");
      setCustomTag("");
    }
  };

  const tagsOptions: SelectOption[] = useMemo(
    () => allTags.map((item) => ({ value: item.name, label: item.name })),
    [allTags]
  );

  return (
    <Box>
      <Text {...typography.title.h3l} mb="3.6rem">
        Etiquetas
      </Text>
      <Box display="flex" gap="2.4rem">
        <Box flex={1}>
          <Autocomplete
            value={tagsOptions.find((i) => i.value === newTag)}
            freeSolo
            inputValue={customTag}
            onInputChange={(_, value) => setCustomTag(value)}
            options={tagsOptions}
            onChange={(_, option) =>
              setNewTag((option as SelectOption).value as string)
            }
          />
        </Box>
        <Button variant="outlined" onClick={handleAdd}>
          Adicionar
        </Button>
      </Box>
      <Box p="1.6rem" display="flex" gap="1rem" flexWrap="wrap">
        {tags.map((item) => (
          <Chip key={item} label={item} onDelete={() => onRemove(item)} />
        ))}
      </Box>
    </Box>
  );
};

export default TagSection;
