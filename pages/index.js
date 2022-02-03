import React from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Text,
  TextField,
  Image,
  Icon,
} from "@skynexui/components";
import appConfig from "../config.json";

function Titulo(props) {
  const Tag = props.tag || "h1";
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>{`
        ${Tag} {
          color: ${appConfig.theme.colors.neutrals["000"]};
          font-size: 20px;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}

export default function PaginaInicial() {
  const roteamento = useRouter();

  const [user, setUser] = React.useState({
    name: "",
    isValid: false,
    image: "",
  });

  const [numeberRepository, setNumberRepository] = React.useState(0);
  const [numeberFollower, setNumberFollower] = React.useState(0);

  React.useEffect(() => {
    if (user.isValid) {
      fetch(`https://api.github.com/users/${user.name}`)
        .then((response) => response.json())
        .then(({ public_repos, followers }) => {
          setNumberRepository(public_repos);
          setNumberFollower(followers);
        });
    } else {
      setNumberRepository(0);
      setNumberFollower(0);
    }
  }, [user]);

  function handleErroImage() {
    setUser({ ...user, isValid: false });
  }

  return (
    <>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage: "url(code.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            width: "100%",
            maxWidth: "700px",
            borderRadius: "5px",
            padding: "32px",
            margin: "16px",
            boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
            backgroundColor: appConfig.theme.colors.neutrals[700],
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={function (event) {
              event.preventDefault();
              roteamento.push(`/chat?username=${user.name}`);
            }}
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "50%" },
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <Titulo tag="h2">Boas vindas de volta!</Titulo>
            <Text
              variant="body3"
              styleSheet={{
                marginBottom: "32px",
                color: appConfig.theme.colors.neutrals[300],
              }}
            >
              {appConfig.name}
            </Text>

            <TextField
              value={user.name}
              onChange={function (event) {
                const valor = event.target.value;
                setUser({
                  name: valor,
                  isValid: valor.length > 2,
                  image: `https://github.com/${valor}.png`,
                });
              }}
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
            />
            <Button
              type="submit"
              label="Entrar"
              fullWidth
              disabled={!user.isValid}
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
          {/* Formulário */}

          {/* Photo Area */}
          <Box
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "200px",
              padding: "16px",
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: "1px solid",
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: "10px",
              flex: 1,
              minHeight: "240px",
            }}
          >
            {user.isValid ? (
              <>
                <InnerBoxImage
                  srcImage={user.image}
                  text={user.name}
                  onError={handleErroImage}
                />
              </>
            ) : (
              <InnerBoxImage srcImage="user.png" text="Não encontrado" />
            )}

            <ShowFollowers numeberFollower={numeberFollower} />
            <ShowRepository numeberRepository={numeberRepository} />
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}

function InnerBoxImage({ srcImage, text, onError }) {
  return (
    <>
      <Image
        onError={onError}
        styleSheet={{
          borderRadius: "50%",
          marginBottom: "16px",
          backgroundColor: appConfig.theme.colors.neutrals["000"],
        }}
        src={srcImage}
      />

      <Text
        variant="body4"
        styleSheet={{
          color: appConfig.theme.colors.neutrals[200],
          backgroundColor: appConfig.theme.colors.neutrals[900],
          padding: "3px 10px",
          borderRadius: "1000px",
        }}
      >
        {text}
      </Text>
    </>
  );
}

function ShowFollowers({ numeberFollower }) {
  return (
    <>
      <Box styleSheet={{ display: "flex", marginTop: "8px" }}>
        <Icon
          name="FaUserFriends"
          styleSheet={{ color: appConfig.theme.colors.primary["300"] }}
        />
        <Text
          variant="body4"
          styleSheet={{
            color: appConfig.theme.colors.neutrals[200],
            paddingLeft: "4px",
          }}
        >
          {`${numeberFollower || 0} Seguidores`}
        </Text>
      </Box>
    </>
  );
}

function ShowRepository({ numeberRepository }) {
  return (
    <>
      <Box styleSheet={{ display: "flex", marginTop: "8px" }}>
        <Icon
          name="FaUserFriends"
          styleSheet={{ color: appConfig.theme.colors.primary["300"] }}
        />
        <Text
          variant="body4"
          styleSheet={{
            color: appConfig.theme.colors.neutrals[200],
            paddingLeft: "4px",
          }}
        >
          {`${numeberRepository || 0} Repositórios`}
        </Text>
      </Box>
    </>
  );
}
