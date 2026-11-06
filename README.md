# Kick PokeIdle Cleaner

Extensão **gratuita** para Google Chrome que esconde mensagens de resgate de bônus do PokeIdle no chat da [Kick](https://kick.com), preservando as conversas normais.

Desenvolvido por **[@andydev0](https://github.com/andydev0)**.

> Projeto independente, sem vínculo oficial com a Kick ou o PokeIdle.

## O que ela oculta?

Mensagens do tipo `Fulano resgatou ...` com os seguintes bônus:

| Bônus | Durações encontradas no canal |
| --- | --- |
| +15% XP PokeIdle | padrão, 3h, 5h e 10h |
| +15% Capture Boost | padrão, 3h, 5h e 10h |
| +15% Secret Lure | padrão, 3h, 5h e 10h |

O filtro reconhece **o nome do bônus, independentemente da duração**. Mensagens normais, comandos e resultados de previsões continuam visíveis.

## Instalação no Chrome (sem Chrome Web Store)

1. Abra o repositório e clique em **Code → Download ZIP**.
2. Extraia o ZIP. **Não** carregue o arquivo ZIP diretamente no Chrome.
3. Abra `chrome://extensions` na barra de endereços.
4. Ative **Modo do desenvolvedor** no canto superior direito.
5. Clique em **Carregar sem compactação**.
6. Selecione a pasta extraída que contém o arquivo `manifest.json`.
7. Abra uma live em `https://kick.com` ou atualize uma aba da Kick já aberta.

Pronto! Resgates compatíveis serão ocultados automaticamente.

## Como ativar ou desativar

Clique no ícone de **Extensões** do Chrome (peça de quebra-cabeça) e abra **Kick PokeIdle Cleaner**. Use a chave para habilitar/desabilitar o filtro.

## Como atualizar a extensão manualmente

1. Baixe novamente o ZIP deste repositório.
2. Substitua os arquivos na mesma pasta extraída.
3. Entre em `chrome://extensions` e clique em **Atualizar** (ou no botão de recarregar da extensão).
4. Atualize a aba da Kick.

## Como funciona?

- A extensão analisa somente o texto do chat nas páginas da Kick.
- Filtra mensagens com `resgatou` e um dos três nomes de bônus suportados.
- Observa novas mensagens com `MutationObserver`, sem temporizador reiniciado a cada mensagem.
- Faz nova varredura quando você volta de outra aba para a live.
- Oferece um interruptor de ativar/desativar com `chrome.storage.sync`.

## Privacidade e permissões

- `storage`: salva sua preferência de ativar/desativar o filtro.
- O script atua somente em `kick.com` e `www.kick.com`.
- Não lê cookies, não coleta dados pessoais, não envia mensagens e não faz requisições externas.
- O Chrome pode sincronizar a preferência de ativação com sua própria conta, caso a sincronização esteja habilitada.

## Problemas e sugestões

Se algum resgate continuar aparecendo, envie uma *issue* com o texto exato da mensagem e, se possível, um print do chat (sem informações privadas). O HTML da Kick pode mudar e exigir ajustes no filtro.

## Estrutura

```text
kick-pokeidle-cleaner/
├── manifest.json
├── content.js
├── popup.html
├── popup.js
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── README.md
├── PRIVACY.md
└── LICENSE
```

## Licença

MIT — veja [LICENSE](LICENSE).
