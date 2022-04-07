import { DateTimePicker } from "./DateTimePicker";
import {
  LeafyGreenTextInput,
  LeafyGreenTextArea,
  LeafyGreenSelect,
  LeafyGreenRadio,
  LeafyGreenRadioBox,
  LeafyGreenCheckBox,
  LeafyGreenSegmentedControl,
} from "./LeafyGreenWidgets";

const widgets = {
  DateTimeWidget: DateTimePicker,
  TextWidget: LeafyGreenTextInput,
  TextareaWidget: LeafyGreenTextArea,
  CheckboxWidget: LeafyGreenCheckBox,
  SegmentedControlWidget: LeafyGreenSegmentedControl,
  SelectWidget: LeafyGreenSelect,
  RadioWidget: LeafyGreenRadio,
  RadioBoxWidget: LeafyGreenRadioBox,
};

export default widgets;
