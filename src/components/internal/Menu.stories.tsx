import { Meta } from "@storybook/react";
import { ButtonMenu } from "src/components/ButtonMenu";
import { Menu } from "src/components/internal/Menu";
import { noop } from "src/utils";
import { withDimensions } from "src/utils/sb";

export default {
  component: Menu,
  title: "Components/Menu",
  decorators: [withDimensions()],
} as Meta;

export function BasicMenuItems() {
  return (
    <ButtonMenu
      defaultOpen
      trigger={{ label: "Menu Trigger" }}
      items={[
        { label: "Menu item 1", onClick: noop },
        { label: "Menu item 2", onClick: noop },
        { label: "Menu item 3", onClick: noop, disabled: true },
        { label: "Menu item 4", onClick: noop },
      ]}
    />
  );
}

export function IconMenuItems() {
  return (
    <ButtonMenu
      defaultOpen
      trigger={{ label: "Menu Trigger" }}
      items={[
        { label: "Edit", icon: "pencil", onClick: noop },
        { label: "Like", icon: "thumbsUp", onClick: noop },
        { label: "Favorite", icon: "star", onClick: noop },
        { label: "Delete", icon: "trash", onClick: noop },
      ]}
    />
  );
}

export function AvatarMenuItems() {
  return (
    <ButtonMenu
      defaultOpen
      trigger={{ label: "Menu Trigger" }}
      items={[
        {
          label: "Iron man",
          src: "tony-stark.jpg",
          isAvatar: true,
          onClick: noop,
        },
        {
          label: "Captain Marvel",
          src: "captain-marvel.jpg",
          isAvatar: true,
          onClick: noop,
        },
        {
          label: "Captain America",
          src: "captain-america.jpg",
          isAvatar: true,
          onClick: noop,
        },
        {
          label: "Thor",
          src: "thor.jpg",
          isAvatar: true,
          onClick: noop,
        },
        {
          label: "Black Widow",
          src: "/black-widow.jpg",
          isAvatar: true,
          onClick: noop,
        },
      ]}
    />
  );
}

export function ImageMenuItems() {
  return (
    <ButtonMenu
      defaultOpen
      trigger={{ label: "Menu Trigger" }}
      items={[
        {
          label: 'KitchenAid 30" French Door Standard Depth Refrigerator',
          src: "/fridge.jpeg",
          size: 48,
          onClick: noop,
        },
        {
          label: 'KitchenAid 36" Counter Depth French Door Refrigerator',
          src: "/fridge2.jpeg",
          size: 48,
          onClick: noop,
        },
        {
          label: "Piedrafina BellaQuartz Premium Series Countertop",
          src: "/counter-top.jpeg",
          size: 48,
          onClick: noop,
        },
        {
          label: "Some sort of fancy fireplace and mantel",
          src: "/fireplace.jpeg",
          size: 48,
          onClick: noop,
        },
      ]}
    />
  );
}
