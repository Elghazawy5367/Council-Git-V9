import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

const RadioGroup = RadioGroupPrimitive.Root;
const RadioGroupItem = RadioGroupPrimitive.Item;

export { RadioGroup, RadioGroupItem };

// Replace undefined Component
const PlaceholderRadioGroup = () => <div>Radio Group Placeholder</div>;
export default PlaceholderRadioGroup;
