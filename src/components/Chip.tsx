import React from "react";
import { usePresentationContext } from "src/components/PresentationContext";
import { Css, Margin, Only, Xss } from "src/Css";
import { useTestIds } from "src/utils/useTestIds";

export interface ChipProps<X> {
  text: string;
  xss?: X;
}

/** Kinda like a chip, but read-only, so no `onClick` or `hover`. */
export function Chip<X extends Only<Xss<Margin>, X>>(props: ChipProps<X>) {
  const { text, xss = {} } = props;
  const { fieldProps } = usePresentationContext();
  const typeScale = fieldProps?.typeScale ?? "sm";
  const tid = useTestIds(props, "chip");
  return (
    <span
      css={{
        ...Css[typeScale].dif.aic.br16.pl1.px1.pyPx(2).gray900.bgGray200.$,
        ...xss,
      }}
      {...tid}
      title={text}
    >
      <span css={Css.lineClamp1.breakAll.$}>{text}</span>
    </span>
  );
}
