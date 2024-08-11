import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";

const ExpandableText = ({
  text,
  maxLines,
  style,
}: {
  text: string;
  maxLines?: number;
  style?: any;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity onPress={() => setExpanded(!expanded)}>
      <Text numberOfLines={expanded ? undefined : maxLines} style={style}>
        {text}
        {!expanded && text.length > 100 && "..."}
      </Text>
    </TouchableOpacity>
  );
};

export default ExpandableText;
