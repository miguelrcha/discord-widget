# discord-widget

Componente único e autocontido que exibe seu status ao vivo do Discord (jogando, VS Code, Spotify) usando [Lanyard](https://github.com/Phineas/lanyard).

Baseado na implementação real usada em [miguelrcha.dev](https://github.com/miguelrcha/miguelrcha.dev).

## Uso

1. Copie `discord-widget.tsx` para o seu projeto (React + Tailwind).
2. Entre em https://discord.gg/lanyard com sua conta do Discord — é necessário compartilhar um servidor com o bot do Lanyard para ele começar a cachear sua presença.
3. Use o componente:

```tsx
import { DiscordWidget } from "@/components/discord-widget";

<DiscordWidget discordUserId="SEU_DISCORD_USER_ID" theme="light" />
```

## Props

| Prop            | Tipo               | Padrão       | Descrição                                   |
| --------------- | ------------------ | ------------ | -------------------------------------------- |
| `discordUserId` | `string`           | —            | Seu ID de usuário do Discord (17–20 dígitos) |
| `theme`         | `"light" \| "dark"` | `"light"`   | Tema visual do widget                        |
| `title`         | `string`            | `"Activity"` | Texto do cabeçalho                           |

Se você não estiver com nenhuma atividade ativa (Spotify ou "Playing"), o componente não renderiza nada.
