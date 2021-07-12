import { Meta } from "@storybook/react";
import { useEffect } from "react";
import { Button, ModalProps, useModal } from "src/components/index";
import { Modal } from "src/components/Modal/Modal";
import { TestModalContent } from "src/components/Modal/TestModalContent";
import { withBeamDecorator, withDimensions } from "src/utils/sb";
import { withPerformance } from "storybook-addon-performance";

export default {
  component: Modal,
  title: "Components/Modal",
  decorators: [withPerformance, withBeamDecorator, withDimensions()],
} as Meta;

export const Small = () => <ModalExample size="sm" />;
export const Medium = () => <ModalExample />;
export const Large = () => <ModalExample size="lg" />;
export const LargeFixedHeight = () => <ModalExample size={{ width: "lg", height: 300 }} />;
export const WithScroll = () => <ModalExample initNumSentences={50} />;
export const LeftAction = () => <ModalExample showLeftAction />;

interface ModalExampleProps extends Pick<ModalProps, "size"> {
  initNumSentences?: number;
  showLeftAction?: boolean;
}

function ModalExample(props: ModalExampleProps) {
  const { size, showLeftAction, initNumSentences = 1 } = props;
  const { openModal } = useModal();

  const modalProps = {
    size,
    title: "The title of the modal that might wrap",
    content: <TestModalContent initNumSentences={initNumSentences} showLeftAction={showLeftAction} />,
  };

  // Immediately open the modal for Chromatic snapshots
  const open = () => openModal(modalProps);
  useEffect(open, [openModal]);

  return <Button label="Open" onClick={open} />;
}
