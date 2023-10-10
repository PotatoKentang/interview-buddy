import { Text, View } from "@gluestack-ui/themed";

export const ChatBubble = ({
  from,
  text,
  children,
}: {
  from: string;
  text: string;
  children?: React.ReactNode;
}) => {
  const bubbleStyle: any =
    from === "system"
      ? { alignSelf: "center" }
      : from === "user"
      ? { alignSelf: "flex-end" }
      : { alignSelf: "flex-start" };

  const textStyle: any =
    from === "system"
      ? { textAlign: "center" } // Center the text in the system message
      : null; // No specific text alignment for other messages

  return (
    <View
      w="$4/5"
      style={[
        bubbleStyle,
        {
          padding: 10,
          margin: 10,
          backgroundColor: "#FAF9F6",
          borderRadius: 20,
          shadowColor: "#000000",
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 20,
          elevation: 4,
        },
      ]}
    >
      <Text style={[textStyle, {fontWeight: "bold", marginBottom: 6}]}>{from[0].toUpperCase()+from.slice(1)}</Text>
      <Text style={textStyle}>{text}</Text>
      {children}
    </View>
  );
};
