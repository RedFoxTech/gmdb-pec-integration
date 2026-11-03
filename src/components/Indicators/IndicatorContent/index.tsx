import { Box } from "@mui/material";
import { Text, TextHighlight } from "@/components/common";
import typography from "@/shared/theme/typography-theme";
import theme from "@/shared/theme/material-theme";
import { Fragment, ReactElement } from "react";

export type IndicatorWithBadgeItem = {
  text: string;
  smallText?: boolean;
  textIcon?: ReactElement;
  badgeText: string;
  badgeColor: string;
  badgeBg: string;
  badgeIcon?: ReactElement;
  border?: boolean;
  smallSpace?: boolean;
};

export type IndicatorWithBadgeProps = {
  items: IndicatorWithBadgeItem[];
};

const IndicatorWithBadge: React.FC<IndicatorWithBadgeProps> = ({ items }) => {
  return (
    <Box display="flex" alignItems="stretch">
      {items.map((item, index) => (
        <Fragment key={`item-${index}`}>
          <Box
            borderLeft={
              item.border
                ? `0.1rem solid ${theme.palette.grey[200]}`
                : undefined
            }
            mr={
              index < items.length - 1
                ? item.smallSpace
                  ? "2.4rem"
                  : "3.9rem"
                : undefined
            }
            pl={item.border ? "1.2rem" : undefined}
            display="flex"
            alignItems="flex-end"
          >
            <Box>
              <Box display="flex" gap="0.4rem">
                <Text
                  {...(item.smallText
                    ? typography.paragraph.sb1
                    : typography.title.h3sb)}
                  color={theme.palette.grey["500"]}
                  mb="0.4rem"
                >
                  {item.text}
                </Text>
                {item.textIcon}
              </Box>
              <TextHighlight
                label={item.badgeText}
                color={item.badgeColor}
                bgColor={item.badgeBg}
                icon={item.badgeIcon}
              />
            </Box>
          </Box>
          {/* {index < items.length - 1 && (
            <Box width="0.1rem" bgcolor={theme.palette.grey[200]} />
          )} */}
        </Fragment>
      ))}
      {/* <Box>
        <Text
          {...typography.title.h3sb}
          color={theme.palette.grey["500"]}
          mb="0.4rem"
        >
          80% / 4.420
        </Text>
        <TextHighlight label="Jovens 9 a 14 anos (% / Qtd )" />
      </Box>
      <Box width="0.1rem" bgcolor={theme.palette.grey[200]} />
      <Box>
        <Text
          {...typography.title.h3sb}
          color={theme.palette.grey["500"]}
          mb="0.4rem"
        >
          80% / 4.420
        </Text>
        <TextHighlight label="Jovens 9 a 14 anos (% / Qtd )" />
      </Box> */}
    </Box>
  );
};

export default IndicatorWithBadge;
