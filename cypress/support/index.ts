import { setGlobalConfig } from "@storybook/testing-react";
import * as preview from "../../.storybook/preview";

// Making storybook testing library aware of global decorators
setGlobalConfig(preview);
