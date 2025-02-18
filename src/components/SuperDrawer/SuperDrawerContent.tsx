import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useBeamContext } from "src/components/BeamContext";
import { Button, ButtonProps } from "src/components/Button";
import { useSuperDrawer } from "src/components/SuperDrawer/useSuperDrawer";
import { Css } from "src/Css";

interface SuperDrawerContentProps {
  children: ReactNode;
  /**
   * Actions represents an array of button props with represents that different
   * actions that can be conducted in the SuperDrawer page.
   *
   * Ex: A `cancel` and `submit` button
   * */
  actions?: ButtonProps[];
}

/**
 * Helper component to place the given children and actions into the appropriate
 * DOM format to render inside the SuperDrawer.
 *
 * NOTE: This does not include the header props since the caller will be the one
 * that knows how to handle the title, prev/next link and the onClose handler.
 */
export const SuperDrawerContent = ({ children, actions }: SuperDrawerContentProps) => {
  const { closeDrawerDetail } = useSuperDrawer();
  const { drawerContentStack: contentStack } = useBeamContext();

  // Determine if the current element is a new content element or an detail element
  const { kind } = contentStack.current[contentStack.current.length - 1];

  function wrapWithMotionAndMaybeBack(children: ReactNode): ReactNode {
    if (kind === "open") {
      return (
        <motion.div key="content" css={Css.p3.fg1.overflowAuto.$}>
          {children}
        </motion.div>
      );
    } else if (kind === "detail") {
      return (
        <motion.div
          key="content"
          css={Css.px3.pt2.pb3.fg1.$}
          animate={{ overflow: "auto" }}
          transition={{ overflow: { delay: 0.3 } }}
        >
          <Button label="Back" icon="chevronLeft" variant="tertiary" onClick={closeDrawerDetail} />
          <motion.div
            initial={{ x: 1040, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ ease: "linear", duration: 0.3, opacity: { delay: 0.15 } }}
            exit={{ x: 1040, opacity: 0 }}
            css={Css.pt2.$}
          >
            {children}
          </motion.div>
        </motion.div>
      );
    } else {
      // Hides content changes when closing the drawer
      // TODO: Potentially use a boolean to trigger close action so content does
      // not need to disappear during exit.
      return <motion.div key="content" css={Css.p3.fg1.$} style={{ overflow: "auto" }} />;
    }
  }

  return (
    <>
      {wrapWithMotionAndMaybeBack(children)}
      {/* Optionally render footer section with row of given footer buttons */}
      {actions && (
        <footer css={Css.bt.bGray200.p3.df.aic.jcfe.$}>
          <div css={Css.df.childGap1.$}>
            {actions.map((buttonProps, i) => (
              <Button key={i} {...buttonProps} />
            ))}
          </div>
        </footer>
      )}
    </>
  );
};
