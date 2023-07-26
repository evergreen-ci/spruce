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
import { MultiSelect } from "./MultiSelect";

const widgets = {
  CheckboxWidget: LeafyGreenCheckBox,
  DateTimeWidget: DateTimePicker,
  MultiSelectWidget: MultiSelect,
  RadioBoxWidget: LeafyGreenRadioBox,
  RadioWidget: LeafyGreenRadio,
  SegmentedControlWidget: LeafyGreenSegmentedControl,
  SelectWidget: LeafyGreenSelect,
  TextWidget: LeafyGreenTextInput,
  TextareaWidget: LeafyGreenTextArea,
};

export default widgets;
