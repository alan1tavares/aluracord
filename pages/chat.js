import React from "react";
import { useRouter } from "next/router";
import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import { createClient } from "@supabase/supabase-js";
import appConfig from "../config.json";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";
import Header from "../src/components/Header";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagemEmTempoReal(adicionaMensagm, removeMessage) {
  return supabaseClient
    .from("mensagens")
    .on("INSERT", (response) => {
      adicionaMensagm(response.new);
    })
    .on('DELETE', (response) => {
      removeMessage(response.old);
    })
    .subscribe();
}

export default function ChatPage() {
  const roteamento = useRouter();
  const usuarioLogado = roteamento.query.username;

  const [mensagem, setMensagem] = React.useState("");
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

  React.useEffect(() => {
    supabaseClient
      .from("mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        setListaDeMensagens(data);
      });

    escutaMensagemEmTempoReal(
      (novaMensagem) => {
        setListaDeMensagens((valorAtualDaLista) => {
          return [novaMensagem, ...valorAtualDaLista];
        });
      },
      (oldMessage) => {
        setListaDeMensagens((currentValue) => {
          return currentValue.filter((value) => value.id !== oldMessage.id)
        })
      }
    );

  }, []);

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      de: usuarioLogado,
      texto: novaMensagem,
    };

    supabaseClient
      .from("mensagens")
      .insert([mensagem])
      .then(({ data }) => { });

    setMensagem("");
  }

  async function handleDeleteMessage(id) {
    console.log('deleção do id: ' + id);
    await supabaseClient
      .from('mensagens')
      .delete()
      .match({ 'id': id })
  }
  return (
    <Box

      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList mensagens={listaDeMensagens} handleDeleteMessage={handleDeleteMessage} />

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                setMensagem(event.target.value);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <ButtonSendSticker
              onStickerClick={(sticker) => {
                handleNovaMensagem(`:sticker:${sticker}`);
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function MessageList(props) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                styleSheet={{ flex: 1, display: "flex", alignItems: "center" }}
              >
                <Image
                  styleSheet={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: "8px",
                  }}
                  src={`https://github.com/${mensagem.de}.png`}
                />
                <Text tag="strong">{mensagem.de}</Text>
                <Text
                  styleSheet={{
                    fontSize: "10px",
                    marginLeft: "8px",
                    color: appConfig.theme.colors.neutrals[300],
                  }}
                  tag="span"
                >
                  {new Date().toLocaleDateString()}
                </Text>
              </Box>

              <Box
                styleSheet={{ flex: 1, textAlign: "end", paddingRight: "32px" }}
              >
                <Text
                  styleSheet={{
                    color: appConfig.theme.colors.neutrals[300],
                    fontWeight: "bolder",
                    hover: {
                      color: "red",
                      cursor: "pointer"
                    }
                  }}
                  onClick={() => props.handleDeleteMessage(mensagem.id)}
                >
                  x
                </Text>
              </Box>
            </Box>
            {mensagem.texto.startsWith(":sticker:") ? (
              <Image src={mensagem.texto.replace(":sticker:", "")} />
            ) : (
              mensagem.texto
            )}
          </Text>
        );
      })}
    </Box>
  );
}
