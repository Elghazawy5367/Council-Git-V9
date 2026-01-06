import React from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export const Toaster = () => {
  const { theme = "system" } = useTheme();

  React.useEffect(() => {
    toast("Toaster initialized with theme: " + theme);
  }, [theme]);

  return null;
};

const PlaceholderComponent = () => <div>Placeholder</div>;
export default PlaceholderComponent;
