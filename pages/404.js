import {
  Box,
  Text,
} from "@skynexui/components";

import appConfig from "../config.json";

export default function Custom404() {
  return (
    <Box
      styleSheet={{
        textAlign: "center",
        paddingTop: "10%",
        backgroundColor: appConfig.theme.colors.primary["050"],
        color: appConfig.theme.colors.neutrals["400"]
      }}
    >
      <Text tag="h1"variant="heading1">404</Text>
      <Text tag="p" variant="body1">Página não encontrada</Text>
      <Text tag="a" href="/" variant="body1">Voltar pra Home</Text> 
    </Box>
  );
}
